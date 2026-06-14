-- Toko & Poppy Art Program Packages
-- Run after:
-- 1) outputs/supabase-enrollment-schema.sql
-- 2) outputs/supabase-branch-admin-schema.sql
-- 3) outputs/supabase-learning-history-schema.sql
-- 4) outputs/supabase-flexible-session-packages.sql
--
-- Adds separate art package enrollments:
-- - creative_art
-- - water_color
-- - clay

create schema if not exists private;

alter table public.course_enrollments
  drop constraint if exists course_enrollments_course_type_check;

alter table public.course_enrollments
  add constraint course_enrollments_course_type_check
  check (course_type in ('robot', 'art', 'creative_art', 'water_color', 'clay'));

alter table public.course_enrollments
  add column if not exists program_label text,
  add column if not exists package_cycle integer not null default 1,
  add column if not exists package_started_at date default current_date,
  add column if not exists package_note text;

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

  if coalesce(app.robot_access, false) then
    insert into public.course_enrollments (
      application_id,
      parent_user_id,
      branch_id,
      student_name,
      student_nickname,
      course_type,
      level_label,
      program_label,
      total_sessions,
      approved_by,
      approved_at
    )
    values (
      app.id,
      app.parent_user_id,
      app.branch_id,
      app.student_name,
      app.student_nickname,
      'robot',
      'โรบอท + โค้ดดิ้ง',
      'โรบอท + โค้ดดิ้ง',
      30,
      app.reviewed_by,
      app.reviewed_at
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          program_label = excluded.program_label,
          approved_by = coalesce(public.course_enrollments.approved_by, excluded.approved_by),
          approved_at = coalesce(public.course_enrollments.approved_at, excluded.approved_at),
          updated_at = now();
  else
    update public.course_enrollments
    set status = 'paused',
        updated_at = now()
    where application_id = app.id
      and course_type = 'robot'
      and completed_sessions > 0;

    delete from public.course_enrollments
    where application_id = app.id
      and course_type = 'robot'
      and completed_sessions = 0;
  end if;

  if not coalesce(app.art_access, false) then
    update public.course_enrollments
    set status = 'paused',
        updated_at = now()
    where application_id = app.id
      and course_type in ('art', 'creative_art', 'water_color', 'clay')
      and completed_sessions > 0;

    delete from public.course_enrollments
    where application_id = app.id
      and course_type in ('art', 'creative_art', 'water_color', 'clay')
      and completed_sessions = 0;
  end if;
end;
$$;

create or replace function public.set_course_enrollment_packages(
  p_application_id uuid,
  p_robot_sessions integer default null,
  p_creative_art_sessions integer default null,
  p_water_color_sessions integer default null,
  p_clay_sessions integer default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare
  app public.enrollment_applications%rowtype;
  clean_note text := nullif(trim(coalesce(p_note, '')), '');
begin
  select * into app
  from public.enrollment_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found';
  end if;

  if app.status::text <> 'approved' then
    raise exception 'Application must be approved before setting session package';
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

  perform public.ensure_course_enrollments_for_application(app.id);

  if coalesce(app.robot_access, false) and p_robot_sessions is not null then
    if p_robot_sessions < 1 or p_robot_sessions > 120 then
      raise exception 'Robot sessions must be between 1 and 120';
    end if;

    if exists (
      select 1
      from public.course_enrollments
      where application_id = app.id
        and course_type = 'robot'
        and completed_sessions > p_robot_sessions
    ) then
      raise exception 'Robot package cannot be lower than completed sessions';
    end if;

    update public.course_enrollments
    set total_sessions = p_robot_sessions,
        approved_by = auth.uid(),
        approved_at = coalesce(approved_at, now()),
        session_package_note = clean_note,
        package_note = clean_note,
        status = case when completed_sessions >= p_robot_sessions then 'completed' else 'active' end,
        updated_at = now()
    where application_id = app.id
      and course_type = 'robot';
  end if;

  if not coalesce(app.art_access, false) then
    return;
  end if;

  if p_creative_art_sessions is not null then
    if p_creative_art_sessions < 1 or p_creative_art_sessions > 120 then
      raise exception 'Creative Art sessions must be between 1 and 120';
    end if;

    if exists (
      select 1 from public.course_enrollments
      where application_id = app.id
        and course_type = 'creative_art'
        and completed_sessions > p_creative_art_sessions
    ) then
      raise exception 'Creative Art package cannot be lower than completed sessions';
    end if;

    insert into public.course_enrollments (
      application_id, parent_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions,
      approved_by, approved_at, session_package_note, package_note, status
    )
    values (
      app.id, app.parent_user_id, app.branch_id, app.student_name, app.student_nickname,
      'creative_art', 'Creative Art', 'Creative Art', p_creative_art_sessions,
      auth.uid(), now(), clean_note, clean_note, 'active'
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          total_sessions = excluded.total_sessions,
          program_label = excluded.program_label,
          approved_by = auth.uid(),
          approved_at = coalesce(public.course_enrollments.approved_at, now()),
          session_package_note = clean_note,
          package_note = clean_note,
          status = case
            when public.course_enrollments.completed_sessions >= excluded.total_sessions then 'completed'
            else 'active'
          end,
          updated_at = now();
  else
    update public.course_enrollments
    set status = 'paused', updated_at = now()
    where application_id = app.id
      and course_type = 'creative_art'
      and completed_sessions > 0;

    delete from public.course_enrollments
    where application_id = app.id
      and course_type = 'creative_art'
      and completed_sessions = 0;
  end if;

  if p_water_color_sessions is not null then
    if p_water_color_sessions < 1 or p_water_color_sessions > 120 then
      raise exception 'Water Color sessions must be between 1 and 120';
    end if;

    if exists (
      select 1 from public.course_enrollments
      where application_id = app.id
        and course_type = 'water_color'
        and completed_sessions > p_water_color_sessions
    ) then
      raise exception 'Water Color package cannot be lower than completed sessions';
    end if;

    insert into public.course_enrollments (
      application_id, parent_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions,
      approved_by, approved_at, session_package_note, package_note, status
    )
    values (
      app.id, app.parent_user_id, app.branch_id, app.student_name, app.student_nickname,
      'water_color', 'Water Color', 'Water Color', p_water_color_sessions,
      auth.uid(), now(), clean_note, clean_note, 'active'
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          total_sessions = excluded.total_sessions,
          program_label = excluded.program_label,
          approved_by = auth.uid(),
          approved_at = coalesce(public.course_enrollments.approved_at, now()),
          session_package_note = clean_note,
          package_note = clean_note,
          status = case
            when public.course_enrollments.completed_sessions >= excluded.total_sessions then 'completed'
            else 'active'
          end,
          updated_at = now();
  else
    update public.course_enrollments
    set status = 'paused', updated_at = now()
    where application_id = app.id
      and course_type = 'water_color'
      and completed_sessions > 0;

    delete from public.course_enrollments
    where application_id = app.id
      and course_type = 'water_color'
      and completed_sessions = 0;
  end if;

  if p_clay_sessions is not null then
    if p_clay_sessions < 1 or p_clay_sessions > 120 then
      raise exception 'CLAY sessions must be between 1 and 120';
    end if;

    if exists (
      select 1 from public.course_enrollments
      where application_id = app.id
        and course_type = 'clay'
        and completed_sessions > p_clay_sessions
    ) then
      raise exception 'CLAY package cannot be lower than completed sessions';
    end if;

    insert into public.course_enrollments (
      application_id, parent_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions,
      approved_by, approved_at, session_package_note, package_note, status
    )
    values (
      app.id, app.parent_user_id, app.branch_id, app.student_name, app.student_nickname,
      'clay', 'ปั้นดินเบา (CLAY)', 'ปั้นดินเบา (CLAY)', p_clay_sessions,
      auth.uid(), now(), clean_note, clean_note, 'active'
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          total_sessions = excluded.total_sessions,
          program_label = excluded.program_label,
          approved_by = auth.uid(),
          approved_at = coalesce(public.course_enrollments.approved_at, now()),
          session_package_note = clean_note,
          package_note = clean_note,
          status = case
            when public.course_enrollments.completed_sessions >= excluded.total_sessions then 'completed'
            else 'active'
          end,
          updated_at = now();
  else
    update public.course_enrollments
    set status = 'paused', updated_at = now()
    where application_id = app.id
      and course_type = 'clay'
      and completed_sessions > 0;

    delete from public.course_enrollments
    where application_id = app.id
      and course_type = 'clay'
      and completed_sessions = 0;
  end if;
end;
$$;

create or replace function public.set_course_enrollment_package(
  p_application_id uuid,
  p_robot_sessions integer default null,
  p_art_sessions integer default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  perform public.set_course_enrollment_packages(
    p_application_id,
    p_robot_sessions,
    p_art_sessions,
    null,
    null,
    p_note
  );
end;
$$;

grant execute on function public.ensure_course_enrollments_for_application(uuid) to authenticated;
grant execute on function public.set_course_enrollment_packages(
  uuid,
  integer,
  integer,
  integer,
  integer,
  text
) to authenticated;
grant execute on function public.set_course_enrollment_package(
  uuid,
  integer,
  integer,
  text
) to authenticated;
