-- Public teacher details and portfolio images for Marketplace.
-- Run once after supabase_marketplace_public_v16.sql.

begin;

alter table public.teacher_service_listings
  add column if not exists profile_image_path text,
  add column if not exists portfolio_image_paths text[] not null default '{}';

drop function if exists public.get_marketplace_teacher_services();

create function public.get_marketplace_teacher_services()
returns table (
  id uuid,
  teacher_user_id uuid,
  teacher_name text,
  provider_type text,
  teacher_education_summary text,
  teacher_experience_summary text,
  teacher_province text,
  title text,
  subjects text[],
  learner_age_range text,
  service_area text,
  service_latitude double precision,
  service_longitude double precision,
  service_radius_km numeric,
  teaching_mode text,
  price_description text,
  availability text,
  contact_phone text,
  contact_line text,
  description text,
  profile_image_path text,
  portfolio_image_paths text[],
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    s.id,
    s.teacher_user_id,
    t.display_name as teacher_name,
    t.provider_type,
    t.education_summary as teacher_education_summary,
    t.experience_summary as teacher_experience_summary,
    t.province as teacher_province,
    s.title,
    s.subjects,
    s.learner_age_range,
    s.service_area,
    s.service_latitude,
    s.service_longitude,
    s.service_radius_km,
    s.teaching_mode,
    s.price_description,
    s.availability,
    s.contact_phone,
    s.contact_line,
    s.description,
    s.profile_image_path,
    s.portfolio_image_paths,
    s.created_at
  from public.teacher_service_listings s
  join public.teacher_profiles t on t.user_id = s.teacher_user_id
  join public.profiles p on p.id = s.teacher_user_id
  where s.status = 'published'
    and p.role = 'teacher'
    and p.approval_status = 'active'
  order by s.created_at desc;
$$;

revoke all on function public.get_marketplace_teacher_services() from public;
grant execute on function public.get_marketplace_teacher_services() to authenticated;

commit;
