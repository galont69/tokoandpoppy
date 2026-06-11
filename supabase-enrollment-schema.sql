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

do $$
begin
  create type public.enrollment_source as enum ('online', 'branch');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_method as enum (
    'unpaid',
    'cash',
    'transfer',
    'admin_chat'
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

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
    check (char_length(trim(name)) between 2 and 150),
  code text unique,
  province text,
  contact_name text,
  contact_phone text,
  franchise_fee_rate numeric(5,2) not null default 0
    check (franchise_fee_rate >= 0),
  is_active boolean not null default true,
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
  slip_path text
    check (
      slip_path is null
      or slip_path = ''
      or split_part(slip_path, '/', 1) = parent_user_id::text
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
  add column if not exists art_access boolean not null default false,
  add column if not exists student_nickname text,
  add column if not exists parent_name text,
  add column if not exists birth_date date,
  add column if not exists age_years integer
    check (age_years is null or age_years between 1 and 18),
  add column if not exists allergy_food text,
  add column if not exists allergy_pollen text,
  add column if not exists student_notes text,
  add column if not exists enrollment_source public.enrollment_source not null default 'online',
  add column if not exists branch_id uuid references public.branches(id) on delete set null,
  add column if not exists payment_method public.payment_method not null default 'unpaid',
  add column if not exists paid_amount numeric(10,2) not null default 0
    check (paid_amount >= 0),
  add column if not exists paid_at date,
  add column if not exists payment_note text;

alter table public.enrollment_applications
  alter column slip_path drop not null;

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_slip_path_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_slip_path_check
  check (
    slip_path is null
    or slip_path = ''
    or split_part(slip_path, '/', 1) = parent_user_id::text
  );

create index if not exists enrollment_parent_user_id_idx
  on public.enrollment_applications(parent_user_id);

create index if not exists enrollment_status_created_at_idx
  on public.enrollment_applications(status, created_at desc);

create index if not exists enrollment_branch_id_idx
  on public.enrollment_applications(branch_id);

create index if not exists branches_is_active_name_idx
  on public.branches(is_active, name);

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

drop trigger if exists branches_set_updated_at on public.branches;
create trigger branches_set_updated_at
before update on public.branches
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

drop function if exists public.submit_enrollment(
  text,
  text,
  public.course_code,
  text
);

create or replace function public.submit_enrollment(
  p_student_name text,
  p_student_nickname text,
  p_parent_name text,
  p_parent_phone text,
  p_course public.course_code,
  p_enrollment_source public.enrollment_source,
  p_branch_id uuid,
  p_payment_method public.payment_method,
  p_paid_amount numeric,
  p_slip_path text default null,
  p_birth_date date default null,
  p_age_years integer default null,
  p_allergy_food text default null,
  p_allergy_pollen text default null,
  p_student_notes text default null,
  p_payment_note text default null,
  p_paid_at date default null
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

  if p_slip_path is not null
     and p_slip_path <> ''
     and split_part(p_slip_path, '/', 1) <> v_user_id::text then
    raise exception 'Invalid payment slip path';
  end if;

  if p_enrollment_source = 'branch' and p_branch_id is null then
    raise exception 'Branch is required for franchise enrollment';
  end if;

  if p_branch_id is not null and not exists (
    select 1
    from public.branches
    where id = p_branch_id
      and is_active = true
  ) then
    raise exception 'Selected branch is not active';
  end if;

  if p_age_years is not null and p_age_years not between 1 and 18 then
    raise exception 'Invalid student age';
  end if;

  select email
  into v_parent_email
  from auth.users
  where id = v_user_id;

  insert into public.enrollment_applications (
    parent_user_id,
    student_name,
    student_nickname,
    parent_name,
    parent_phone,
    parent_email,
    course,
    slip_path,
    enrollment_source,
    branch_id,
    payment_method,
    paid_amount,
    paid_at,
    birth_date,
    age_years,
    allergy_food,
    allergy_pollen,
    student_notes,
    payment_note,
    status,
    payment_status
  )
  values (
    v_user_id,
    trim(p_student_name),
    nullif(trim(coalesce(p_student_nickname, '')), ''),
    nullif(trim(coalesce(p_parent_name, '')), ''),
    trim(p_parent_phone),
    v_parent_email,
    p_course,
    nullif(p_slip_path, ''),
    p_enrollment_source,
    case when p_enrollment_source = 'branch' then p_branch_id else null end,
    p_payment_method,
    coalesce(p_paid_amount, 0),
    p_paid_at,
    p_birth_date,
    p_age_years,
    nullif(trim(coalesce(p_allergy_food, '')), ''),
    nullif(trim(coalesce(p_allergy_pollen, '')), ''),
    nullif(trim(coalesce(p_student_notes, '')), ''),
    nullif(trim(coalesce(p_payment_note, '')), ''),
    'pending',
    case
      when p_payment_method in ('cash', 'transfer', 'admin_chat')
           and coalesce(p_paid_amount, 0) > 0 then 'pending'
      else 'pending'
    end
  )
  returning * into v_application;

  return v_application;
end;
$$;

revoke all on function public.submit_enrollment(
  text,
  text,
  text,
  text,
  public.course_code,
  public.enrollment_source,
  uuid,
  public.payment_method,
  numeric,
  text,
  date,
  integer,
  text,
  text,
  text,
  text,
  date
) from public;

grant execute on function public.submit_enrollment(
  text,
  text,
  text,
  text,
  public.course_code,
  public.enrollment_source,
  uuid,
  public.payment_method,
  numeric,
  text,
  date,
  integer,
  text,
  text,
  text,
  text,
  date
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
alter table public.branches enable row level security;

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

drop policy if exists "Anyone can read active branches"
  on public.branches;
create policy "Anyone can read active branches"
on public.branches
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can read all branches"
  on public.branches;
create policy "Admins can read all branches"
on public.branches
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can manage branches"
  on public.branches;
create policy "Admins can manage branches"
on public.branches
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Direct inserts are disabled. The browser must use submit_enrollment(),
-- which always creates a pending application owned by the signed-in user.
revoke all on public.profiles from anon;
revoke all on public.enrollment_applications from anon;
revoke all on public.branches from anon;
revoke insert, update, delete on public.profiles from authenticated;
revoke insert, delete on public.enrollment_applications from authenticated;
revoke all on public.branches from authenticated;
grant select on public.profiles to authenticated;
grant select, update on public.enrollment_applications to authenticated;
grant select on public.branches to anon;
grant select, insert, update, delete on public.branches to authenticated;

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

-- Creative Art course content management
create table if not exists public.art_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(trim(title)) between 2 and 180),
  subtitle text,
  age_group text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.art_levels (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.art_categories(id) on delete cascade,
  level_number smallint not null check (level_number between 1 and 20),
  title text not null check (char_length(trim(title)) between 2 and 180),
  subtitle text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, level_number)
);

create table if not exists public.art_lessons (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.art_categories(id) on delete restrict,
  level_id uuid references public.art_levels(id) on delete set null,
  title text not null check (char_length(trim(title)) between 2 and 180),
  story_prompt text,
  video_path text,
  video_url text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    video_url is null
    or video_url ~* '^https?://'
  )
);

create table if not exists public.art_lesson_images (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.art_lessons(id) on delete cascade,
  image_path text not null check (image_path <> ''),
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.art_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.art_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists art_levels_category_idx
  on public.art_levels(category_id, sort_order);

create index if not exists art_lessons_category_level_idx
  on public.art_lessons(category_id, level_id, sort_order);

create index if not exists art_lesson_images_lesson_idx
  on public.art_lesson_images(lesson_id, sort_order);

drop trigger if exists art_categories_set_updated_at
  on public.art_categories;
create trigger art_categories_set_updated_at
before update on public.art_categories
for each row execute function public.set_updated_at();

drop trigger if exists art_levels_set_updated_at
  on public.art_levels;
create trigger art_levels_set_updated_at
before update on public.art_levels
for each row execute function public.set_updated_at();

drop trigger if exists art_lessons_set_updated_at
  on public.art_lessons;
create trigger art_lessons_set_updated_at
before update on public.art_lessons
for each row execute function public.set_updated_at();

drop trigger if exists art_lesson_images_set_updated_at
  on public.art_lesson_images;
create trigger art_lesson_images_set_updated_at
before update on public.art_lesson_images
for each row execute function public.set_updated_at();

insert into public.art_categories (
  slug,
  title,
  subtitle,
  age_group,
  sort_order
)
values
  (
    'try-play-3-5',
    'ศิลปะสำหรับเด็ก 3-5 ปี TRY & PLAY',
    'ระบายสี ปั้น ตัด แปะ ไปกับนิทานแสนสนุก',
    '3-5 ปี',
    1
  ),
  (
    'creative-art-5-8',
    'ศิลปะสำหรับเด็กอายุ 5-8 ปี',
    'ฝึกคิด วางแผน ออกแบบ และเล่าเรื่องผ่านงานศิลปะ',
    '5-8 ปี',
    2
  ),
  (
    'watercolor',
    'สีน้ำ (Water Color)',
    'เรียนรู้สี น้ำหนักแสง เงา และบรรยากาศแบบสีน้ำ',
    'ทุกวัย',
    3
  ),
  (
    'clay',
    'ปั้นดินเบา (CLAY)',
    'สร้างตัวละครและชิ้นงานสามมิติจากดินเบา',
    'ทุกวัย',
    4
  )
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  age_group = excluded.age_group,
  sort_order = excluded.sort_order;

insert into public.art_levels (
  category_id,
  level_number,
  title,
  subtitle,
  sort_order
)
select id, 1, 'Level 1', 'ระบายสี ปั้น ตัด แปะ ไปกับนิทานแสนสนุก', 1
from public.art_categories where slug = 'try-play-3-5'
union all
select id, 2, 'Level 2', 'ฝึกฝนการวาดรูปง่าย ๆ จากเรขาคณิตพื้นฐาน ไปกับนิทานแสนสนุก', 2
from public.art_categories where slug = 'try-play-3-5'
union all
select id, 3, 'Level 3', 'พัฒนาการวาดไปอีกขั้นเพื่อแก้ไขปัญหาให้กับตัวละครสุดน่ารัก', 3
from public.art_categories where slug = 'try-play-3-5'
union all
select id, 1, 'Level 1', 'ฝึกความคิดสร้างสรรค์ คิดวางแผน ก่อนลงมือทำ', 1
from public.art_categories where slug = 'creative-art-5-8'
union all
select id, 2, 'Level 2', 'ฝึกความคิดสร้างสรรค์ คิดวางแผน ก่อนลงมือทำ ไปอีกขั้น', 2
from public.art_categories where slug = 'creative-art-5-8'
union all
select id, 3, 'Level 3', 'ฝึกการวาดแบบสเกตและออกแบบเนื้อเรื่องและพื้นหลัง', 3
from public.art_categories where slug = 'creative-art-5-8'
on conflict (category_id, level_number) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  sort_order = excluded.sort_order;

create or replace function private.has_art_access()
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
      and art_access = true
  );
$$;

revoke all on function private.has_art_access() from public;
grant execute on function private.has_art_access() to authenticated;

alter table public.art_categories enable row level security;
alter table public.art_levels enable row level security;
alter table public.art_lessons enable row level security;
alter table public.art_lesson_images enable row level security;
alter table public.art_lesson_progress enable row level security;

drop policy if exists "Art students read published categories"
  on public.art_categories;
create policy "Art students read published categories"
on public.art_categories
for select
to authenticated
using (
  (is_published and (select private.has_art_access()))
  or (select private.is_admin())
);

drop policy if exists "Admins manage art categories"
  on public.art_categories;
create policy "Admins manage art categories"
on public.art_categories
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Art students read published levels"
  on public.art_levels;
create policy "Art students read published levels"
on public.art_levels
for select
to authenticated
using (
  (is_published and (select private.has_art_access()))
  or (select private.is_admin())
);

drop policy if exists "Admins manage art levels"
  on public.art_levels;
create policy "Admins manage art levels"
on public.art_levels
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Art students read published lessons"
  on public.art_lessons;
create policy "Art students read published lessons"
on public.art_lessons
for select
to authenticated
using (
  (is_published and (select private.has_art_access()))
  or (select private.is_admin())
);

drop policy if exists "Admins manage art lessons"
  on public.art_lessons;
create policy "Admins manage art lessons"
on public.art_lessons
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Art students read lesson images"
  on public.art_lesson_images;
create policy "Art students read lesson images"
on public.art_lesson_images
for select
to authenticated
using (
  exists (
    select 1
    from public.art_lessons
    where art_lessons.id = art_lesson_images.lesson_id
      and art_lessons.is_published
      and (select private.has_art_access())
  )
  or (select private.is_admin())
);

drop policy if exists "Admins manage art lesson images"
  on public.art_lesson_images;
create policy "Admins manage art lesson images"
on public.art_lesson_images
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Students read their art progress"
  on public.art_lesson_progress;
create policy "Students read their art progress"
on public.art_lesson_progress
for select
to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_art_access())
);

drop policy if exists "Students complete art lessons"
  on public.art_lesson_progress;
create policy "Students complete art lessons"
on public.art_lesson_progress
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and (select private.has_art_access())
);

drop policy if exists "Students reset their art progress"
  on public.art_lesson_progress;
create policy "Students reset their art progress"
on public.art_lesson_progress
for delete
to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_art_access())
);

revoke all on public.art_categories from anon;
revoke all on public.art_levels from anon;
revoke all on public.art_lessons from anon;
revoke all on public.art_lesson_images from anon;
revoke all on public.art_lesson_progress from anon;
grant select, insert, update, delete on public.art_categories to authenticated;
grant select, insert, update, delete on public.art_levels to authenticated;
grant select, insert, update, delete on public.art_lessons to authenticated;
grant select, insert, update, delete on public.art_lesson_images to authenticated;
grant select, insert, delete on public.art_lesson_progress to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'art-videos',
  'art-videos',
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
  'art-gallery',
  'art-gallery',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins manage art course files"
  on storage.objects;
create policy "Admins manage art course files"
on storage.objects
for all
to authenticated
using (
  bucket_id in ('art-videos', 'art-gallery')
  and (select private.is_admin())
)
with check (
  bucket_id in ('art-videos', 'art-gallery')
  and (select private.is_admin())
);

drop policy if exists "Art students read course files"
  on storage.objects;
create policy "Art students read course files"
on storage.objects
for select
to authenticated
using (
  bucket_id in ('art-videos', 'art-gallery')
  and (
    (select private.has_art_access())
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
