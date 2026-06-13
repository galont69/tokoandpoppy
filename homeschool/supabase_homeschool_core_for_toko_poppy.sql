-- Homeschool core schema for merging the Homeschool module into Toko & Poppy.
-- Run this AFTER outputs/supabase-enrollment-schema.sql and BEFORE the
-- existing homeschool v11-v18/v12/v13/v14-v17 add-on migrations.
--
-- This migration is additive and idempotent: it creates missing homeschool
-- tables, adds missing profile fields/roles, and keeps existing enrollment data.
--
-- Important: do not wrap this whole file in BEGIN/COMMIT. PostgreSQL enum
-- values added by ALTER TYPE should be committed before later statements use
-- them, so the Supabase SQL Editor's normal autocommit behavior is preferred.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

do $$
begin
  if not exists (select 1 from pg_type where typnamespace = 'public'::regnamespace and typname = 'user_role') then
    create type public.user_role as enum ('parent', 'admin', 'teacher', 'district');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_enum
    where enumtypid = 'public.user_role'::regtype
      and enumlabel = 'teacher'
  ) then
    alter type public.user_role add value 'teacher';
  end if;

  if not exists (
    select 1 from pg_enum
    where enumtypid = 'public.user_role'::regtype
      and enumlabel = 'district'
  ) then
    alter type public.user_role add value 'district';
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'parent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists approval_status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_approval_status_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_approval_status_check
      check (approval_status in ('active', 'pending', 'rejected', 'suspended'));
  end if;
end $$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function private.is_admin() from public;
revoke all on function public.is_admin() from public;
grant execute on function private.is_admin() to authenticated;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'requested_role', 'parent');
  safe_role public.user_role := 'parent';
  safe_approval text := 'active';
begin
  if requested_role in ('teacher', 'district') then
    safe_role := requested_role::public.user_role;
    safe_approval := 'pending';
  end if;

  insert into public.profiles (id, role, full_name, phone, approval_status)
  values (
    new.id,
    safe_role,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'phone', '')), ''),
    safe_approval
  )
  on conflict (id) do update set
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    phone = coalesce(public.profiles.phone, excluded.phone),
    approval_status = coalesce(public.profiles.approval_status, excluded.approval_status);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.profiles (id, role, approval_status)
select id, 'parent', 'active'
from auth.users
on conflict (id) do nothing;

create table if not exists public.education_districts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  province text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  family_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references public.families(id) on delete set null,
  first_name text not null,
  last_name text,
  birth_date date,
  citizen_id text,
  current_education_level text,
  district_id uuid references public.education_districts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.homeschool_applications (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references public.families(id) on delete set null,
  student_id uuid references public.students(id) on delete set null,
  district_id uuid references public.education_districts(id) on delete set null,
  application_type text not null default 'permission_request',
  status text not null default 'draft',
  request_form_data jsonb not null default '{}'::jsonb,
  early_childhood_plan_data jsonb not null default '{}'::jsonb,
  primary_education_plan_data jsonb not null default '{}'::jsonb,
  annual_evidence_data jsonb not null default '{}'::jsonb,
  reviewer_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.official_documents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.homeschool_applications(id) on delete cascade,
  document_type text not null,
  storage_bucket text not null default 'official-documents',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  file_size_bytes bigint,
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.district_officer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  requested_district_id uuid references public.education_districts(id) on delete set null,
  requested_district_name text,
  verified_district_id uuid references public.education_districts(id) on delete set null,
  phone text,
  line_id text,
  position text,
  admin_note text,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists education_districts_active_idx
on public.education_districts(active, code);

create index if not exists families_owner_idx
on public.families(owner_user_id, created_at desc);

create index if not exists students_owner_idx
on public.students(owner_user_id, created_at desc);

create index if not exists students_district_idx
on public.students(district_id, created_at desc);

create index if not exists homeschool_applications_owner_idx
on public.homeschool_applications(owner_user_id, created_at desc);

create index if not exists homeschool_applications_district_idx
on public.homeschool_applications(district_id, created_at desc);

create index if not exists official_documents_application_idx
on public.official_documents(application_id, created_at desc);

drop trigger if exists education_districts_set_updated_at on public.education_districts;
create trigger education_districts_set_updated_at
before update on public.education_districts
for each row execute function public.set_updated_at();

drop trigger if exists families_set_updated_at on public.families;
create trigger families_set_updated_at
before update on public.families
for each row execute function public.set_updated_at();

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists homeschool_applications_set_updated_at on public.homeschool_applications;
create trigger homeschool_applications_set_updated_at
before update on public.homeschool_applications
for each row execute function public.set_updated_at();

drop trigger if exists district_officer_profiles_set_updated_at on public.district_officer_profiles;
create trigger district_officer_profiles_set_updated_at
before update on public.district_officer_profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.education_districts enable row level security;
alter table public.families enable row level security;
alter table public.students enable row level security;
alter table public.homeschool_applications enable row level security;
alter table public.official_documents enable row level security;
alter table public.district_officer_profiles enable row level security;

drop policy if exists "Users can read own profile and admins read all" on public.profiles;
create policy "Users can read own profile and admins read all"
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "Users can update their homeschool profile" on public.profiles;
create policy "Users can update their homeschool profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (
  id = (select auth.uid())
  and role in ('parent', 'teacher', 'district')
  and (
    (role = 'parent' and approval_status in ('active', 'pending'))
    or (role in ('teacher', 'district') and approval_status in ('pending', 'active'))
  )
);

drop policy if exists "Anyone can read active education districts" on public.education_districts;
create policy "Anyone can read active education districts"
on public.education_districts for select
to anon, authenticated
using (active = true);

drop policy if exists "Admins can manage education districts" on public.education_districts;
create policy "Admins can manage education districts"
on public.education_districts for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Families owner access" on public.families;
create policy "Families owner access"
on public.families for all
to authenticated
using (owner_user_id = (select auth.uid()) or (select private.is_admin()))
with check (owner_user_id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "Students owner district admin access" on public.students;
drop policy if exists "Students owner admin write access" on public.students;
create policy "Students owner district admin read access"
on public.students for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
  or exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = students.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

create policy "Students owner admin write access"
on public.students for all
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
)
with check (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "Homeschool applications owner district admin access" on public.homeschool_applications;
drop policy if exists "Homeschool applications owner district admin read access" on public.homeschool_applications;
drop policy if exists "Homeschool applications owner admin insert access" on public.homeschool_applications;
drop policy if exists "Homeschool applications owner district admin update access" on public.homeschool_applications;
drop policy if exists "Homeschool applications owner admin delete access" on public.homeschool_applications;
create policy "Homeschool applications owner district admin read access"
on public.homeschool_applications for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
  or exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = homeschool_applications.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

create policy "Homeschool applications owner admin insert access"
on public.homeschool_applications for insert
to authenticated
with check (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
);

create policy "Homeschool applications owner district admin update access"
on public.homeschool_applications for update
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
  or exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = homeschool_applications.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
)
with check (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
  or exists (
    select 1
    from public.district_officer_profiles dop
    join public.profiles p on p.id = dop.user_id
    where dop.user_id = (select auth.uid())
      and dop.verified_district_id = homeschool_applications.district_id
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

create policy "Homeschool applications owner admin delete access"
on public.homeschool_applications for delete
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "Official documents owner district admin access" on public.official_documents;
drop policy if exists "Official documents owner district admin read access" on public.official_documents;
drop policy if exists "Official documents owner admin insert access" on public.official_documents;
drop policy if exists "Official documents owner admin delete access" on public.official_documents;
create policy "Official documents owner district admin read access"
on public.official_documents for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
  or exists (
    select 1
    from public.homeschool_applications ha
    join public.district_officer_profiles dop on dop.verified_district_id = ha.district_id
    join public.profiles p on p.id = dop.user_id
    where ha.id = official_documents.application_id
      and dop.user_id = (select auth.uid())
      and p.role = 'district'
      and p.approval_status = 'active'
  )
);

create policy "Official documents owner admin insert access"
on public.official_documents for insert
to authenticated
with check (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
);

create policy "Official documents owner admin delete access"
on public.official_documents for delete
to authenticated
using (
  owner_user_id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "District officers own and admin access" on public.district_officer_profiles;
create policy "District officers own and admin access"
on public.district_officer_profiles for all
to authenticated
using (user_id = (select auth.uid()) or (select private.is_admin()))
with check (user_id = (select auth.uid()) or (select private.is_admin()));

grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select on public.education_districts to anon, authenticated;
grant insert, update, delete on public.education_districts to authenticated;
grant select, insert, update, delete on public.families to authenticated;
grant select, insert, update, delete on public.students to authenticated;
grant select, insert, update, delete on public.homeschool_applications to authenticated;
grant select, insert, delete on public.official_documents to authenticated;
grant select, insert, update, delete on public.district_officer_profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'official-documents',
  'official-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/octet-stream'
  ]::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Official document paths used by parent.html are normally:
-- {owner_user_id}/{application_id}/{uuid}.{extension}
drop policy if exists "official_documents_storage_insert_owner" on storage.objects;
create policy "official_documents_storage_insert_owner"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'official-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "official_documents_storage_select_owner_district_admin" on storage.objects;
create policy "official_documents_storage_select_owner_district_admin"
on storage.objects for select
to authenticated
using (
  bucket_id = 'official-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select private.is_admin())
    or exists (
      select 1
      from public.official_documents od
      join public.homeschool_applications ha on ha.id = od.application_id
      join public.district_officer_profiles dop on dop.verified_district_id = ha.district_id
      join public.profiles p on p.id = dop.user_id
      where od.storage_bucket = 'official-documents'
        and od.storage_path = storage.objects.name
        and dop.user_id = (select auth.uid())
        and p.role = 'district'
        and p.approval_status = 'active'
    )
  )
);

drop policy if exists "official_documents_storage_delete_owner_admin" on storage.objects;
create policy "official_documents_storage_delete_owner_admin"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'official-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select private.is_admin())
  )
);

create or replace function public.approve_district_officer(
  target_user_id uuid,
  target_district_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Admin permission required';
  end if;

  update public.district_officer_profiles
  set verified_district_id = target_district_id,
      verified_by = (select auth.uid()),
      verified_at = now(),
      updated_at = now()
  where user_id = target_user_id;

  update public.profiles
  set role = 'district',
      approval_status = 'active',
      updated_at = now()
  where id = target_user_id;
end;
$$;

create or replace function public.reject_district_officer(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Admin permission required';
  end if;

  update public.profiles
  set approval_status = 'rejected',
      updated_at = now()
  where id = target_user_id
    and role = 'district';

  update public.district_officer_profiles
  set verified_district_id = null,
      admin_note = coalesce(admin_note, 'Rejected by admin'),
      updated_at = now()
  where user_id = target_user_id;
end;
$$;

grant execute on function public.approve_district_officer(uuid, uuid) to authenticated;
grant execute on function public.reject_district_officer(uuid) to authenticated;
