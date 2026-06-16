-- Toko & Poppy Parent Profile Update
-- Run after the core enrollment schema.
-- Lets parents update only safe learner/contact fields on their own latest profile/application.

create or replace function public.update_parent_application_profile(
  p_application_id uuid,
  p_student_name text,
  p_student_nickname text default null,
  p_parent_name text default null,
  p_parent_phone text default null,
  p_birth_date date default null,
  p_allergy_food text default null,
  p_allergy_pollen text default null,
  p_student_notes text default null
)
returns public.enrollment_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_application public.enrollment_applications;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication is required';
  end if;

  update public.enrollment_applications
  set
    student_name = nullif(trim(p_student_name), ''),
    student_nickname = nullif(trim(p_student_nickname), ''),
    parent_name = nullif(trim(p_parent_name), ''),
    parent_phone = nullif(trim(p_parent_phone), ''),
    birth_date = p_birth_date,
    allergy_food = nullif(trim(p_allergy_food), ''),
    allergy_pollen = nullif(trim(p_allergy_pollen), ''),
    student_notes = nullif(trim(p_student_notes), ''),
    updated_at = now()
  where id = p_application_id
    and parent_user_id = (select auth.uid())
  returning *
  into v_application;

  if v_application.id is null then
    raise exception 'Application not found or not owned by this parent';
  end if;

  return v_application;
end;
$$;

grant execute on function public.update_parent_application_profile(
  uuid,
  text,
  text,
  text,
  text,
  date,
  text,
  text,
  text
) to authenticated;
