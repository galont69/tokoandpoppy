-- Toko & Poppy: Staff-created legacy student import
-- Run after:
-- 1) supabase-enrollment-schema.sql
-- 2) supabase-branch-admin-schema.sql
-- 3) supabase-branch-staff-schema.sql
-- 4) supabase-learning-history-schema.sql
-- 5) supabase-art-program-packages.sql
-- 6) supabase-course-schedule.sql
--
-- Purpose:
--   Let teachers, branch admins, and main admins add existing students without
--   asking parents to submit a new enrollment form. Parent accounts can be
--   linked later from LIFF/admin flows.

create schema if not exists private;

alter table public.enrollment_applications
  alter column parent_user_id drop not null;

alter table public.enrollment_applications
  add column if not exists registration_source text not null default 'web',
  add column if not exists requested_courses text[] not null default '{}'::text[],
  add column if not exists parent_link_status text not null default 'linked',
  add column if not exists staff_created_by uuid references auth.users(id) on delete set null,
  add column if not exists staff_created_at timestamptz,
  add column if not exists legacy_note text;

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_registration_source_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_registration_source_check
  check (registration_source in ('web', 'line_liff', 'branch_staff', 'staff_created'));

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_requested_courses_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_requested_courses_check
  check (
    requested_courses is null
    or requested_courses <@ array['robot', 'art', 'creative_art', 'water_color', 'clay']::text[]
  );

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_parent_link_status_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_parent_link_status_check
  check (parent_link_status in ('unlinked', 'linked', 'pending_review'));

create index if not exists enrollment_staff_created_idx
  on public.enrollment_applications(registration_source, branch_id, created_at desc);

create index if not exists enrollment_parent_link_status_idx
  on public.enrollment_applications(parent_link_status, created_at desc);

create or replace function private.can_create_staff_student(target_branch_id uuid)
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
      where p.id = (select auth.uid())
        and p.role::text = 'branch_admin'
        and a.branch_id = target_branch_id
        and a.is_active = true
    )
    or exists (
      select 1
      from public.profiles p
      join public.branch_teacher_assignments a on a.user_id = p.id
      where p.id = (select auth.uid())
        and p.role::text = 'branch_teacher'
        and a.branch_id = target_branch_id
        and a.is_active = true
    );
$$;

revoke all on function private.can_create_staff_student(uuid) from public;
grant execute on function private.can_create_staff_student(uuid) to authenticated;

drop policy if exists "Branch learning staff can read branch applications"
  on public.enrollment_applications;

create policy "Branch learning staff can read branch applications"
on public.enrollment_applications
for select
to authenticated
using (
  branch_id is not null
  and private.can_create_staff_student(branch_id)
);

create or replace function public.create_staff_student_record(
  p_student_name text,
  p_student_nickname text default null,
  p_birth_date date default null,
  p_age_years integer default null,
  p_branch_id uuid default null,
  p_course_type text default 'creative_art',
  p_total_sessions integer default 12,
  p_completed_sessions integer default 0,
  p_level_label text default null,
  p_class_weekday integer default null,
  p_class_start_time time default null,
  p_class_end_time time default null,
  p_class_reminder_enabled boolean default true,
  p_parent_name text default null,
  p_parent_phone text default null,
  p_staff_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  saved_application public.enrollment_applications%rowtype;
  saved_enrollment public.course_enrollments%rowtype;
  normalized_course text := nullif(trim(coalesce(p_course_type, 'creative_art')), '');
  primary_course public.course_code;
  normalized_parent_phone text := nullif(trim(coalesce(p_parent_phone, '')), '');
  generated_parent_email text;
begin
  if nullif(trim(coalesce(p_student_name, '')), '') is null
     or char_length(trim(p_student_name)) < 2 then
    raise exception 'กรุณาระบุชื่อนักเรียนอย่างน้อย 2 ตัวอักษร';
  end if;

  if p_branch_id is null then
    raise exception 'กรุณาเลือกสาขา';
  end if;

  if not coalesce(private.can_create_staff_student(p_branch_id), false) then
    raise exception 'ไม่มีสิทธิ์เพิ่มนักเรียนในสาขานี้';
  end if;

  if normalized_course not in ('robot', 'art', 'creative_art', 'water_color', 'clay') then
    raise exception 'คอร์สไม่ถูกต้อง';
  end if;

  if p_total_sessions is null or p_total_sessions < 1 or p_total_sessions > 120 then
    raise exception 'จำนวนครั้งทั้งหมดต้องอยู่ระหว่าง 1 ถึง 120';
  end if;

  if p_completed_sessions is null
     or p_completed_sessions < 0
     or p_completed_sessions > p_total_sessions then
    raise exception 'จำนวนครั้งที่เรียนไปแล้วไม่ถูกต้อง';
  end if;

  if p_age_years is not null and (p_age_years < 1 or p_age_years > 18) then
    raise exception 'อายุนักเรียนต้องอยู่ระหว่าง 1 ถึง 18 ปี';
  end if;

  if p_class_weekday is not null and (p_class_weekday < 0 or p_class_weekday > 6) then
    raise exception 'วันเรียนไม่ถูกต้อง';
  end if;

  if (p_class_weekday is not null or p_class_start_time is not null or p_class_end_time is not null)
     and (p_class_weekday is null or p_class_start_time is null) then
    raise exception 'ถ้าตั้งตารางเรียน กรุณาระบุวันเรียนและเวลาเริ่ม';
  end if;

  if p_class_end_time is not null and p_class_start_time is not null
     and p_class_end_time <= p_class_start_time then
    raise exception 'เวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน';
  end if;

  if normalized_parent_phone is not null
     and char_length(normalized_parent_phone) not between 8 and 30 then
    raise exception 'เบอร์ผู้ปกครองต้องมีความยาว 8-30 ตัวอักษร';
  end if;

  primary_course := case when normalized_course = 'robot' then 'robot'::public.course_code else 'art'::public.course_code end;
  generated_parent_email := 'staff-' || replace(gen_random_uuid()::text, '-', '') || '@staff-created.tokoandpoppy.local';

  insert into public.enrollment_applications (
    parent_user_id,
    student_name,
    student_nickname,
    parent_name,
    parent_phone,
    parent_email,
    course,
    requested_courses,
    slip_path,
    enrollment_source,
    branch_id,
    payment_method,
    paid_amount,
    payment_note,
    birth_date,
    age_years,
    student_notes,
    status,
    payment_status,
    reviewed_by,
    reviewed_at,
    registration_source,
    parent_link_status,
    staff_created_by,
    staff_created_at,
    legacy_note,
    robot_access,
    art_access
  )
  values (
    null,
    trim(p_student_name),
    nullif(trim(coalesce(p_student_nickname, '')), ''),
    nullif(trim(coalesce(p_parent_name, '')), ''),
    coalesce(normalized_parent_phone, '00000000'),
    generated_parent_email,
    primary_course,
    array[normalized_course]::text[],
    null,
    'branch',
    p_branch_id,
    'admin_chat',
    0,
    nullif(trim(coalesce(p_staff_note, '')), ''),
    p_birth_date,
    p_age_years,
    nullif(trim(coalesce(p_staff_note, '')), ''),
    'approved',
    'verified',
    auth.uid(),
    now(),
    'staff_created',
    'unlinked',
    auth.uid(),
    now(),
    nullif(trim(coalesce(p_staff_note, '')), ''),
    normalized_course = 'robot',
    normalized_course <> 'robot'
  )
  returning * into saved_application;

  insert into public.course_enrollments (
    application_id,
    parent_user_id,
    line_user_id,
    branch_id,
    student_name,
    student_nickname,
    course_type,
    level_label,
    program_label,
    total_sessions,
    completed_sessions,
    approved_by,
    approved_at,
    status,
    package_note,
    class_weekday,
    class_start_time,
    class_end_time,
    class_schedule_note,
    class_reminder_enabled
  )
  values (
    saved_application.id,
    null,
    null,
    p_branch_id,
    trim(p_student_name),
    nullif(trim(coalesce(p_student_nickname, '')), ''),
    normalized_course,
    nullif(trim(coalesce(p_level_label, '')), ''),
    case
      when normalized_course = 'creative_art' then 'Creative Art'
      when normalized_course = 'water_color' then 'Water Color'
      when normalized_course = 'clay' then 'ปั้นดินเบา (CLAY)'
      when normalized_course = 'robot' then 'Robot + Coding'
      else 'ศิลปะ'
    end,
    p_total_sessions,
    p_completed_sessions,
    auth.uid(),
    now(),
    case when p_completed_sessions >= p_total_sessions then 'completed' else 'active' end,
    nullif(trim(coalesce(p_staff_note, '')), ''),
    p_class_weekday,
    p_class_start_time,
    p_class_end_time,
    null,
    case
      when p_class_weekday is null or p_class_start_time is null then false
      else coalesce(p_class_reminder_enabled, true)
    end
  )
  on conflict (application_id, course_type, (coalesce(level_label, '')))
  do update set
    student_name = excluded.student_name,
    student_nickname = excluded.student_nickname,
    branch_id = excluded.branch_id,
    total_sessions = excluded.total_sessions,
    completed_sessions = excluded.completed_sessions,
    program_label = excluded.program_label,
    package_note = excluded.package_note,
    class_weekday = excluded.class_weekday,
    class_start_time = excluded.class_start_time,
    class_end_time = excluded.class_end_time,
    class_reminder_enabled = excluded.class_reminder_enabled,
    status = excluded.status,
    updated_at = now()
  returning * into saved_enrollment;

  return jsonb_build_object(
    'application_id', saved_application.id,
    'course_enrollment_id', saved_enrollment.id,
    'student_name', saved_application.student_name,
    'registration_source', saved_application.registration_source,
    'parent_link_status', saved_application.parent_link_status
  );
end;
$$;

revoke all on function public.create_staff_student_record(
  text, text, date, integer, uuid, text, integer, integer, text, integer, time, time, boolean, text, text, text
) from public;
grant execute on function public.create_staff_student_record(
  text, text, date, integer, uuid, text, integer, integer, text, integer, time, time, boolean, text, text, text
) to authenticated;

create or replace function public.link_application_parent_account(
  p_application_id uuid,
  p_parent_user_id uuid
)
returns public.enrollment_applications
language plpgsql
security definer
set search_path = public, private
as $$
declare
  app public.enrollment_applications%rowtype;
  updated_application public.enrollment_applications%rowtype;
  target_email text;
  target_role text;
  requested text[] := array[]::text[];
  robot_sessions integer := null;
  creative_art_sessions integer := null;
  water_color_sessions integer := null;
  clay_sessions integer := null;
begin
  if p_parent_user_id is null then
    raise exception 'Parent account is required';
  end if;

  select *
  into app
  from public.enrollment_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found';
  end if;

  if not (
    private.is_admin()
    or (
      app.enrollment_source::text = 'branch'
      and private.is_branch_admin_for_branch(app.branch_id)
    )
  ) then
    raise exception 'Admin access is required for this application';
  end if;

  if app.parent_user_id is not null and app.parent_user_id <> p_parent_user_id then
    raise exception 'Application is already linked to another parent account';
  end if;

  select u.email::text
  into target_email
  from auth.users u
  where u.id = p_parent_user_id;

  if target_email is null then
    raise exception 'Parent account not found';
  end if;

  select p.role::text
  into target_role
  from public.profiles p
  where p.id = p_parent_user_id;

  if target_role is not null and target_role <> 'parent' then
    raise exception 'Selected account is not a parent account';
  end if;

  insert into public.profiles (id, role)
  values (p_parent_user_id, 'parent')
  on conflict (id) do nothing;

  update public.enrollment_applications
  set parent_user_id = p_parent_user_id,
      parent_email = case
        when parent_email is null
          or trim(parent_email) = ''
          or parent_email like '%@line.local'
          or parent_email like '%@staff-created.tokoandpoppy.local'
          then target_email
        else parent_email
      end,
      parent_link_status = 'linked',
      updated_at = now()
  where id = app.id
  returning * into updated_application;

  if updated_application.registration_source = 'staff_created' then
    update public.course_enrollments
    set parent_user_id = p_parent_user_id,
        updated_at = now()
    where application_id = updated_application.id;

    update public.learning_sessions
    set parent_user_id = p_parent_user_id,
        updated_at = now()
    where application_id = updated_application.id;

    return updated_application;
  end if;

  if updated_application.status::text = 'approved' then
    requested := coalesce(updated_application.requested_courses, array[]::text[]);

    if coalesce(updated_application.robot_access, false) then
      robot_sessions := 30;
    end if;

    if coalesce(updated_application.art_access, false) then
      if requested = array[]::text[]
        or 'art' = any(requested)
        or 'creative_art' = any(requested) then
        creative_art_sessions := 12;
      end if;

      if 'water_color' = any(requested) then
        water_color_sessions := 8;
      end if;

      if 'clay' = any(requested) then
        clay_sessions := 4;
      end if;
    end if;

    perform public.set_course_enrollment_packages(
      updated_application.id,
      robot_sessions,
      creative_art_sessions,
      water_color_sessions,
      clay_sessions,
      'Created when linking LINE application to parent account'
    );
  end if;

  return updated_application;
end;
$$;

revoke all on function public.link_application_parent_account(uuid, uuid) from public;
grant execute on function public.link_application_parent_account(uuid, uuid) to authenticated;
