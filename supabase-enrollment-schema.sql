-- Toko & Poppy: parent registration and enrollment schema
-- Run this file once in Supabase Dashboard > SQL Editor.
--
-- Passwords are NOT stored in these tables. Supabase Auth stores and hashes them.
-- Expected frontend flow:
--   1. supabase.auth.signUp({ email, password })
--   2. Upload the payment slip to:
--        payment-slips/<auth-user-id>/<random-file-name>
--   3. Call public.submit_enrollment(...)

create extension if not exists pgcrypto;

do $$
begin
  create type public.user_role as enum ('parent', 'admin');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.course_code as enum ('robot', 'art', 'both');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.application_status as enum (
    'pending',
    'approved',
    'rejected'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_status as enum (
    'pending',
    'verified',
    'rejected'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'parent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollment_applications (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  student_name text not null
    check (char_length(trim(student_name)) between 2 and 150),
  parent_phone text not null
    check (char_length(trim(parent_phone)) between 8 and 30),
  parent_email text not null,
  course public.course_code not null,
  slip_path text not null
    check (
      slip_path <> ''
      and split_part(slip_path, '/', 1) = parent_user_id::text
    ),
  status public.application_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.enrollment_applications
  add column if not exists robot_access boolean not null default false,
  add column if not exists art_access boolean not null default false;

create index if not exists enrollment_parent_user_id_idx
  on public.enrollment_applications(parent_user_id);

create index if not exists enrollment_status_created_at_idx
  on public.enrollment_applications(status, created_at desc);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

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

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

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

drop trigger if exists enrollment_set_updated_at
  on public.enrollment_applications;
create trigger enrollment_set_updated_at
before update on public.enrollment_applications
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'parent')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Backfill profiles for Auth users that existed before this SQL was installed.
insert into public.profiles (id, role)
select id, 'parent'
from auth.users
on conflict (id) do nothing;

create or replace function public.submit_enrollment(
  p_student_name text,
  p_parent_phone text,
  p_course public.course_code,
  p_slip_path text
)
returns public.enrollment_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_parent_email text;
  v_application public.enrollment_applications;
begin
  if v_user_id is null then
    raise exception 'Authentication is required';
  end if;

  if char_length(trim(p_student_name)) not between 2 and 150 then
    raise exception 'Invalid student name';
  end if;

  if char_length(trim(p_parent_phone)) not between 8 and 30 then
    raise exception 'Invalid phone number';
  end if;

  if p_slip_path is null
     or p_slip_path = ''
     or split_part(p_slip_path, '/', 1) <> v_user_id::text then
    raise exception 'Invalid payment slip path';
  end if;

  select email
  into v_parent_email
  from auth.users
  where id = v_user_id;

  insert into public.enrollment_applications (
    parent_user_id,
    student_name,
    parent_phone,
    parent_email,
    course,
    slip_path,
    status,
    payment_status
  )
  values (
    v_user_id,
    trim(p_student_name),
    trim(p_parent_phone),
    v_parent_email,
    p_course,
    p_slip_path,
    'pending',
    'pending'
  )
  returning * into v_application;

  return v_application;
end;
$$;

revoke all on function public.submit_enrollment(
  text,
  text,
  public.course_code,
  text
) from public;

grant execute on function public.submit_enrollment(
  text,
  text,
  public.course_code,
  text
) to authenticated;

create or replace function public.review_enrollment(
  p_application_id uuid,
  p_decision public.application_status,
  p_robot_access boolean default false,
  p_art_access boolean default false,
  p_rejection_reason text default null
)
returns public.enrollment_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_application public.enrollment_applications;
begin
  if not (select private.is_admin()) then
    raise exception 'Admin access is required';
  end if;

  if p_decision not in ('approved', 'rejected') then
    raise exception 'Decision must be approved or rejected';
  end if;

  if p_decision = 'approved'
     and not (coalesce(p_robot_access, false) or coalesce(p_art_access, false)) then
    raise exception 'Select at least one course';
  end if;

  update public.enrollment_applications
  set
    status = p_decision,
    payment_status = case
      when p_decision = 'approved' then 'verified'::public.payment_status
      else 'rejected'::public.payment_status
    end,
    robot_access = case
      when p_decision = 'approved' then coalesce(p_robot_access, false)
      else false
    end,
    art_access = case
      when p_decision = 'approved' then coalesce(p_art_access, false)
      else false
    end,
    reviewed_by = (select auth.uid()),
    reviewed_at = now(),
    rejection_reason = case
      when p_decision = 'rejected' then nullif(trim(p_rejection_reason), '')
      else null
    end
  where id = p_application_id
  returning * into v_application;

  if v_application.id is null then
    raise exception 'Application not found';
  end if;

  return v_application;
end;
$$;

revoke all on function public.review_enrollment(
  uuid,
  public.application_status,
  boolean,
  boolean,
  text
) from public;

grant execute on function public.review_enrollment(
  uuid,
  public.application_status,
  boolean,
  boolean,
  text
) to authenticated;

alter table public.profiles enable row level security;
alter table public.enrollment_applications enable row level security;

drop policy if exists "Parents can read their profile"
  on public.profiles;
create policy "Parents can read their profile"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "Parents can read their applications"
  on public.enrollment_applications;
create policy "Parents can read their applications"
on public.enrollment_applications
for select
to authenticated
using (
  parent_user_id = (select auth.uid())
  or (select private.is_admin())
);

drop policy if exists "Admins can update applications"
  on public.enrollment_applications;
create policy "Admins can update applications"
on public.enrollment_applications
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Direct inserts are disabled. The browser must use submit_enrollment(),
-- which always creates a pending application owned by the signed-in user.
revoke all on public.profiles from anon;
revoke all on public.enrollment_applications from anon;
revoke insert, update, delete on public.profiles from authenticated;
revoke insert, delete on public.enrollment_applications from authenticated;
grant select on public.profiles to authenticated;
grant select, update on public.enrollment_applications to authenticated;

-- Private bucket for payment slips.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'payment-slips',
  'payment-slips',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Parents can upload their payment slips"
  on storage.objects;
create policy "Parents can upload their payment slips"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-slips'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Parents can read their payment slips"
  on storage.objects;
create policy "Parents can read their payment slips"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-slips'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select private.is_admin())
  )
);

drop policy if exists "Parents can remove their unsubmitted slips"
  on storage.objects;
-- No client DELETE policy is created. Payment evidence stays immutable.

-- Robot course: 31 lessons, teacher videos and LEGO instruction PDFs.
create table if not exists public.robot_lessons (
  id uuid primary key default gen_random_uuid(),
  lesson_number smallint not null unique
    check (lesson_number between 1 and 31),
  title text not null,
  description text not null default '',
  video_path text,
  video_url text,
  instruction_pdf_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    video_url is null
    or video_url ~* '^https?://'
  )
);

do $$
begin
  alter table public.robot_lessons
    add constraint published_robot_lesson_has_media
    check (
      not is_published
      or (
        (video_path is not null or video_url is not null)
        and instruction_pdf_path is not null
      )
    );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.robot_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.robot_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

drop trigger if exists robot_lessons_set_updated_at
  on public.robot_lessons;
create trigger robot_lessons_set_updated_at
before update on public.robot_lessons
for each row execute function public.set_updated_at();

insert into public.robot_lessons (lesson_number, title)
select
  lesson_number,
  case
    when lesson_number = 1 then 'Two Wheel'
    else 'บทเรียนโรบอท ' || lesson_number
  end
from generate_series(1, 31) as series(lesson_number)
on conflict (lesson_number) do nothing;

create or replace function private.has_robot_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollment_applications
    where parent_user_id = (select auth.uid())
      and status = 'approved'
      and robot_access = true
  );
$$;

revoke all on function private.has_robot_access() from public;
grant execute on function private.has_robot_access() to authenticated;

alter table public.robot_lessons enable row level security;
alter table public.robot_lesson_progress enable row level security;

drop policy if exists "Robot students can read published lessons"
  on public.robot_lessons;
create policy "Robot students can read published lessons"
on public.robot_lessons
for select
to authenticated
using (
  (is_published and (select private.has_robot_access()))
  or (select private.is_admin())
);

drop policy if exists "Admins can insert robot lessons"
  on public.robot_lessons;
create policy "Admins can insert robot lessons"
on public.robot_lessons
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "Admins can update robot lessons"
  on public.robot_lessons;
create policy "Admins can update robot lessons"
on public.robot_lessons
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can delete robot lessons"
  on public.robot_lessons;
create policy "Admins can delete robot lessons"
on public.robot_lessons
for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "Students can read their robot progress"
  on public.robot_lesson_progress;
create policy "Students can read their robot progress"
on public.robot_lesson_progress
for select
to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_robot_access())
);

drop policy if exists "Students can complete robot lessons"
  on public.robot_lesson_progress;
create policy "Students can complete robot lessons"
on public.robot_lesson_progress
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and (select private.has_robot_access())
);

drop policy if exists "Students can reset their robot progress"
  on public.robot_lesson_progress;
create policy "Students can reset their robot progress"
on public.robot_lesson_progress
for delete
to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_robot_access())
);

revoke all on public.robot_lessons from anon;
revoke all on public.robot_lesson_progress from anon;
grant select, insert, update, delete on public.robot_lessons to authenticated;
grant select, insert, delete on public.robot_lesson_progress to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'robot-videos',
  'robot-videos',
  false,
  524288000,
  array['video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'robot-instructions',
  'robot-instructions',
  false,
  52428800,
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins manage robot course files"
  on storage.objects;
create policy "Admins manage robot course files"
on storage.objects
for all
to authenticated
using (
  bucket_id in ('robot-videos', 'robot-instructions')
  and (select private.is_admin())
)
with check (
  bucket_id in ('robot-videos', 'robot-instructions')
  and (select private.is_admin())
);

drop policy if exists "Robot students read course files"
  on storage.objects;
create policy "Robot students read course files"
on storage.objects
for select
to authenticated
using (
  bucket_id in ('robot-videos', 'robot-instructions')
  and (
    (select private.has_robot_access())
    or (select private.is_admin())
  )
);

-- Promote an existing user to admin after replacing the email below:
--
-- update public.profiles
-- set role = 'admin'
-- where id = (
--   select id
--   from auth.users
--   where email = 'admin@example.com'
-- );
