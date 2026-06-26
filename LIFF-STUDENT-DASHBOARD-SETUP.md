# ตั้งค่า LIFF หน้าข้อมูลลูกของฉัน

หน้านี้ใช้สำหรับให้ผู้ปกครองเปิดจาก LINE OA แล้วดูข้อมูลของลูก เช่น ใบสมัคร คอร์สที่เปิดสิทธิ จำนวนครั้งคงเหลือ และสมุดพัฒนาการจากที่ครูบันทึกไว้

## 1. รัน SQL ใน Supabase

รันไฟล์นี้ใน Supabase SQL Editor หลังจากรันชุดสมัครเรียน/LIFF/learning history เดิมแล้ว:

```text
supabase-liff-student-dashboard.sql
```

ไฟล์นี้จะสร้าง RPC:

```sql
public.get_liff_student_dashboard(p_line_user_id text)
```

RPC นี้ดึงข้อมูลเฉพาะใบสมัครและคอร์สที่ผูกกับ LINE user id ของผู้ปกครอง

## 2. สร้าง LIFF App แยกสำหรับหน้าข้อมูลลูก

ใน LINE Developers > LINE Login channel > LIFF > Add:

- LIFF app name: `Toko Student Dashboard`
- Size: `Tall`
- Endpoint URL:

```text
https://tokoandpoppy.vercel.app/liff-student.html
```

- Scopes: เลือก `openid` และ `profile`
- Add friend option: `On (Normal)`

จากนั้นคัดลอก LIFF ID ที่ได้มาใส่ในไฟล์:

```text
supabase-config.js
```

ตรงนี้:

```js
liffStudentId: "ใส่-LIFF-ID-ของหน้าข้อมูลลูก"
```

## 3. URL สำหรับ Rich Menu ใน LINE OA

ใช้ URL นี้ในปุ่มเมนู LINE OA เช่น “ข้อมูลลูกของฉัน”:

```text
https://tokoandpoppy.vercel.app/liff-student.html
```

ถ้าเปิดจาก LINE ระบบจะอ่าน LINE user id อัตโนมัติ

## 4. วิธีทดสอบใน Browser ปกติ

ถ้าต้องการทดสอบโดยไม่เปิดผ่าน LINE ให้ใช้ LINE user id จากใบสมัคร:

```text
https://tokoandpoppy.vercel.app/liff-student.html?line_user_id=LINE_USER_ID
```

ตัวอย่าง:

```text
https://tokoandpoppy.vercel.app/liff-student.html?line_user_id=U9323d3f61474bab5680f38e95daed15e
```

## หมายเหตุสำคัญ

ถ้าผู้ปกครองสมัครผ่าน LIFF แต่ยังไม่ได้รับการอนุมัติ หรือยังไม่ได้ผูกบัญชี/เปิดสิทธิคอร์ส หน้า LIFF จะเห็นใบสมัครก่อน แต่คอร์สและ timeline อาจยังว่างอยู่จนกว่าสาขาจะอนุมัติและเปิดแพ็กเกจให้เรียบร้อย
