# Toko & Poppy Main - Current Working Copy

อัปเดตในแชทนี้: 16 มิถุนายน 2026

## ใช้ไฟล์ชุดนี้เป็นตัวหลัก

ชุดนี้มาจาก `/Users/ekkachaihuayyai/Downloads/tokoandpoppy-main.zip` และครบกว่าโฟลเดอร์ก่อนหน้า เพราะมี:

- `assets/codekids/` สำหรับภาพตัวละคร/ฉากเกม Codekids
- `homeschool/assets/vendor/docx.iife.js`
- `homeschool/assets/fonts/`
- `homeschool/assets/templates/` พร้อมไฟล์ `.docx` ชื่อไทย

## จุดเข้าใช้งาน

- หน้าแรก: `index.html`
- ระบบผู้ดูแล: `admin.html`
- บทเรียน Robot: `robot-lessons.html`
- บทเรียน Art: `art-lessons.html`
- เกม Codekids: `codekids.html`
- ระบบ Homeschool: `homeschool/index.html`
- Supabase config กลาง: `supabase-config.js`

## สิ่งที่จัดให้แล้ว

- แตก zip เป็นโฟลเดอร์ output ใหม่โดยรักษาชื่อไฟล์ template ภาษาไทย
- ให้หน้าแรกเลิกใช้ Supabase URL/anon key สำรองที่ฝังใน `script.js`
- ให้เว็บหลักและหน้า Homeschool อ่านค่าจาก `supabase-config.js` จุดเดียว
- อัปเดตโน้ต Homeschool database integration ให้ตรงกับสถานะปัจจุบัน

## งานถัดไปที่ควรทำ

1. รัน SQL fix สมัครเรียนถ้ายังไม่ได้รัน: `fix-submit-enrollment-payment-status.sql`
2. สมัครเรียนทดสอบ 1 คน แล้วตรวจใน `admin.html`
3. Approve ผู้เรียน แล้ว login ทดสอบหน้า Robot, Art และ Codekids
4. หลังระบบสมัครเรียนนิ่ง ค่อยเริ่มรัน SQL migration ฝั่ง Homeschool ตาม `homeschool/HOMESCHOOL-DATABASE-INTEGRATION.md`

## อัปเดตล่าสุด 28 มิถุนายน 2026

- หน้า admin เมนู “นักเรียน” มีปุ่ม `เพิ่มนักเรียน` สำหรับเพิ่มนักเรียนเก่าโดยทีมงาน
- ครู, แอดมินสาขา และแอดมินหลักเพิ่มนักเรียนในสาขาที่ตัวเองมีสิทธิ์ได้
- เพิ่มนักเรียนได้แม้รู้แค่ชื่อเล่น โดยชื่อจริง/คอร์ส/จำนวนครั้ง/ตารางเรียน/ผู้ปกครองสามารถกรอกภายหลังได้
- เพิ่มหลายคอร์สให้เด็ก 1 คนได้ในฟอร์มเดียว และแต่ละคอร์สมีตารางเรียนของตัวเอง
- การ์ดนักเรียนมีปุ่ม `แก้ไข / เพิ่มคอร์ส` สำหรับแก้วันเกิด ข้อมูลผู้ปกครอง ตารางเรียน จำนวนครั้ง หรือเพิ่มคอร์สภายหลัง
- สร้างข้อมูลพร้อมใช้กับสมุดพัฒนาการ ตารางเรียน และแจ้งเตือนเรียน
- เพิ่มเมนู `รายรับสาขา` สำหรับแอดมินหลัก/แอดมินสาขา ดูรายการเปิดคอร์สตามช่วงวันที่ สาขา คอร์ส และ export CSV
- หน้า `สาขาเฟรนไชน์` แอดมินหลักสามารถกดแก้ไขข้อมูลสาขาเดิมได้ ไม่ต้องสร้างสาขาใหม่
- หน้า `สาขาเฟรนไชน์` เพิ่มตาราง `ตั้งราคาคอร์ส` สำหรับ Creative Art, Water Color, Clay และ Robot + Coding
- ราคาคอร์สตั้งต้นมาจากภาพราคาล่าสุด: ศิลปะ 4/8/12/24 ครั้ง, Clay 1/5/10 ครั้ง, Robot 5/10/15/30 ครั้ง พร้อมราคาปกติ/ส่วนลด/ราคาสุทธิ
- SQL `supabase-branch-revenue-ledger.sql` จะสร้าง ledger รายรับอัตโนมัติทุกครั้งที่มี `course_enrollments` ใหม่ และ backfill รายการเดิม โดยใช้ราคาสุทธิจาก `course_pricing`
- ค่าแฟรนไชส์ในรายรับใช้ `franchise_fee_rate` ของแต่ละสาขา ณ ตอนเปิดคอร์ส
- นักเรียนที่เพิ่มโดยทีมงานใช้ `registration_source = 'staff_created'` และ `parent_link_status = 'unlinked'`
- เมื่อผูกบัญชีผู้ปกครองภายหลัง ระบบจะไม่ reset จำนวนครั้งของนักเรียนที่ทีมงานเพิ่มเอง

SQL ที่ต้องรันเพิ่มหลังอัปไฟล์:

1. `supabase-student-management.sql`
2. `supabase-course-schedule.sql`
3. `supabase-class-reminders.sql`
4. `supabase-staff-student-import.sql`
5. `supabase-branch-revenue-ledger.sql`
