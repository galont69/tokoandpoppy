-- Toko & Poppy: Course weekly schedule
-- Run after:
-- 1) supabase-enrollment-schema.sql
-- 2) supabase-branch-admin-schema.sql
-- 3) supabase-learning-history-schema.sql
-- 4) supabase-branch-staff-schema.sql
--
-- Purpose:
--   Store the regular weekly class day/time for each course enrollment.
--   This prepares the data model for parent reminders one day before class.

create schema if not exists private;

alter table public.course_enrollments
  add column if not exists class_weekday smallint
    check (class_weekday is null or class_weekday between 0 and 6),
  add column if not exists class_start_time time,
  add column if not exists class_end_time time,
  add column if not exists class_schedule_note text,
  add column if not exists class_reminder_enabled boolean not null default true,
  add column if not exists class_timezone text not null default 'Asia/Bangkok';

create index if not exists course_enrollments_class_schedule_idx
  on public.course_enrollments(class_weekday, class_start_time)
  where class_weekday is not null and class_start_time is not null;

create or replace function public.update_course_schedule(
  p_course_enrollment_id uuid,
  p_class_weekday integer default null,
  p_class_start_time time default null,
  p_class_end_time time default null,
  p_class_schedule_note text default null,
  p_class_reminder_enabled boolean default true
)
returns public.course_enrollments
language plpgsql
security definer
set search_path = public, private
as $$
declare
  target_enrollment public.course_enrollments%rowtype;
  saved_enrollment public.course_enrollments%rowtype;
begin
  if p_course_enrollment_id is null then
    raise exception 'Course enrollment id is required';
  end if;

  select * into target_enrollment
  from public.course_enrollments
  where id = p_course_enrollment_id
  for update;

  if not found then
    raise exception 'ไม่พบคอร์สของนักเรียนคนนี้';
  end if;

  if not private.can_manage_learning_branch(target_enrollment.branch_id) then
    raise exception 'ไม่มีสิทธิ์แก้ตารางเรียนของสาขานี้';
  end if;

  if p_class_weekday is not null and (p_class_weekday < 0 or p_class_weekday > 6) then
    raise exception 'วันเรียนไม่ถูกต้อง';
  end if;

  if p_class_weekday is not null and p_class_start_time is null then
    raise exception 'กรุณาระบุเวลาเริ่มเรียน';
  end if;

  if p_class_start_time is not null and p_class_end_time is not null
     and p_class_end_time <= p_class_start_time then
    raise exception 'เวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน';
  end if;

  update public.course_enrollments
  set
    class_weekday = p_class_weekday::smallint,
    class_start_time = p_class_start_time,
    class_end_time = p_class_end_time,
    class_schedule_note = nullif(trim(coalesce(p_class_schedule_note, '')), ''),
    class_reminder_enabled = coalesce(p_class_reminder_enabled, true),
    class_timezone = 'Asia/Bangkok',
    updated_at = now()
  where id = target_enrollment.id
  returning * into saved_enrollment;

  return saved_enrollment;
end;
$$;

revoke all on function public.update_course_schedule(uuid, integer, time, time, text, boolean) from public;
grant execute on function public.update_course_schedule(uuid, integer, time, time, text, boolean)
  to authenticated;
