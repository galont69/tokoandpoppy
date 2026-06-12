-- Editable primary-level homeschool education plan
-- Run once in Supabase Dashboard > SQL Editor.

begin;

alter table public.homeschool_applications
  add column if not exists primary_education_plan_data jsonb
  not null default '{}'::jsonb;

comment on column public.homeschool_applications.primary_education_plan_data is
  'Editable primary-level homeschool education plan entered by the parent.';

commit;
