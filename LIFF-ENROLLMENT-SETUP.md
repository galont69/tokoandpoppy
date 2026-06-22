# LINE LIFF Enrollment Setup

## 1. Run SQL

Run this file in Supabase SQL Editor after the normal enrollment schema:

```sql
supabase-liff-enrollment-schema.sql
```

It adds LINE metadata to `enrollment_applications`, enables LIFF payment slip uploads, adds art-course enrollment choices, and creates `submit_liff_enrollment`.

If you already ran an older version of this file, run it again. The script is written to update the LIFF RPC and storage policy in place.

## 2. Create LIFF App

In LINE Developers:

- Channel: use the LINE Login channel connected to the OA.
- LIFF type: Full.
- Endpoint URL:

```text
https://your-domain.com/liff-enrollment.html
```

Copy the LIFF ID into `supabase-config.js`:

```js
liffEnrollmentId: "YOUR_LIFF_ID"
```

## 3. Rich Menu URL

Use this URL in LINE OA rich menu:

```text
https://your-domain.com/liff-enrollment.html?branch=BRANCH_CODE
```

You can also pass a branch UUID:

```text
https://your-domain.com/liff-enrollment.html?branch_id=SUPABASE_BRANCH_ID
```

## 4. Admin View

Applications submitted from this page appear in the existing admin enrollment table as:

- `ช่องทางสมัคร`: ผ่านสาขา
- `แหล่งที่มา`: LINE LIFF
- `ยอดชำระ`, `วันที่ชำระ`, and slip evidence from the parent upload
- LINE display name / LINE user id in details and CSV export

Note: this flow creates a pending enrollment application, not a parent login account. If you want parents to log in later, create or link a Supabase Auth parent account during the approval workflow.
