-- Toko & Poppy: LINE LIFF course access without required web account linking
-- Run once after the enrollment, learning-history, branch-staff, art-package, and LIFF enrollment SQL files.

create schema if not exists private;

alter table public.course_enrollments
  alter column parent_user_id drop not null,
  add column if not exists line_user_id text;

alter table public.learning_sessions
  alter column parent_user_id drop not null,
  add column if not exists line_user_id text;

create index if not exists course_enrollments_line_user_id_idx
  on public.course_enrollments(line_user_id, created_at desc);

create index if not exists learning_sessions_line_user_id_idx
  on public.learning_sessions(line_user_id, session_date desc);

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

  if app.parent_user_id is null and nullif(trim(coalesce(app.line_user_id, '')), '') is null then
    return;
  end if;

  if coalesce(app.robot_access, false) then
    insert into public.course_enrollments (
      application_id, parent_user_id, line_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions, approved_by, approved_at
    )
    values (
      app.id, app.parent_user_id, nullif(trim(coalesce(app.line_user_id, '')), ''),
      app.branch_id, app.student_name, app.student_nickname,
      'robot', 'โรบอท + โค้ดดิ้ง', 'โรบอท + โค้ดดิ้ง', 30, app.reviewed_by, app.reviewed_at
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          parent_user_id = coalesce(excluded.parent_user_id, public.course_enrollments.parent_user_id),
          line_user_id = coalesce(excluded.line_user_id, public.course_enrollments.line_user_id),
          student_name = excluded.student_name,
          student_nickname = excluded.student_nickname,
          program_label = excluded.program_label,
          approved_by = coalesce(public.course_enrollments.approved_by, excluded.approved_by),
          approved_at = coalesce(public.course_enrollments.approved_at, excluded.approved_at),
          updated_at = now();
  else
    update public.course_enrollments
    set status = 'paused', updated_at = now()
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
    set status = 'paused', updated_at = now()
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

  if app.parent_user_id is null and nullif(trim(coalesce(app.line_user_id, '')), '') is null then
    return;
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
      select 1
      from public.course_enrollments
      where application_id = app.id
        and course_type = 'creative_art'
        and completed_sessions > p_creative_art_sessions
    ) then
      raise exception 'Creative Art package cannot be lower than completed sessions';
    end if;

    insert into public.course_enrollments (
      application_id, parent_user_id, line_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions,
      approved_by, approved_at, session_package_note, package_note, status
    )
    values (
      app.id, app.parent_user_id, nullif(trim(coalesce(app.line_user_id, '')), ''),
      app.branch_id, app.student_name, app.student_nickname,
      'creative_art', 'Creative Art', 'Creative Art', p_creative_art_sessions,
      auth.uid(), now(), clean_note, clean_note, 'active'
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          parent_user_id = coalesce(excluded.parent_user_id, public.course_enrollments.parent_user_id),
          line_user_id = coalesce(excluded.line_user_id, public.course_enrollments.line_user_id),
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
      select 1
      from public.course_enrollments
      where application_id = app.id
        and course_type = 'water_color'
        and completed_sessions > p_water_color_sessions
    ) then
      raise exception 'Water Color package cannot be lower than completed sessions';
    end if;

    insert into public.course_enrollments (
      application_id, parent_user_id, line_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions,
      approved_by, approved_at, session_package_note, package_note, status
    )
    values (
      app.id, app.parent_user_id, nullif(trim(coalesce(app.line_user_id, '')), ''),
      app.branch_id, app.student_name, app.student_nickname,
      'water_color', 'Water Color', 'Water Color', p_water_color_sessions,
      auth.uid(), now(), clean_note, clean_note, 'active'
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          parent_user_id = coalesce(excluded.parent_user_id, public.course_enrollments.parent_user_id),
          line_user_id = coalesce(excluded.line_user_id, public.course_enrollments.line_user_id),
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
      select 1
      from public.course_enrollments
      where application_id = app.id
        and course_type = 'clay'
        and completed_sessions > p_clay_sessions
    ) then
      raise exception 'CLAY package cannot be lower than completed sessions';
    end if;

    insert into public.course_enrollments (
      application_id, parent_user_id, line_user_id, branch_id, student_name, student_nickname,
      course_type, level_label, program_label, total_sessions,
      approved_by, approved_at, session_package_note, package_note, status
    )
    values (
      app.id, app.parent_user_id, nullif(trim(coalesce(app.line_user_id, '')), ''),
      app.branch_id, app.student_name, app.student_nickname,
      'clay', 'ปั้นดินเบา (CLAY)', 'ปั้นดินเบา (CLAY)', p_clay_sessions,
      auth.uid(), now(), clean_note, clean_note, 'active'
    )
    on conflict (application_id, course_type, (coalesce(level_label, ''))) do update
      set branch_id = excluded.branch_id,
          parent_user_id = coalesce(excluded.parent_user_id, public.course_enrollments.parent_user_id),
          line_user_id = coalesce(excluded.line_user_id, public.course_enrollments.line_user_id),
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
    course_enrollment_id, application_id, parent_user_id, line_user_id, branch_id,
    session_number, session_date, lesson_title, teacher_comment, photo_path, recorded_by
  )
  values (
    enrollment.id, enrollment.application_id, enrollment.parent_user_id, enrollment.line_user_id, enrollment.branch_id,
    resolved_session_number, coalesce(p_session_date, current_date),
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
grant execute on function public.set_course_enrollment_packages(uuid, integer, integer, integer, integer, text) to authenticated;
grant execute on function public.set_course_enrollment_package(uuid, integer, integer, text) to authenticated;
grant execute on function public.record_learning_session(uuid, integer, date, text, text, text) to authenticated;

do $$
declare
  app record;
begin
  for app in
    select id
    from public.enrollment_applications
    where status::text = 'approved'
      and parent_user_id is null
      and nullif(trim(coalesce(line_user_id, '')), '') is not null
  loop
    perform public.ensure_course_enrollments_for_application(app.id);
  end loop;
end;
$$;
