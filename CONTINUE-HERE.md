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
