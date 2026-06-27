-- Toko & Poppy: Student management tools
-- Run after:
-- 1) supabase-enrollment-schema.sql
-- 2) supabase-branch-admin-schema.sql
-- 3) supabase-learning-history-schema.sql
--
-- Purpose:
--   Let main admins and assigned branch admins delete an approved student record
--   when a parent requests deletion or the family needs to submit a fresh application.

create schema if not exists private;

create or replace function public.delete_student_record(p_application_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  target_application public.enrollment_applications%rowtype;
  enrollment_count integer := 0;
  session_count integer := 0;
  can_delete boolean := false;
begin
  if p_application_id is null then
    raise exception 'Application id is required';
  end if;

  select * into target_application
  from public.enrollment_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'ไม่พบนักเรียนหรือใบสมัครนี้';
  end if;

  if target_application.status::text <> 'approved' then
    raise exception 'ลบได้เฉพาะนักเรียนที่อนุมัติแล้วจากเมนูนักเรียน';
  end if;

  select
    private.is_admin()
    or exists (
      select 1
      from public.profiles p
      join public.branch_admin_assignments a on a.user_id = p.id
      where p.id = auth.uid()
        and p.role::text = 'branch_admin'
        and a.branch_id = target_application.branch_id
        and a.is_active = true
    )
  into can_delete;

  if not coalesce(can_delete, false) then
    raise exception 'ไม่มีสิทธิ์ลบนักเรียนนี้';
  end if;

  select count(*) into enrollment_count
  from public.course_enrollments
  where application_id = target_application.id;

  select count(*) into session_count
  from public.learning_sessions
  where application_id = target_application.id;

  delete from public.enrollment_applications
  where id = target_application.id;

  return jsonb_build_object(
    'application_id', target_application.id,
    'student_name', target_application.student_name,
    'deleted_enrollments', enrollment_count,
    'deleted_sessions', session_count
  );
end;
$$;

revoke all on function public.delete_student_record(uuid) from public;
grant execute on function public.delete_student_record(uuid) to authenticated;
