# Supabase Migration Steps

## Step 1: Drop old tables
افتح SQL Editor وشغّل `000_drop_all.sql`

## Step 2: Create all tables with Primary Keys & Foreign Keys
بعد ما تمسح القديمة، شغّل `001_create_all.sql`

## Step 2.5: Auto-create profile on signup
بعد ما الجداول تتنشأ، شغّل `002_auto_profile.sql`
علشان كل ما تعمل user جديد في Auth، الـ profile يتعمل أوتوماتيك

## Step 3: Import your CSV data (optional)
بعد ما الجداول تتنشأ، استورد الـ CSV بتاعك في كل جدول

## Step 4: Test delete
جرب تمسح بيانات، المفروض تشتغل من غير error

---

## اللينكات
- Supabase SQL Editor: https://supabase.com/dashboard/project/ikifunpftkjbvqihnmti/sql/new
- Dashboard: https://tahakumtechnologyeg-cmyk.github.io/tahakum-dashboard/
- Website: https://tahakumtechnologyeg-cmyk.github.io/tahakum-technology/
