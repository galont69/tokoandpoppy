-- Fix submit_enrollment enum casting.
-- Run this once in Supabase Dashboard > SQL Editor if registration fails with:
-- column "payment_status" is of type public.payment_status but expression is of type text

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
  v_age_years integer;
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

  if p_birth_date is not null then
    if p_birth_date > current_date then
      raise exception 'Birth date cannot be in the future';
    end if;

    v_age_years := date_part('year', age(current_date, p_birth_date))::integer;

    if v_age_years not between 1 and 18 then
      raise exception 'Invalid student age';
    end if;
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
    v_age_years,
    nullif(trim(coalesce(p_allergy_food, '')), ''),
    nullif(trim(coalesce(p_allergy_pollen, '')), ''),
    nullif(trim(coalesce(p_student_notes, '')), ''),
    nullif(trim(coalesce(p_payment_note, '')), ''),
    'pending'::public.application_status,
    case
      when p_payment_method in ('cash', 'transfer', 'admin_chat')
           and coalesce(p_paid_amount, 0) > 0 then 'pending'::public.payment_status
      else 'pending'::public.payment_status
    end
  )
  returning * into v_application;

  return v_application;
end;
$$;

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
  text,
  text,
  text,
  text,
  date
) to authenticated;
