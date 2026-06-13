-- Toko & Poppy branch admin / franchisee access layer
-- Run this once after the main enrollment schema has already been installed.

alter type public.user_role add value if not exists 'branch_admin';

create table if not exists public.branch_admin_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 150),
  phone text not null check (char_length(trim(phone)) between 6 and 40),
  email text not null,
  status public.application_status not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.branch_admin_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  is_active boolean not null default true,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, branch_id)
);

drop trigger if exists branch_admin_applications_set_updated_at
  on public.branch_admin_applications;
create trigger branch_admin_applications_set_updated_at
before update on public.branch_admin_applications
for each row execute function public.set_updated_at();

drop trigger if exists branch_admin_assignments_set_updated_at
  on public.branch_admin_assignments;
create trigger branch_admin_assignments_set_updated_at
before update on public.branch_admin_assignments
for each row execute function public.set_updated_at();

create or replace function private.is_branch_admin_for_branch(target_branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1
    from public.profiles p
    join public.branch_admin_assignments baa
      on baa.user_id = p.id
    where p.id = (select auth.uid())
      and p.role::text = 'branch_admin'
      and baa.branch_id = target_branch_id
      and baa.is_active = true
  );
$$;

revoke all on function private.is_branch_admin_for_branch(uuid) from public;
grant execute on function private.is_branch_admin_for_branch(uuid) to authenticated;

create or replace function public.submit_branch_admin_application(
  p_full_name text,
  p_phone text,
  p_branch_id uuid
)
returns public.branch_admin_applications
language plpgsql
security definer
set search_path = public, private
as $$
declare
  applicant_id uuid := auth.uid();
  applicant_email text;
  saved_application public.branch_admin_applications;
begin
  if applicant_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.branches
    where id = p_branch_id and is_active = true
  ) then
    raise exception 'Branch is not available';
  end if;

  select email into applicant_email
  from auth.users
  where id = applicant_id;

  insert into public.profiles (id, role)
  values (applicant_id, 'parent')
  on conflict (id) do nothing;

  insert into public.branch_admin_applications (
    user_id,
    branch_id,
    full_name,
    phone,
    email,
    status,
    rejection_reason,
    reviewed_by,
    reviewed_at
  )
  values (
    applicant_id,
    p_branch_id,
    trim(p_full_name),
    trim(p_phone),
    coalesce(applicant_email, ''),
    'pending'::public.application_status,
    null,
    null,
    null
  )
  on conflict (user_id) do update set
    branch_id = excluded.branch_id,
    full_name = excluded.full_name,
    phone = excluded.phone,
    email = excluded.email,
    status = 'pending'::public.application_status,
    rejection_reason = null,
    reviewed_by = null,
    reviewed_at = null,
    updated_at = now()
  returning * into saved_application;

  return saved_application;
end;
$$;

create or replace function public.review_branch_admin_application(
  p_application_id uuid,
  p_decision text,
  p_rejection_reason text default null
)
returns public.branch_admin_applications
language plpgsql
security definer
set search_path = public, private
as $$
declare
  reviewer_id uuid := auth.uid();
  target_application public.branch_admin_applications;
  saved_application public.branch_admin_applications;
begin
  if reviewer_id is null or not private.is_admin() then
    raise exception 'Only main admins can review branch admins';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'Invalid review decision';
  end if;

  select *
  into target_application
  from public.branch_admin_applications
  where id = p_application_id
  for update;

  if target_application.id is null then
    raise exception 'Branch admin application not found';
  end if;

  update public.branch_admin_applications
  set status = p_decision::public.application_status,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      rejection_reason = case
        when p_decision = 'rejected' then nullif(trim(coalesce(p_rejection_reason, '')), '')
        else null
      end,
      updated_at = now()
  where id = p_application_id
  returning * into saved_application;

  if p_decision = 'approved' then
    -- Dynamic SQL avoids the Postgres "unsafe use of new enum value" issue
    -- when this migration is run in one SQL Editor transaction.
    execute 'insert into public.profiles (id, role)
             values ($1, $2::public.user_role)
             on conflict (id) do update set
               role = excluded.role,
               updated_at = now()'
      using target_application.user_id, 'branch_admin';

    insert into public.branch_admin_assignments (
      user_id,
      branch_id,
      is_active,
      approved_by,
      approved_at
    )
    values (
      target_application.user_id,
      target_application.branch_id,
      true,
      reviewer_id,
      now()
    )
    on conflict (user_id, branch_id) do update set
      is_active = true,
      approved_by = excluded.approved_by,
      approved_at = excluded.approved_at,
      updated_at = now();
  else
    update public.branch_admin_assignments
    set is_active = false,
        updated_at = now()
    where user_id = target_application.user_id;
  end if;

  return saved_application;
end;
$$;

revoke all on function public.submit_branch_admin_application(text, text, uuid) from public;
grant execute on function public.submit_branch_admin_application(text, text, uuid) to authenticated;

revoke all on function public.review_branch_admin_application(uuid, text, text) from public;
grant execute on function public.review_branch_admin_application(uuid, text, text) to authenticated;

alter table public.branch_admin_applications enable row level security;
alter table public.branch_admin_assignments enable row level security;

drop policy if exists "Applicants read their branch admin request"
  on public.branch_admin_applications;
create policy "Applicants read their branch admin request"
on public.branch_admin_applications
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Admins read branch admin requests"
  on public.branch_admin_applications;
create policy "Admins read branch admin requests"
on public.branch_admin_applications
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins manage branch admin requests"
  on public.branch_admin_applications;
create policy "Admins manage branch admin requests"
on public.branch_admin_applications
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Branch admins read their assignment"
  on public.branch_admin_assignments;
create policy "Branch admins read their assignment"
on public.branch_admin_assignments
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Admins read branch admin assignments"
  on public.branch_admin_assignments;
create policy "Admins read branch admin assignments"
on public.branch_admin_assignments
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins manage branch admin assignments"
  on public.branch_admin_assignments;
create policy "Admins manage branch admin assignments"
on public.branch_admin_assignments
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Branch admins can read branch enrollment applications"
  on public.enrollment_applications;
create policy "Branch admins can read branch enrollment applications"
on public.enrollment_applications
for select
to authenticated
using (
  branch_id is not null
  and private.is_branch_admin_for_branch(branch_id)
);

drop policy if exists "Branch admins can read assigned branch"
  on public.branches;
create policy "Branch admins can read assigned branch"
on public.branches
for select
to authenticated
using (private.is_branch_admin_for_branch(id));

grant select on public.branch_admin_applications to authenticated;
grant select on public.branch_admin_assignments to authenticated;
