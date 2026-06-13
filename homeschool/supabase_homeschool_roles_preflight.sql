-- Homeschool roles preflight for Toko & Poppy.
-- Run this file first, then run supabase_homeschool_core_for_toko_poppy.sql.
--
-- Why this exists:
-- PostgreSQL requires newly-added enum values to be committed before they can
-- be used by later statements. Supabase SQL Editor may run the whole script in
-- one transaction, so role values like "teacher" and "district" need this
-- small preflight query first.

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'user_role'
  ) then
    create type public.user_role as enum ('parent', 'admin', 'teacher', 'district');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_enum
    where enumtypid = 'public.user_role'::regtype
      and enumlabel = 'teacher'
  ) then
    alter type public.user_role add value 'teacher';
  end if;

  if not exists (
    select 1
    from pg_enum
    where enumtypid = 'public.user_role'::regtype
      and enumlabel = 'district'
  ) then
    alter type public.user_role add value 'district';
  end if;
end $$;
