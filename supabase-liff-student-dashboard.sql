-- Toko & Poppy: LINE LIFF student dashboard
-- Run after:
-- 1) supabase-enrollment-schema.sql
-- 2) supabase-branch-admin-schema.sql
-- 3) supabase-liff-enrollment-schema.sql
-- 4) supabase-learning-history-schema.sql
-- 5) supabase-art-program-packages.sql
-- 6) supabase-parent-account-linking.sql
--
-- Purpose:
--   Let parents open "ข้อมูลลูกของฉัน" from LINE LIFF and see only
--   applications, course progress, and learning timeline tied to their LINE user.

create schema if not exists private;

create or replace function public.get_liff_student_dashboard(p_line_user_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  clean_line_user_id text := nullif(trim(coalesce(p_line_user_id, '')), '');
  result jsonb;
begin
  if clean_line_user_id is null then
    raise exception 'LINE user id is required';
  end if;

  with matched_apps as (
    select ea.*
    from public.enrollment_applications ea
    where ea.line_user_id = clean_line_user_id
  ),
  matched_parent_ids as (
    select distinct ea.parent_user_id
    from matched_apps ea
    where ea.parent_user_id is not null
  ),
  all_apps as (
    select ea.*
    from public.enrollment_applications ea
    where ea.line_user_id = clean_line_user_id
       or (
        ea.parent_user_id is not null
        and ea.parent_user_id in (select parent_user_id from matched_parent_ids)
      )
  ),
  app_rows as (
    select
      ea.id,
      ea.parent_user_id,
      ea.student_name,
      ea.student_nickname,
      ea.parent_name,
      ea.parent_phone,
      ea.parent_email,
      ea.birth_date,
      ea.age_years,
      ea.allergy_food,
      ea.allergy_pollen,
      ea.student_notes,
      ea.course::text as course,
      coalesce(ea.requested_courses, '{}'::text[]) as requested_courses,
      ea.robot_access,
      ea.art_access,
      ea.status::text as status,
      ea.payment_status::text as payment_status,
      ea.payment_method::text as payment_method,
      ea.paid_amount,
      ea.paid_at,
      ea.registration_source,
      ea.line_display_name,
      ea.line_picture_url,
      ea.branch_id,
      b.name as branch_name,
      b.province as branch_province,
      b.contact_phone as branch_contact_phone,
      ea.created_at,
      ea.updated_at
    from all_apps ea
    left join public.branches b on b.id = ea.branch_id
  ),
  enrollment_rows as (
    select
      ce.id,
      ce.application_id,
      ce.parent_user_id,
      ce.branch_id,
      ce.student_name,
      ce.student_nickname,
      ce.course_type,
      ce.level_label,
      ce.total_sessions,
      ce.completed_sessions,
      greatest(ce.total_sessions - ce.completed_sessions, 0) as remaining_sessions,
      ce.certificate_half_awarded,
      ce.certificate_full_awarded,
      ce.status,
      b.name as branch_name,
      b.province as branch_province,
      b.contact_phone as branch_contact_phone,
      ce.created_at,
      ce.updated_at
    from public.course_enrollments ce
    left join public.branches b on b.id = ce.branch_id
    where ce.application_id in (select id from all_apps)
       or (
        ce.parent_user_id is not null
        and ce.parent_user_id in (select parent_user_id from matched_parent_ids)
      )
  ),
  session_rows as (
    select
      ls.id,
      ls.course_enrollment_id,
      ls.application_id,
      ls.parent_user_id,
      ls.branch_id,
      ls.session_number,
      ls.session_date,
      ls.lesson_title,
      ls.teacher_comment,
      ls.photo_path,
      ce.course_type,
      ce.level_label,
      ce.total_sessions,
      ce.student_name,
      ce.student_nickname,
      b.name as branch_name,
      ls.created_at,
      ls.updated_at
    from public.learning_sessions ls
    left join public.course_enrollments ce on ce.id = ls.course_enrollment_id
    left join public.branches b on b.id = ls.branch_id
    where ls.application_id in (select id from all_apps)
       or ls.course_enrollment_id in (select id from enrollment_rows)
       or (
        ls.parent_user_id is not null
        and ls.parent_user_id in (select parent_user_id from matched_parent_ids)
      )
    order by ls.session_date desc, ls.created_at desc
    limit 80
  )
  select jsonb_build_object(
    'applications',
      coalesce((
        select jsonb_agg(to_jsonb(app_rows) order by created_at desc)
        from app_rows
      ), '[]'::jsonb),
    'enrollments',
      coalesce((
        select jsonb_agg(to_jsonb(enrollment_rows) order by created_at desc)
        from enrollment_rows
      ), '[]'::jsonb),
    'sessions',
      coalesce((
        select jsonb_agg(to_jsonb(session_rows) order by session_date desc, created_at desc)
        from session_rows
      ), '[]'::jsonb)
  )
  into result;

  return result;
end;
$$;

revoke all on function public.get_liff_student_dashboard(text) from public;
grant execute on function public.get_liff_student_dashboard(text) to anon, authenticated;
