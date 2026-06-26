-- Toko & Poppy branch staff / teacher access layer
-- Run after:
-- 1) outputs/supabase-enrollment-schema.sql
-- 2) outputs/supabase-branch-admin-schema.sql
-- 3) outputs/supabase-learning-history-schema.sql

create extension if not exists pgcrypto;
create schema if not exists private;

alter type public.user_role add value if not exists 'branch_teacher';

create table if not exists public.branch_teacher_invitations (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  invited_by uuid references auth.users(id) on delete set null default auth.uid(),
  teacher_name text not null check (char_length(trim(teacher_name)) between 2 and 150),
  teacher_email text,
  teacher_phone text,
  invite_code text not null unique default lower(replace(gen_random_uuid()::text, '-', '')),
  status text not null default 'invited'
    check (status in ('invited', 'pending', 'active', 'rejected', 'cancelled', 'expired', 'suspended')),
  expires_at timestamptz not null default (now() + interval '30 days'),
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branch_teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  invitation_id uuid references public.branch_teacher_invitations(id) on delete set null,
  display_name text,
  phone text,
  is_active boolean not null default true,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, branch_id)
);

drop trigger if exists branch_teacher_invitations_set_updated_at
  on public.branch_teacher_invitations;
create trigger branch_teacher_invitations_set_updated_at
before update on public.branch_teacher_invitations
for each row execute function public.set_updated_at();

drop trigger if exists branch_teacher_assignments_set_updated_at
  on public.branch_teacher_assignments;
create trigger branch_teacher_assignments_set_updated_at
before update on public.branch_teacher_assignments
for each row execute function public.set_updated_at();

create or replace function private.is_branch_teacher_for_branch(target_branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1
    from public.profiles p
    join public.branch_teacher_assignments bta
      on bta.user_id = p.id
    where p.id = (select auth.uid())
      and p.role::text = 'branch_teacher'
      and bta.branch_id = target_branch_id
      and bta.is_active = true
  );
$$;

revoke all on function private.is_branch_teacher_for_branch(uuid) from public;
grant execute on function private.is_branch_teacher_for_branch(uuid) to authenticated;

create or replace function private.can_manage_learning_branch(target_branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select private.is_admin()
    or private.is_branch_admin_for_branch(target_branch_id)
    or private.is_branch_teacher_for_branch(target_branch_id);
$$;

revoke all on function private.can_manage_learning_branch(uuid) from public;
grant execute on function private.can_manage_learning_branch(uuid) to authenticated;

create or replace function private.can_manage_branch_staff(target_branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select private.is_admin()
    or private.is_branch_admin_for_branch(target_branch_id);
$$;

revoke all on function private.can_manage_branch_staff(uuid) from public;
grant execute on function private.can_manage_branch_staff(uuid) to authenticated;

create or replace function public.record_learning_session(
  p_course_enrollment_id uuid,
  p_session_number integer default null,
  p_session_date date default current_date,
  p_lesson_title text default null,
  p_teacher_comment text default null,
  p_photo_path text default null
)
returns public.learning_sessions
language plpgsql
security definer
set search_path = public, private
as $$
declare
  enrollment public.course_enrollments%rowtype;
  resolved_session_number integer;
  new_session public.learning_sessions%rowtype;
  completed_count integer;
begin
  select * into enrollment
  from public.course_enrollments
  where id = p_course_enrollment_id
  for update;

  if not found then
    raise exception 'ไม่พบคอร์สของนักเรียนคนนี้';
  end if;

  if not private.can_manage_learning_branch(enrollment.branch_id) then
    raise exception 'ไม่มีสิทธิ์บันทึกประวัติการเรียนของสาขานี้';
  end if;

  if p_session_number is null then
    select coalesce(max(session_number), 0) + 1
    into resolved_session_number
    from public.learning_sessions
    where course_enrollment_id = p_course_enrollment_id;
  else
    resolved_session_number := p_session_number;
  end if;

  if resolved_session_number < 1 then
    raise exception 'ครั้งที่เรียนต้องมากกว่า 0';
  end if;

  if resolved_session_number > enrollment.total_sessions then
    raise exception 'ครั้งที่เรียนต้องไม่เกินจำนวนครั้งของแพ็กเกจ';
  end if;

  if exists (
    select 1
    from public.learning_sessions
    where course_enrollment_id = p_course_enrollment_id
      and session_number = resolved_session_number
  ) then
    raise exception 'มีการบันทึกครั้งเรียนนี้แล้ว';
  end if;

  insert into public.learning_sessions (
    course_enrollment_id,
    application_id,
    parent_user_id,
    line_user_id,
    branch_id,
    session_number,
    session_date,
    lesson_title,
    teacher_comment,
    photo_path,
    recorded_by
  )
  values (
    enrollment.id,
    enrollment.application_id,
    enrollment.parent_user_id,
    enrollment.line_user_id,
    enrollment.branch_id,
    resolved_session_number,
    coalesce(p_session_date, current_date),
    nullif(trim(coalesce(p_lesson_title, '')), ''),
    nullif(trim(coalesce(p_teacher_comment, '')), ''),
    nullif(trim(coalesce(p_photo_path, '')), ''),
    auth.uid()
  )
  returning * into new_session;

  select count(*) into completed_count
  from public.learning_sessions
  where course_enrollment_id = enrollment.id;

  update public.course_enrollments
  set completed_sessions = completed_count,
      certificate_half_awarded = case
        when course_type = 'robot' and completed_count >= 15 then true
        else certificate_half_awarded
      end,
      certificate_full_awarded = case
        when completed_count >= total_sessions then true
        else certificate_full_awarded
      end,
      status = case when completed_count >= total_sessions then 'completed' else status end,
      updated_at = now()
  where id = enrollment.id;

  return new_session;
end;
$$;

grant execute on function public.record_learning_session(uuid, integer, date, text, text, text)
  to authenticated;

create or replace function public.create_branch_teacher_invitation(
  p_branch_id uuid,
  p_teacher_name text,
  p_teacher_email text default null,
  p_teacher_phone text default null
)
returns public.branch_teacher_invitations
language plpgsql
security definer
set search_path = public, private
as $$
declare
  saved_invitation public.branch_teacher_invitations;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not private.can_manage_branch_staff(p_branch_id) then
    raise exception 'ไม่มีสิทธิ์เชิญครูในสาขานี้';
  end if;

  if not exists (
    select 1 from public.branches
    where id = p_branch_id and is_active = true
  ) then
    raise exception 'ไม่พบสาขาที่เปิดใช้งาน';
  end if;

  insert into public.branch_teacher_invitations (
    branch_id,
    invited_by,
    teacher_name,
    teacher_email,
    teacher_phone
  )
  values (
    p_branch_id,
    auth.uid(),
    trim(p_teacher_name),
    nullif(trim(coalesce(p_teacher_email, '')), ''),
    nullif(trim(coalesce(p_teacher_phone, '')), '')
  )
  returning * into saved_invitation;

  return saved_invitation;
end;
$$;

create or replace function public.submit_branch_teacher_application(
  p_invite_code text,
  p_full_name text,
  p_phone text default null
)
returns public.branch_teacher_invitations
language plpgsql
security definer
set search_path = public, private
as $$
declare
  applicant_id uuid := auth.uid();
  target_invitation public.branch_teacher_invitations;
  saved_invitation public.branch_teacher_invitations;
begin
  if applicant_id is null then
    raise exception 'Authentication required';
  end if;

  select *
  into target_invitation
  from public.branch_teacher_invitations
  where invite_code = lower(trim(p_invite_code))
  for update;

  if target_invitation.id is null then
    raise exception 'Invite code not found';
  end if;

  if target_invitation.status in ('cancelled', 'expired', 'active', 'suspended') then
    raise exception 'Invite code is no longer available';
  end if;

  if target_invitation.expires_at < now() then
    update public.branch_teacher_invitations
    set status = 'expired',
        updated_at = now()
    where id = target_invitation.id;
    raise exception 'Invite code has expired';
  end if;

  execute 'insert into public.profiles (id, role)
           values ($1, $2::public.user_role)
           on conflict (id) do update set
             role = case
               when public.profiles.role::text in (''admin'', ''branch_admin'') then public.profiles.role
               else excluded.role
             end,
             updated_at = now()'
    using applicant_id, 'branch_teacher';

  update public.branch_teacher_invitations
  set teacher_name = trim(p_full_name),
      teacher_phone = nullif(trim(coalesce(p_phone, '')), ''),
      accepted_by = applicant_id,
      accepted_at = now(),
      status = 'pending',
      rejection_reason = null,
      reviewed_by = null,
      reviewed_at = null,
      updated_at = now()
  where id = target_invitation.id
  returning * into saved_invitation;

  return saved_invitation;
end;
$$;

create or replace function public.review_branch_teacher_application(
  p_invitation_id uuid,
  p_decision text,
  p_rejection_reason text default null
)
returns public.branch_teacher_invitations
language plpgsql
security definer
set search_path = public, private
as $$
declare
  reviewer_id uuid := auth.uid();
  target_invitation public.branch_teacher_invitations;
  saved_invitation public.branch_teacher_invitations;
begin
  if reviewer_id is null then
    raise exception 'Authentication required';
  end if;

  if p_decision not in ('approved', 'rejected', 'cancelled', 'suspended') then
    raise exception 'Invalid review decision';
  end if;

  select *
  into target_invitation
  from public.branch_teacher_invitations
  where id = p_invitation_id
  for update;

  if target_invitation.id is null then
    raise exception 'Teacher invitation not found';
  end if;

  if not private.can_manage_branch_staff(target_invitation.branch_id) then
    raise exception 'ไม่มีสิทธิ์จัดการครูในสาขานี้';
  end if;

  update public.branch_teacher_invitations
  set status = case
        when p_decision = 'approved' then 'active'
        else p_decision
      end,
      reviewed_by = reviewer_id,
      reviewed_at = now(),
      rejection_reason = case
        when p_decision = 'rejected' then nullif(trim(coalesce(p_rejection_reason, '')), '')
        else null
      end,
      updated_at = now()
  where id = p_invitation_id
  returning * into saved_invitation;

  if p_decision = 'approved' then
    if target_invitation.accepted_by is null then
      raise exception 'ครูยังไม่ได้ตอบรับคำเชิญ';
    end if;

    execute 'insert into public.profiles (id, role)
             values ($1, $2::public.user_role)
             on conflict (id) do update set
               role = case
                 when public.profiles.role::text in (''admin'', ''branch_admin'') then public.profiles.role
                 else excluded.role
               end,
               updated_at = now()'
      using target_invitation.accepted_by, 'branch_teacher';

    insert into public.branch_teacher_assignments (
      user_id,
      branch_id,
      invitation_id,
      display_name,
      phone,
      is_active,
      approved_by,
      approved_at
    )
    values (
      target_invitation.accepted_by,
      target_invitation.branch_id,
      target_invitation.id,
      target_invitation.teacher_name,
      target_invitation.teacher_phone,
      true,
      reviewer_id,
      now()
    )
    on conflict (user_id, branch_id) do update set
      invitation_id = excluded.invitation_id,
      display_name = excluded.display_name,
      phone = excluded.phone,
      is_active = true,
      approved_by = excluded.approved_by,
      approved_at = excluded.approved_at,
      updated_at = now();
  else
    update public.branch_teacher_assignments
    set is_active = false,
        updated_at = now()
    where invitation_id = target_invitation.id;
  end if;

  return saved_invitation;
end;
$$;

revoke all on function public.create_branch_teacher_invitation(uuid, text, text, text) from public;
grant execute on function public.create_branch_teacher_invitation(uuid, text, text, text) to authenticated;

revoke all on function public.submit_branch_teacher_application(text, text, text) from public;
grant execute on function public.submit_branch_teacher_application(text, text, text) to authenticated;

revoke all on function public.review_branch_teacher_application(uuid, text, text) from public;
grant execute on function public.review_branch_teacher_application(uuid, text, text) to authenticated;

alter table public.branch_teacher_invitations enable row level security;
alter table public.branch_teacher_assignments enable row level security;

drop policy if exists "Branch staff can read teacher invitations"
  on public.branch_teacher_invitations;
create policy "Branch staff can read teacher invitations"
on public.branch_teacher_invitations
for select
to authenticated
using (
  private.can_manage_branch_staff(branch_id)
  or invited_by = (select auth.uid())
  or accepted_by = (select auth.uid())
);

drop policy if exists "Branch staff manage teacher invitations"
  on public.branch_teacher_invitations;
create policy "Branch staff manage teacher invitations"
on public.branch_teacher_invitations
for all
to authenticated
using (private.can_manage_branch_staff(branch_id))
with check (private.can_manage_branch_staff(branch_id));

drop policy if exists "Teachers read own assignment"
  on public.branch_teacher_assignments;
create policy "Teachers read own assignment"
on public.branch_teacher_assignments
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Branch staff read teacher assignments"
  on public.branch_teacher_assignments;
create policy "Branch staff read teacher assignments"
on public.branch_teacher_assignments
for select
to authenticated
using (private.can_manage_branch_staff(branch_id));

drop policy if exists "Branch staff manage teacher assignments"
  on public.branch_teacher_assignments;
create policy "Branch staff manage teacher assignments"
on public.branch_teacher_assignments
for all
to authenticated
using (private.can_manage_branch_staff(branch_id))
with check (private.can_manage_branch_staff(branch_id));

drop policy if exists "Branch teachers can read assigned branch"
  on public.branches;
create policy "Branch teachers can read assigned branch"
on public.branches
for select
to authenticated
using (private.is_branch_teacher_for_branch(id));

grant select on public.branch_teacher_invitations to authenticated;
grant select on public.branch_teacher_assignments to authenticated;
