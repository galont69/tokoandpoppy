# Homeschool Database Integration

ไฟล์นี้คือแผนรันฐานข้อมูล Homeschool เพื่อรวมเข้ากับฐานข้อมูล Toko & Poppy เดิม โดยเน้นความปลอดภัยและไม่ลบข้อมูลเดิม

## สิ่งที่เพิ่มเข้าฐานข้อมูล

- เพิ่ม role `teacher` และ `district` เข้า `public.user_role`
- เพิ่มข้อมูลโปรไฟล์ที่ Homeschool ต้องใช้ใน `public.profiles`
  - `full_name`
  - `phone`
  - `approval_status`
- เพิ่มตารางแกนกลางของ Homeschool
  - `education_districts`
  - `families`
  - `students`
  - `homeschool_applications`
  - `official_documents`
  - `district_officer_profiles`
- เพิ่ม Storage bucket `official-documents`
- เพิ่ม RPC สำหรับ Admin
  - `approve_district_officer`
  - `reject_district_officer`
- เพิ่ม wrapper `public.is_admin()` เพื่อให้ SQL Homeschool ชุดเดิมทำงานร่วมกับ schema หลักได้

## ลำดับการรัน SQL

ให้รันทีละไฟล์ใน Supabase Dashboard > SQL Editor ตามลำดับนี้

1. `outputs/supabase-enrollment-schema.sql`
2. `outputs/homeschool/supabase_homeschool_roles_preflight.sql`
3. `outputs/homeschool/supabase_homeschool_core_for_toko_poppy.sql`
4. `outputs/homeschool/supabase_early_childhood_plan_v11.sql`
5. `outputs/homeschool/supabase_primary_education_plan_v18.sql`
6. `outputs/homeschool/supabase_annual_learning_evidence_v13.sql`
7. `outputs/homeschool/supabase_word_document_upload_v12.sql`
8. `outputs/homeschool/supabase_teacher_creator_flow_v14.sql`
9. `outputs/homeschool/supabase_teacher_service_map_v15.sql`
10. `outputs/homeschool/supabase_marketplace_public_v16.sql`
11. `outputs/homeschool/supabase_marketplace_teacher_details_v17.sql`
12. `outputs/homeschool/supabase_district_template_library_v13.sql`

ถ้าเคยรันไฟล์บางตัวแล้ว สามารถรันซ้ำได้หลายส่วนเพราะออกแบบเป็น `create table if not exists`, `add column if not exists`, และ `create or replace function`

ถ้าเจอ error ประมาณนี้:

```text
unsafe use of new value "teacher" of enum type user_role
```

ให้รัน `outputs/homeschool/supabase_homeschool_roles_preflight.sql` ก่อนหนึ่งครั้ง แล้วค่อยรัน `outputs/homeschool/supabase_homeschool_core_for_toko_poppy.sql` ซ้ำอีกครั้ง

## ก่อนรันจริง

แนะนำให้ทำอย่างใดอย่างหนึ่งก่อน:

- Export ตารางสำคัญจาก Supabase เป็น CSV
- หรือใช้ SQL Editor สร้าง snapshot เฉพาะตารางหลัก เช่น `profiles`, `enrollment_applications`, `branches`

ตัวอย่าง snapshot แบบง่าย:

```sql
create table if not exists backup_profiles_20260613 as
select * from public.profiles;

create table if not exists backup_enrollment_applications_20260613 as
select * from public.enrollment_applications;

create table if not exists backup_branches_20260613 as
select * from public.branches;
```

## หมายเหตุสำคัญ

ตอนนี้ไฟล์ Homeschool ยังมี Supabase URL และ anon key แบบฝังอยู่ใน HTML เดิม ขั้นต่อไปควรรวมให้ทุกหน้าใช้ `outputs/supabase-config.js` ชุดเดียวกับเว็บ Toko & Poppy เพื่อให้เปลี่ยนโปรเจกต์ Supabase ได้จากที่เดียว
