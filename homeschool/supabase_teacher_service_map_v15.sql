-- Teacher service map location and service radius.
-- Run once after supabase_teacher_creator_flow_v14.sql.

begin;

alter table public.teacher_service_listings
  add column if not exists service_latitude double precision,
  add column if not exists service_longitude double precision,
  add column if not exists service_radius_km numeric(6,2);

alter table public.teacher_service_listings
  drop constraint if exists teacher_service_latitude_range,
  drop constraint if exists teacher_service_longitude_range,
  drop constraint if exists teacher_service_radius_range,
  add constraint teacher_service_latitude_range
    check (service_latitude is null or service_latitude between -90 and 90),
  add constraint teacher_service_longitude_range
    check (service_longitude is null or service_longitude between -180 and 180),
  add constraint teacher_service_radius_range
    check (service_radius_km is null or service_radius_km between 1 and 100);

create index if not exists teacher_service_listings_location_idx
on public.teacher_service_listings(service_latitude, service_longitude)
where service_latitude is not null and service_longitude is not null;

commit;
