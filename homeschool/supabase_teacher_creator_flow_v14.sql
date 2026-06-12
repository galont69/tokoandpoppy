-- Teacher identity verification, worksheet products, and tutoring listings.
-- Run once after the role/profile and Admin migrations.

begin;

create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  provider_type text not null default 'individual'
    check (provider_type in ('individual', 'institute')),
  phone text not null,
  line_id text,
  address_line text not null,
  subdistrict text,
  district_name text,
  province text not null,
  postal_code text,
  subjects text[] not null default '{}',
  education_summary text not null,
  experience_summary text,
  bank_name text not null,
  bank_account_name text not null,
  bank_account_last4 text not null check (bank_account_last4 ~ '^[0-9]{4}$'),
  tax_id text,
  identity_document_path text not null,
  bank_document_path text not null,
  portrait_path text not null,
  admin_note text,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_worksheets (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  subject text not null,
  age_range text not null,
  price numeric(10,2) not null default 0 check (price >= 0),
  worksheet_path text not null,
  free_sample_path text not null,
  cover_path text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_service_listings (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subjects text[] not null default '{}',
  learner_age_range text not null,
  service_area text not null,
  teaching_mode text not null
    check (teaching_mode in ('home', 'institute', 'online', 'hybrid')),
  price_description text not null,
  availability text not null,
  contact_phone text,
  contact_line text,
  description text not null,
  status text not null default 'published'
    check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teacher_worksheets_owner_idx
on public.teacher_worksheets(teacher_user_id, created_at desc);

create index if not exists teacher_service_listings_owner_idx
on public.teacher_service_listings(teacher_user_id, created_at desc);

alter table public.teacher_profiles enable row level security;
alter table public.teacher_worksheets enable row level security;
alter table public.teacher_service_listings enable row level security;

revoke update, delete on public.teacher_profiles from authenticated;
grant select, insert on public.teacher_profiles to authenticated;
grant select, insert, update, delete on public.teacher_worksheets to authenticated;
grant select, insert, update, delete on public.teacher_service_listings to authenticated;

drop policy if exists "teachers_manage_own_profile" on public.teacher_profiles;
drop policy if exists "teachers_read_own_profile" on public.teacher_profiles;
create policy "teachers_read_own_profile"
on public.teacher_profiles for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "teachers_create_own_profile" on public.teacher_profiles;
create policy "teachers_create_own_profile"
on public.teacher_profiles for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
      and approval_status = 'pending'
  )
);

drop policy if exists "admins_read_teacher_profiles" on public.teacher_profiles;
create policy "admins_read_teacher_profiles"
on public.teacher_profiles for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "active_teachers_manage_worksheets" on public.teacher_worksheets;
create policy "active_teachers_manage_worksheets"
on public.teacher_worksheets for all
to authenticated
using (
  teacher_user_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
      and approval_status = 'active'
  )
)
with check (
  teacher_user_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
      and approval_status = 'active'
  )
);

drop policy if exists "marketplace_read_published_worksheets" on public.teacher_worksheets;
create policy "marketplace_read_published_worksheets"
on public.teacher_worksheets for select
to authenticated
using (status = 'published');

drop policy if exists "active_teachers_manage_service_listings" on public.teacher_service_listings;
create policy "active_teachers_manage_service_listings"
on public.teacher_service_listings for all
to authenticated
using (
  teacher_user_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
      and approval_status = 'active'
  )
)
with check (
  teacher_user_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
      and approval_status = 'active'
  )
);

drop policy if exists "marketplace_read_published_teacher_services" on public.teacher_service_listings;
create policy "marketplace_read_published_teacher_services"
on public.teacher_service_listings for select
to authenticated
using (status = 'published');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'teacher-verification',
  'teacher-verification',
  false,
  10485760,
  array['application/pdf','image/jpeg','image/png','image/webp']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'teacher-marketplace',
  'teacher-marketplace',
  false,
  52428800,
  array[
    'application/pdf',
    'application/zip',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Verification path: {auth.uid()}/{identity|bank|portrait}.{ext}
drop policy if exists "teachers_upload_verification" on storage.objects;
create policy "teachers_upload_verification"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'teacher-verification'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "teachers_read_own_verification" on storage.objects;
create policy "teachers_read_own_verification"
on storage.objects for select to authenticated
using (
  bucket_id = 'teacher-verification'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select public.is_admin())
  )
);

drop policy if exists "teachers_replace_own_verification" on storage.objects;
create policy "teachers_replace_own_verification"
on storage.objects for update to authenticated
using (
  bucket_id = 'teacher-verification'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'teacher-verification'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "teachers_delete_own_verification" on storage.objects;
create policy "teachers_delete_own_verification"
on storage.objects for delete to authenticated
using (
  bucket_id = 'teacher-verification'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Marketplace path: {auth.uid()}/{worksheet-id}/{file}
drop policy if exists "active_teachers_upload_marketplace" on storage.objects;
create policy "active_teachers_upload_marketplace"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'teacher-marketplace'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'teacher'
      and approval_status = 'active'
  )
);

drop policy if exists "marketplace_files_read" on storage.objects;
create policy "marketplace_files_read"
on storage.objects for select to authenticated
using (bucket_id = 'teacher-marketplace');

drop policy if exists "teachers_delete_own_marketplace_files" on storage.objects;
create policy "teachers_delete_own_marketplace_files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'teacher-marketplace'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create or replace function public.approve_teacher(target_user_id uuid, review_note text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'Admin permission required'; end if;
  if not exists (
    select 1 from public.teacher_profiles tp
    join public.profiles p on p.id = tp.user_id
    where tp.user_id = target_user_id
      and p.role = 'teacher'
      and p.approval_status = 'pending'
  ) then raise exception 'Pending teacher request not found'; end if;

  update public.teacher_profiles
  set admin_note = review_note,
      verified_by = (select auth.uid()),
      verified_at = now(),
      updated_at = now()
  where user_id = target_user_id;

  update public.profiles
  set approval_status = 'active', updated_at = now()
  where id = target_user_id and role = 'teacher';
end;
$$;

create or replace function public.reject_teacher(target_user_id uuid, review_note text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'Admin permission required'; end if;
  update public.teacher_profiles
  set admin_note = review_note,
      verified_by = (select auth.uid()),
      verified_at = now(),
      updated_at = now()
  where user_id = target_user_id;

  update public.profiles
  set approval_status = 'suspended', updated_at = now()
  where id = target_user_id and role = 'teacher';
end;
$$;

revoke all on function public.approve_teacher(uuid, text) from public;
revoke all on function public.reject_teacher(uuid, text) from public;
grant execute on function public.approve_teacher(uuid, text) to authenticated;
grant execute on function public.reject_teacher(uuid, text) to authenticated;

commit;
