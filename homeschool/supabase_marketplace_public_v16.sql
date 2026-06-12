-- Safe public data for the authenticated parent marketplace.
-- Run once after supabase_teacher_creator_flow_v14.sql and
-- supabase_teacher_service_map_v15.sql.

begin;

create or replace function public.get_marketplace_worksheets()
returns table (
  id uuid,
  teacher_user_id uuid,
  teacher_name text,
  provider_type text,
  title text,
  description text,
  subject text,
  age_range text,
  price numeric,
  free_sample_path text,
  cover_path text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    w.id,
    w.teacher_user_id,
    t.display_name as teacher_name,
    t.provider_type,
    w.title,
    w.description,
    w.subject,
    w.age_range,
    w.price,
    w.free_sample_path,
    w.cover_path,
    w.created_at
  from public.teacher_worksheets w
  join public.teacher_profiles t on t.user_id = w.teacher_user_id
  join public.profiles p on p.id = w.teacher_user_id
  where w.status = 'published'
    and p.role = 'teacher'
    and p.approval_status = 'active'
  order by w.created_at desc;
$$;

create or replace function public.get_marketplace_teacher_services()
returns table (
  id uuid,
  teacher_user_id uuid,
  teacher_name text,
  provider_type text,
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
    s.created_at
  from public.teacher_service_listings s
  join public.teacher_profiles t on t.user_id = s.teacher_user_id
  join public.profiles p on p.id = s.teacher_user_id
  where s.status = 'published'
    and p.role = 'teacher'
    and p.approval_status = 'active'
  order by s.created_at desc;
$$;

revoke all on function public.get_marketplace_worksheets() from public;
revoke all on function public.get_marketplace_teacher_services() from public;
grant execute on function public.get_marketplace_worksheets() to authenticated;
grant execute on function public.get_marketplace_teacher_services() to authenticated;

commit;
