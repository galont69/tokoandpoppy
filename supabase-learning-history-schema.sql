-- Toko & Poppy Learning History / Progress Journal
-- Run after:
-- 1) outputs/supabase-enrollment-schema.sql
-- 2) outputs/supabase-branch-admin-schema.sql

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.enrollment_applications(id) on delete cascade,
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  student_name text not null,
  student_nickname text,
  course_type text not null check (course_type in ('robot', 'art')),
  level_label text,
  total_sessions integer not null default 30 check (total_sessions > 0),
  completed_sessions integer not null default 0 check (completed_sessions >= 0),
  certificate_half_awarded boolean not null default false,
  certificate_full_awarded boolean not null default false,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists course_enrollments_application_course_level_uidx
  on public.course_enrollments(application_id, course_type, coalesce(level_label, ''));

create index if not exists course_enrollments_parent_idx
  on public.course_enrollments(parent_user_id, created_at desc);

create index if not exists course_enrollments_branch_idx
  on public.course_enrollments(branch_id, created_at desc);

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  course_enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  application_id uuid not null references public.enrollment_applications(id) on delete cascade,
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  session_number integer not null check (session_number > 0),
  session_date date not null default current_date,
  lesson_title text,
  teacher_comment text,
  photo_path text,
  recorded_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists learning_sessions_enrollment_number_uidx
  on public.learning_sessions(course_enrollment_id, session_number);

create index if not exists learning_sessions_parent_idx
  on public.learning_sessions(parent_user_id, session_date desc);

create index if not exists learning_sessions_branch_idx
  on public.learning_sessions(branch_id, session_date desc);

create or replace function private.can_manage_learning_branch(target_branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select private.is_admin()
    or exists (
      select 1
      from public.profiles p
      join public.branch_admin_assignments a on a.user_id = p.id
      where p.id = auth.uid()
        and p.role::text = 'branch_admin'
        and a.branch_id = target_branch_id
        and a.is_active = true
    );
$$;

create or replace function public.ensure_course_enrollments_for_application(target_application_id uuid)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare
  app public.enrollment_applications%rowtype;
begin
  select * into app
  from public.enrollment_applications
  where id = target_application_id;

  if not found or app.status::text <> 'approved' then
    return;
  end if;

  if coalesce(app.robot_access, false) or app.course::text in ('robot', 'both') then
    insert into public.course_enrollments (
      application_id,
      parent_user_id,
      branch_id,
      student_name,
      student_nickname,
      course_type,
      level_label,
      total_sessions
    )
    values (
      app.id,
      app.parent_user_id,
      app.branch_id,
      app.student_name,
      app.student_nickname,
      'robot',
      'โรบอท + โค้ดดิ้ง',
      30
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          updated_at = now();
  end if;

  if coalesce(app.art_access, false) or app.course::text in ('art', 'both') then
    insert into public.course_enrollments (
      application_id,
      parent_user_id,
      branch_id,
      student_name,
      student_nickname,
      course_type,
      level_label,
      total_sessions
    )
    values (
      app.id,
      app.parent_user_id,
      app.branch_id,
      app.student_name,
      app.student_nickname,
      'art',
      'ศิลปะ Level 1',
      12
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          updated_at = now();
  end if;
end;
$$;

create or replace function public.sync_course_enrollments_from_application()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  if new.status::text = 'approved' then
    perform public.ensure_course_enrollments_for_application(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists enrollment_sync_course_enrollments on public.enrollment_applications;
create trigger enrollment_sync_course_enrollments
after insert or update of status, robot_access, art_access, branch_id, student_name, student_nickname
on public.enrollment_applications
for each row execute function public.sync_course_enrollments_from_application();

do $$
declare
  app record;
begin
  for app in
    select id from public.enrollment_applications where status::text = 'approved'
  loop
    perform public.ensure_course_enrollments_for_application(app.id);
  end loop;
end $$;

create or replace function public.record_learning_session(
  p_course_enrollment_id uuid,
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
  next_session integer;
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

  select coalesce(max(session_number), 0) + 1
  into next_session
  from public.learning_sessions
  where course_enrollment_id = p_course_enrollment_id;

  if next_session > enrollment.total_sessions then
    raise exception 'คอร์สนี้บันทึกครบจำนวนครั้งแล้ว';
  end if;

  insert into public.learning_sessions (
    course_enrollment_id,
    application_id,
    parent_user_id,
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
    enrollment.branch_id,
    next_session,
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

grant execute on function public.ensure_course_enrollments_for_application(uuid) to authenticated;
grant execute on function public.record_learning_session(uuid, date, text, text, text) to authenticated;

alter table public.course_enrollments enable row level security;
alter table public.learning_sessions enable row level security;

drop policy if exists "Parents read own course enrollments" on public.course_enrollments;
create policy "Parents read own course enrollments"
on public.course_enrollments
for select
to authenticated
using (
  parent_user_id = auth.uid()
  or private.can_manage_learning_branch(branch_id)
);

drop policy if exists "Admins manage course enrollments" on public.course_enrollments;
create policy "Admins manage course enrollments"
on public.course_enrollments
for all
to authenticated
using (private.can_manage_learning_branch(branch_id))
with check (private.can_manage_learning_branch(branch_id));

drop policy if exists "Parents read own learning sessions" on public.learning_sessions;
create policy "Parents read own learning sessions"
on public.learning_sessions
for select
to authenticated
using (
  parent_user_id = auth.uid()
  or private.can_manage_learning_branch(branch_id)
);

drop policy if exists "Admins manage learning sessions" on public.learning_sessions;
create policy "Admins manage learning sessions"
on public.learning_sessions
for all
to authenticated
using (private.can_manage_learning_branch(branch_id))
with check (private.can_manage_learning_branch(branch_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'learning-session-photos',
  'learning-session-photos',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Learning session photos are public" on storage.objects;
create policy "Learning session photos are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'learning-session-photos');

drop policy if exists "Authenticated users upload learning photos" on storage.objects;
create policy "Authenticated users upload learning photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'learning-session-photos');

drop policy if exists "Authenticated users update learning photos" on storage.objects;
create policy "Authenticated users update learning photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'learning-session-photos')
with check (bucket_id = 'learning-session-photos');
