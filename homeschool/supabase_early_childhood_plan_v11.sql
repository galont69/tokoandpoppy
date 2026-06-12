-- Early-childhood homeschool education plan
-- Run once in Supabase Dashboard > SQL Editor.

begin;

alter table public.homeschool_applications
  add column if not exists early_childhood_plan_data jsonb
  not null default '{}'::jsonb;

comment on column public.homeschool_applications.early_childhood_plan_data is
  'Editable early-childhood homeschool education plan entered by the parent.';

commit;

