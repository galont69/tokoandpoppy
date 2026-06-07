# ตั้งค่าหน้า Admin กับ Supabase

## 1. สร้างโครงสร้างฐานข้อมูล

เปิด Supabase Dashboard > SQL Editor แล้วรันไฟล์:

`supabase-enrollment-schema.sql`

ไฟล์นี้สามารถรันซ้ำเพื่ออัปเดตฐานข้อมูลเดิมได้ และจะเพิ่ม:

- `robot_access` สำหรับสิทธิ์คอร์สโรบอท
- `art_access` สำหรับสิทธิ์คอร์สศิลปะ
- RPC `review_enrollment` สำหรับอนุมัติหรือปฏิเสธใบสมัคร
- Storage bucket ส่วนตัว `payment-slips`
- RLS สำหรับผู้ปกครองและ Admin
- บทเรียนโรบอท 31 บท
- Storage ส่วนตัวสำหรับวิดีโอและ PDF แบบต่อ LEGO
- ตารางสะสมความคืบหน้าของนักเรียน

## 2. เชื่อมหน้าเว็บกับโปรเจกต์

เปิดไฟล์ `supabase-config.js` แล้วใส่ Project URL และ anon key:

```js
window.SUPABASE_CONFIG = {
  url: "https://PROJECT_ID.supabase.co",
  anonKey: "YOUR_ANON_KEY"
};
```

หาได้จาก Supabase Dashboard > Project Settings > API

ห้ามนำ `service_role` key มาใส่ในเว็บไซต์

## 3. สร้างบัญชี Admin

1. สร้างผู้ใช้ Admin ใน Supabase Dashboard > Authentication > Users
2. รันไฟล์ `promote-admin.sql` หรือรัน SQL นี้ โดยเปลี่ยนอีเมลให้ตรงกับบัญชี Admin:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'admin@example.com'
);
```

3. เปิด `admin.html` แล้วเข้าสู่ระบบด้วยบัญชีดังกล่าว

## 4. การยืนยันอีเมล

ฟอร์มสมัครปัจจุบันต้องมี session ทันทีเพื่ออัปโหลดสลิป แนะนำให้ไปที่:

Supabase Dashboard > Authentication > Providers > Email

แล้วปิด `Confirm email` ในช่วงเริ่มต้น หรือเปลี่ยนระบบภายหลังให้ผู้ปกครอง
ยืนยันอีเมลและกลับมาอัปโหลดสลิปอีกครั้ง

## ลำดับการทำงาน

1. ผู้ปกครองสมัครผ่าน `index.html`
2. Supabase Auth สร้างบัญชีและเข้ารหัสรหัสผ่าน
3. รูปสลิปถูกอัปโหลดลง bucket ส่วนตัว
4. ใบสมัครถูกบันทึกเป็น `pending`
5. Admin เปิด `admin.html` เพื่อตรวจสลิป
6. Admin เลือกสิทธิ์โรบอท ศิลปะ หรือทั้งสองคอร์ส
7. RPC เปลี่ยนสถานะเป็น `approved` และบันทึกสิทธิ์คอร์ส

## จัดการบทเรียนโรบอท

1. รัน `supabase-enrollment-schema.sql` ฉบับล่าสุด
2. เข้าหน้า `admin.html`
3. เลือกเมนู `จัดการบทเรียน`
4. เลือกบทที่ 1-31
5. กรอกชื่อและคำอธิบาย
6. อัปโหลดวิดีโอ หรือวางลิงก์ YouTube/วิดีโอ
7. อัปโหลด PDF แบบต่อ LEGO
8. เปิดสวิตช์ `เผยแพร่` แล้วกดบันทึก

หน้าเด็กอยู่ที่ `robot-lessons.html` และเปิดได้เฉพาะบัญชีที่ Admin
อนุมัติ `robot_access` แล้วเท่านั้น

ไฟล์ `sample-lesson-01-two-wheel.pdf` คือ PDF ตัวอย่างสำหรับบทที่ 1
