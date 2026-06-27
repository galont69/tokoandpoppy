-- Toko & Poppy: Class reminder workflow
-- Run after:
-- 1) supabase-course-schedule.sql
-- 2) supabase-branch-staff-schema.sql
--
-- Purpose:
--   Track which parent reminders were sent for scheduled classes.

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.course_reminder_logs (
  id uuid primary key default gen_random_uuid(),
  course_enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  application_id uuid references public.enrollment_applications(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  class_date date not null,
  message text,
  channel text not null default 'line' check (channel in ('line', 'phone', 'facebook', 'other')),
  sent_by uuid references auth.users(id) on delete set null default auth.uid(),
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (course_enrollment_id, class_date)
);

create index if not exists course_reminder_logs_class_date_idx
  on public.course_reminder_logs(class_date, branch_id);

alter table public.course_reminder_logs enable row level security;

drop policy if exists "Branch staff read reminder logs" on public.course_reminder_logs;
create policy "Branch staff read reminder logs"
on public.course_reminder_logs
for select
to authenticated
using (private.can_manage_learning_branch(branch_id));

drop policy if exists "Branch staff manage reminder logs" on public.course_reminder_logs;
create policy "Branch staff manage reminder logs"
on public.course_reminder_logs
for all
to authenticated
using (private.can_manage_learning_branch(branch_id))
with check (private.can_manage_learning_branch(branch_id));

create or replace function public.mark_course_reminder_sent(
  p_course_enrollment_id uuid,
  p_class_date date,
  p_message text default null,
  p_channel text default 'line'
)
returns public.course_reminder_logs
language plpgsql
security definer
set search_path = public, private
as $$
declare
  enrollment public.course_enrollments%rowtype;
  saved_log public.course_reminder_logs%rowtype;
  clean_channel text := coalesce(nullif(trim(p_channel), ''), 'line');
begin
  if p_course_enrollment_id is null then
    raise exception 'Course enrollment id is required';
  end if;

  if p_class_date is null then
    raise exception 'Class date is required';
  end if;

  select * into enrollment
  from public.course_enrollments
  where id = p_course_enrollment_id;

  if not found then
    raise exception 'ไม่พบคอร์สของนักเรียนคนนี้';
  end if;

  if not private.can_manage_learning_branch(enrollment.branch_id) then
    raise exception 'ไม่มีสิทธิ์บันทึกการแจ้งเตือนของสาขานี้';
  end if;

  if clean_channel not in ('line', 'phone', 'facebook', 'other') then
    clean_channel := 'line';
  end if;

  insert into public.course_reminder_logs (
    course_enrollment_id,
    application_id,
    branch_id,
    class_date,
    message,
    channel,
    sent_by,
    sent_at
  )
  values (
    enrollment.id,
    enrollment.application_id,
    enrollment.branch_id,
    p_class_date,
    nullif(trim(coalesce(p_message, '')), ''),
    clean_channel,
    auth.uid(),
    now()
  )
  on conflict (course_enrollment_id, class_date)
  do update set
    message = excluded.message,
    channel = excluded.channel,
    sent_by = excluded.sent_by,
    sent_at = now()
  returning * into saved_log;

  return saved_log;
end;
$$;

revoke all on function public.mark_course_reminder_sent(uuid, date, text, text) from public;
grant execute on function public.mark_course_reminder_sent(uuid, date, text, text)
  to authenticated;

grant select on public.course_reminder_logs to authenticated;
