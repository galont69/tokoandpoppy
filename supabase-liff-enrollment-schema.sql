-- Toko & Poppy: LINE LIFF branch enrollment
-- Run after supabase-enrollment-schema.sql.
--
-- Purpose:
--   Let parents submit a branch enrollment form from LINE OA rich menu
--   without creating a Supabase Auth account first.
--
-- Important:
--   Applications from LIFF are stored in public.enrollment_applications
--   with enrollment_source = 'branch' and registration_source = 'line_liff'.

create extension if not exists pgcrypto;

alter type public.course_code add value if not exists 'creative_art';
alter type public.course_code add value if not exists 'water_color';
alter type public.course_code add value if not exists 'clay';

alter table public.enrollment_applications
  alter column parent_user_id drop not null;

alter table public.enrollment_applications
  add column if not exists registration_source text not null default 'web',
  add column if not exists line_user_id text,
  add column if not exists line_display_name text,
  add column if not exists line_picture_url text,
  add column if not exists line_status_message text,
  add column if not exists line_liff_context jsonb not null default '{}'::jsonb,
  add column if not exists preferred_contact text,
  add column if not exists branch_note text;

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_registration_source_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_registration_source_check
  check (registration_source in ('web', 'line_liff', 'branch_staff'));

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_preferred_contact_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_preferred_contact_check
  check (preferred_contact is null or preferred_contact in ('line', 'phone', 'either'));

alter table public.enrollment_applications
  drop constraint if exists enrollment_applications_slip_path_check;

alter table public.enrollment_applications
  add constraint enrollment_applications_slip_path_check
  check (
    slip_path is null
    or slip_path = ''
    or split_part(slip_path, '/', 1) = parent_user_id::text
    or (parent_user_id is null and split_part(slip_path, '/', 1) = 'liff')
  );

create index if not exists enrollment_registration_source_idx
  on public.enrollment_applications(registration_source, created_at desc);

create index if not exists enrollment_line_user_id_idx
  on public.enrollment_applications(line_user_id);

drop policy if exists "Anon can upload liff payment slips"
  on storage.objects;
create policy "Anon can upload liff payment slips"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'payment-slips'
  and (storage.foldername(name))[1] = 'liff'
);

drop function if exists public.submit_liff_enrollment(
  text,
  text,
  text,
  text,
  text,
  public.course_code,
  uuid,
  date,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text
);

drop function if exists public.submit_liff_enrollment(
  text,
  text,
  text,
  text,
  text,
  public.course_code,
  uuid,
  public.payment_method,
  numeric,
  text,
  date,
  date,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text
);

create or replace function public.submit_liff_enrollment(
  p_student_name text,
  p_student_nickname text default null,
  p_parent_name text default null,
  p_parent_phone text default null,
  p_parent_email text default null,
  p_course public.course_code default 'art',
  p_branch_id uuid default null,
  p_payment_method public.payment_method default 'transfer',
  p_paid_amount numeric default null,
  p_slip_path text default null,
  p_paid_at date default current_date,
  p_birth_date date default null,
  p_allergy_food text default null,
  p_allergy_pollen text default null,
  p_student_notes text default null,
  p_line_user_id text default null,
  p_line_display_name text default null,
  p_line_picture_url text default null,
  p_line_status_message text default null,
  p_line_liff_context jsonb default '{}'::jsonb,
  p_preferred_contact text default 'line',
  p_branch_note text default null
)
returns public.enrollment_applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_parent_email text;
  v_parent_phone text;
  v_parent_name text;
  v_application public.enrollment_applications;
begin
  if p_student_name is null or char_length(trim(p_student_name)) < 2 then
    raise exception 'กรุณากรอกชื่อนักเรียน';
  end if;

  if p_branch_id is null then
    raise exception 'กรุณาเลือกสาขาที่สมัคร';
  end if;

  if not exists (
    select 1
    from public.branches
    where id = p_branch_id
      and is_active = true
  ) then
    raise exception 'ไม่พบสาขาที่เปิดใช้งาน';
  end if;

  v_parent_phone := nullif(trim(coalesce(p_parent_phone, '')), '');
  if v_parent_phone is null or char_length(v_parent_phone) < 8 then
    raise exception 'กรุณากรอกเบอร์โทรศัพท์ผู้ปกครอง';
  end if;

  v_parent_name := nullif(trim(coalesce(p_parent_name, '')), '');
  if v_parent_name is null then
    raise exception 'กรุณากรอกชื่อผู้ปกครอง';
  end if;

  if p_birth_date is not null and (p_birth_date > current_date or p_birth_date < current_date - interval '18 years') then
    raise exception 'วันเกิดของนักเรียนไม่ถูกต้อง';
  end if;

  if p_payment_method is distinct from 'transfer' then
    raise exception 'ใบสมัครผ่าน LINE ต้องเลือกชำระแบบโอนเงิน';
  end if;

  if p_paid_amount is null or p_paid_amount <= 0 then
    raise exception 'กรุณากรอกยอดโอนให้ถูกต้อง';
  end if;

  if nullif(trim(coalesce(p_slip_path, '')), '') is null then
    raise exception 'กรุณาแนบสลิปโอนเงิน';
  end if;

  if split_part(p_slip_path, '/', 1) <> 'liff' then
    raise exception 'ตำแหน่งไฟล์สลิปไม่ถูกต้อง';
  end if;

  if p_paid_at is null or p_paid_at > current_date + 1 or p_paid_at < current_date - 365 then
    raise exception 'วันที่โอนไม่ถูกต้อง';
  end if;

  v_parent_email := nullif(trim(coalesce(p_parent_email, '')), '');
  if v_parent_email is null then
    v_parent_email := 'line-' ||
      coalesce(
        nullif(regexp_replace(lower(coalesce(p_line_user_id, '')), '[^a-z0-9]+', '-', 'g'), ''),
        replace(gen_random_uuid()::text, '-', '')
      ) ||
      '@line.tokoandpoppy.local';
  end if;

  insert into public.enrollment_applications (
    parent_user_id,
    student_name,
    student_nickname,
    parent_name,
    parent_phone,
    parent_email,
    course,
    enrollment_source,
    branch_id,
    payment_method,
    paid_amount,
    slip_path,
    paid_at,
    payment_status,
    status,
    birth_date,
    age_years,
    allergy_food,
    allergy_pollen,
    student_notes,
    payment_note,
    registration_source,
    line_user_id,
    line_display_name,
    line_picture_url,
    line_status_message,
    line_liff_context,
    preferred_contact,
    branch_note
  )
  values (
    null,
    trim(p_student_name),
    nullif(trim(coalesce(p_student_nickname, '')), ''),
    v_parent_name,
    v_parent_phone,
    v_parent_email,
    p_course,
    'branch',
    p_branch_id,
    p_payment_method,
    p_paid_amount,
    nullif(trim(coalesce(p_slip_path, '')), ''),
    p_paid_at,
    'pending',
    'pending',
    p_birth_date,
    case
      when p_birth_date is null then null
      else extract(year from age(current_date, p_birth_date))::integer
    end,
    nullif(trim(coalesce(p_allergy_food, '')), ''),
    nullif(trim(coalesce(p_allergy_pollen, '')), ''),
    nullif(trim(coalesce(p_student_notes, '')), ''),
    nullif(trim(coalesce(p_branch_note, '')), ''),
    'line_liff',
    nullif(trim(coalesce(p_line_user_id, '')), ''),
    nullif(trim(coalesce(p_line_display_name, '')), ''),
    nullif(trim(coalesce(p_line_picture_url, '')), ''),
    nullif(trim(coalesce(p_line_status_message, '')), ''),
    coalesce(p_line_liff_context, '{}'::jsonb),
    coalesce(nullif(trim(coalesce(p_preferred_contact, '')), ''), 'line'),
    nullif(trim(coalesce(p_branch_note, '')), '')
  )
  returning * into v_application;

  return v_application;
end;
$$;

revoke all on function public.submit_liff_enrollment(
  text,
  text,
  text,
  text,
  text,
  public.course_code,
  uuid,
  public.payment_method,
  numeric,
  text,
  date,
  date,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text
) from public;

grant execute on function public.submit_liff_enrollment(
  text,
  text,
  text,
  text,
  text,
  public.course_code,
  uuid,
  public.payment_method,
  numeric,
  text,
  date,
  date,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb,
  text,
  text
) to anon, authenticated;
