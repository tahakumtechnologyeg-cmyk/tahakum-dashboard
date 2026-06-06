# Takamul Smart Solution — التوثيق الكامل

**Takamul Smart Solution — Water Treatment Monitor**  
نظام SCADA (Supervisory Control and Data Acquisition) لمراقبة والتحكم في محطات معالجة المياه.  
مبني كـ **Progressive Web App (PWA)** يشغل على الموبايل والويب، وبيتواصل مع هاردوير ESP32-S3 + STM32F401 عن طريق Supabase كـ backend/sync layer.

---

## 1. Identity & Branding

- **الاسم**: Takamul Smart Solution
- **الشعار**: Bolt icon (`public/bolt-logo.svg`)
- **الألوان الرئيسية**:
  - Header/Accent: `#B94040` (أحمر داكن دافي)
  - Background gradient: `#0A2A6E → #0E4A9C → #1565C0 → #0D47A1 → #083170` (أزرق غامق)
  - Text primary: `#FBF7EF` (أوف وايت)
  - Text secondary: `rgba(251,247,239,0.75)`
  - Accent blue: `#5B8DB8`
  - Green: `#3B6B45`
  - Amber: `#A0522D`
  - Red: `#B94040`
- **الخطوط**: Orbitron (display/headings), JetBrains Mono (mono/code), IBM Plex Sans (body)
- **الشعار النصي**: "TAKAMUL — SMART SOLUTION — WATER TREATMENT"
- **الإصدار**: v2.4.1
- **الـ PWA**: `manifest.json` مع support للـ standalone mode على iOS/Android

---

## 2. Tech Stack

| التقنية | الاستخدام | النسخة |
|---------|-----------|--------|
| React | Frontend UI | ^18.2.0 |
| Vite | Build tool & dev server | ^7.3.2 |
| Tailwind CSS | Styling (utility-first) | ^3.4.1 |
| Supabase JS | Backend: Auth, DB, Realtime, Storage | ^2.39.0 |
| Recharts | Charts (AreaChart, BarChart) | ^2.12.0 |
| Lucide React | أيقونات | ^0.344.0 |
| jsQR | QR code scanner | ^1.4.0 |
| PostCSS + Autoprefixer | CSS processing | latest |

### ملفات الإعدادات:

**`vite.config.js`**
```js
base: '/Takamul/',  // GitHub Pages deployment
build: { outDir: 'dist', assetsDir: 'assets' }
```

**`tailwind.config.js`**
- Custom font families: `mono` (JetBrains Mono), `display` (Orbitron), `body` (IBM Plex Sans)
- Custom colors تحت namespace `scada`:
  - `scada-bg: '#F5EFE4'` — البيج الفاتح للـ backgrounds
  - `scada-panel: '#FBF7EF'` — البيج للكروت
  - `scada-border: '#D4C9B5'` — البيج الرملي
  - `scada-accent: '#5B8DB8'` — أزرق هادي
  - `scada-green: '#3B6B45'` — أخضر زيتي
  - `scada-amber: '#A0522D'` — بني طوبي
  - `scada-red: '#B94040'` — أحمر
  - `scada-dim: '#EDE5D8'` — hover
  - `scada-text: '#2C1F10'` — بني داكن
  - `scada-muted: '#6B5440'` — بني متوسط
- Animations: `pulse-slow` (3s), `blink` (1.2s step-end)
- ملاحظة: في اختلاف بين الـ Tailwind config (ألوان بيج/بني) والـ UI الفعلي (الـ Dashboard بيستخدم أزرق غامق بدرجاته + header أحمر). الـ Tailwind colors شبه مش مستخدمة في الـ Dashboard الفعلي إلا في الكروت والـ Charts.

**`postcss.config.js`**: Tailwind + Autoprefixer

**`index.html`**:
- PWA meta tags: `apple-mobile-web-app-capable`, `theme-color: #B94040`
- Google Fonts: Orbitron, IBM Plex Sans, JetBrains Mono
- تنصيب Service Worker بعد تحميل الـ React

**`manifest.json`**:
```json
name: "Takamul SCADA"
start_url: "/Takamul/"
display: "standalone"
orientation: "portrait"
background_color: "#0A2A6E"
theme_color: "#B94040"
icons: 192px + 512px (any + maskable)
```

---

## 3. هيكل المشروع الكامل

```
Takamul/
├── .env                          # Supabase URL + Anon Key
├── .gitignore
├── index.html                    # PWA entry point
├── manifest.json                 # PWA manifest
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── DOCUMENTATION.md              # هذا الملف
├── datasheets/
│   ├── LY485 temperature and humidity sensor English description.pdf
│   ├── pressure-sensor-lft2000.pdf
│   ├── soil-sensor-jxbs-3001-npk-rs.pdf
│   └── t2000.pdf
├── public/
│   ├── bolt-logo.svg             # الشعار
│   ├── favicon.svg
│   ├── icon-192.png              # PWA icon
│   ├── icon-512.png              # PWA icon
│   ├── manifest.json
│   ├── sw.js                     # Service Worker
│   └── takamul-logo.jpeg
└── src/
    ├── main.jsx                  # Entry point
    ├── App.jsx                   # Root component + Auth routing
    ├── index.css                 # Tailwind + custom scrollbar + range input styling
    ├── pages/
    │   ├── LoginPage.jsx         # تسجيل الدخول / إنشاء حساب
    │   └── Dashboard.jsx         # الـ main app مع 9 تبويبات + drawer navigation
    ├── components/
    │   ├── SensorCard.jsx        # بطاقة عرض بيانات الحساس
    │   ├── LiveChart.jsx         # رسم بياني متحرك (AreaChart)
    │   ├── ControlPanel.jsx      # لوحة تحكم VFD (مضخة)
    │   ├── PowerStats.jsx        # إحصائيات الطاقة
    │   ├── AlertsPanel.jsx       # لوحة التنبيهات
    │   ├── DevicesPage.jsx       # إدارة الأجهزة (QR scanner, ربط, rename, حذف)
    │   ├── OtaPage.jsx           # تحديث الـ firmware عن بعد
    │   ├── NotificationsPage.jsx # صفحة الإشعارات الكاملة
    │   ├── ProfilePage.jsx       # الملف الشخصي (تعديل + تغيير كلمة السر)
    │   └── SupportPage.jsx       # صفحة الدعم الفني
    ├── hooks/
    │   ├── useAuth.jsx           # Authentication context + Provider
    │   ├── useControls.js        # VFD controls state management
    │   ├── useDevices.js         # Devices CRUD operations
    │   └── useTelemetry.js       # Sensor telemetry + realtime subscription
    └── lib/
        ├── supabase.js           # Supabase client + queries
        ├── demo.js               # Demo mode data generator
        └── thresholds.js         # Sensor definitions + configurations
```

---

## 4. Authentication System

**الملف**: `src/hooks/useAuth.jsx`

### الـ Flow:
1. `AuthProvider` يشتغل على مستوى الـ App كله
2. أول ما يتحمل، يفحص:
   - لو `DEMO_MODE = true`: يشوف لو في session مخزنة في `localStorage` (`aqua_demo_session`)
   - لو `DEMO_MODE = false`: يستخدم `supabase.auth.getSession()` ويشترك في `onAuthStateChange`
3. البيانات المتوفرة من الـ Context: `{ user, loading, error, signIn, signUp, signOut }`

### Demo Mode:
- Credentials: `admin@aquacontrol.io` / `scada2024`
- الـ Session بتتنحفظ في `localStorage` كـ JSON
- الـ signUp معطل في demo mode

### Production (Supabase Auth):
- `signInWithPassword` من Supabase
- `signUp` + upsert للـ `profiles` table لو auto-confirm شغال
- `signOut` باستخدام `supabase.auth.signOut()`
- الـ Supabase credentials جاية من `.env`:
  ```
  VITE_SUPABASE_URL=https://xfcicrtmyvpgirwvnqfh.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### App.jsx Flow:
- لو `loading`: شاشة "INITIALIZING SCADA..." مع spinner
- لو `user` موجود: يظهر `<Dashboard />`
- لو مفيش `user`: يظهر `<LoginPage />`

---

## 5. Login Page

**الملف**: `src/pages/LoginPage.jsx`

### الـ UI:
- خلفية: gradient أزرق غامق + grid pattern + scan lines effect
- كارت زجاجي (glassmorphism) بـ backdrop-filter: blur
- شعار Takamul في النص
- Mode switcher: Sign In / Register (مع أيقونات Lock / UserPlus)
- Input fields: Email + Password + Confirm Password (للتسجيل)
- Show/Hide password toggle (Eye / EyeOff)
- رسائل الخطأ بلون أحمر
- زر submit مع loading spinner

### الوظائف:
- **Sign In**: `signIn(email, password)` من useAuth
- **Sign Up**: `signUp(email, password)` + validation (password ≥ 6, confirmed)
- نجاح التسجيل: رسالة "Account Created! Check your email to confirm"
- Switch mode: بين login و signup (بيمسح البيانات)

### الـ InputField Component:
- مكون reusable: icon + label + input مع styling موحد

---

## 6. Sensor System

**الملف**: `src/lib/thresholds.js`

### الـ Sensors النشطة حالياً (5):

#### من حساس LY485 (Temp & Humidity via RS485 Modbus):
1. **LY485_TEMP** — درجة حرارة المحيط
   - الوحدة: °C
   - المدى: -40°C ~ +80°C
   - الدقة: ±0.3°C
   - Resolution: 0.1°C
   - الـ Modbus register (قراءة فقط): 0x0001 (Temperature × 10, complement لو سالب)
   - Thresholds: Warning عند 40°C, Critical عند 50°C
   - Normal range: 15°C ~ 35°C
   - أيقونة: `Thermometer`

2. **LY485_HUM** — الرطوبة النسبية
   - الوحدة: %RH
   - المدى: 0 ~ 99.9%RH
   - الدقة: ±3%RH (عند 60%RH, 25°C)
   - Resolution: 0.1%RH
   - الـ Modbus register (قراءة فقط): 0x0000 (Humidity × 10)
   - Thresholds: Warning عند 85%RH, Critical عند 95%RH
   - Normal range: 30%RH ~ 80%RH
   - أيقونة: `Droplets`

#### من حساس JXBS-3001-NPK-RS (Soil NPK via RS485 Modbus):
3. **NPK_NITROGEN** — نسبة النيتروجين في التربة
   - الوحدة: mg/kg
   - المدى: 0 ~ 1999 mg/kg
   - Resolution: 1 mg/kg
   - الـ Modbus register (قراءة فقط): 0x001E
   - Thresholds: Warning عند 1500, Critical عند 1800
   - Normal range: 100 ~ 1200 mg/kg
   - أيقونة: `Leaf`

4. **NPK_PHOSPHORUS** — نسبة الفوسفور في التربة
   - الوحدة: mg/kg
   - المدى: 0 ~ 1999 mg/kg
   - Resolution: 1 mg/kg
   - الـ Modbus register (قراءة فقط): 0x001F
   - Thresholds: Warning عند 1500, Critical عند 1800
   - Normal range: 50 ~ 1000 mg/kg
   - أيقونة: `Sprout`

5. **NPK_POTASSIUM** — نسبة البوتاسيوم في التربة
   - الوحدة: mg/kg
   - المدى: 0 ~ 1999 mg/kg
   - Resolution: 1 mg/kg
   - الـ Modbus register (قراءة فقط): 0x0020
   - Thresholds: Warning عند 1500, Critical عند 1800
   - Normal range: 80 ~ 1100 mg/kg
   - أيقونة: `Flower2`

### تعريفات الـ thresholds:
كل sensor عنده object:
```js
{
  label,           // مختصر: 'TEMP', 'HUM', 'N', 'P', 'K'
  fullLabel,       // كامل: 'Ambient Temperature', 'Relative Humidity', إلخ
  unit,            // '°C', '%RH', 'mg/kg'
  icon,            // اسم الأيقونة من Lucide
  warningThreshold,// حد التحذير
  criticalThreshold,// حد الخطر
  min, max,        // مدى القياس
  normalRange,     // [min, max] الطبيعي
  description,     // وصف مختصر
}
```

### دوال المساعدة:
- `getSensorStatus(sensorType, value)` → يرجع `'normal' | 'warning' | 'critical' | 'unknown'`
- `STATUS_COLORS` → object فيه كل الألوان لكل حالة

---

## 7. SensorCard Component

**الملف**: `src/components/SensorCard.jsx`

بطاقة عرض بيانات الحساس الواحد. بتستقبل `sensorType` و `data`.

### العناصر:
1. **Header**: أيقونة الحساس (في مربع بخلفية ملونة حسب الحالة) + الـ label + الوصف
2. **Status badge**: badge صغير ملون بيظهر الحالة (NORMAL / WARNING / CRITICAL) مع أيقونة `AlertTriangle` أو `CheckCircle`
3. **Value**: الرقم الكبير + الوحدة. لو القيمة null بيظهر "—"
4. **Full label**: تحت الرقم
5. **Range bar**:
   - شريط خلفية
   - Normal zone (خضراء) حسب `normalRange`
   - Value indicator (يتحرك مع القيمة، لونه أخضر/أصفر/أحمر حسب الحالة)
   - Tick marks: min | normal range | max
6. **Critical alerts** (رسائل خاصة حسب نوع الحساس):
   - LY485_TEMP critical: "CRITICAL TEMPERATURE — CHECK ENVIRONMENT"
   - LY485_HUM critical: "CRITICAL HUMIDITY — CONDENSATION RISK"
   - NPK_* critical: "NPK LEVEL CRITICAL — CHECK SOIL CONDITIONS"
7. **Timestamp**: وقت آخر قراءة

### التنسيق:
- بطاقة بخلفية `scada-panel` (#FBF7EF) مع border حسب الحالة
- Glow effect للحالات الحرجة
- `animate-pulse-slow` للـ border لو critical
- Corner decoration (دائرة خلفية شفافة)
- متجاوب مع grid: 1 عمود mobile → 5 أعمدة desktop

---

## 8. Telemetry Data Flow

**الملف**: `src/hooks/useTelemetry.js`

### المسؤولية:
جب أحدث قراءات الـ sensors وتاريخها والاشتراك في التحديثات الحية.

### الـ State:
```js
latest: {}  // { LY485_TEMP: {...}, LY485_HUM: {...}, ... }
history: { LY485_TEMP: [], LY485_HUM: [] }
connected: boolean
```

### الـ Flow:

#### Demo Mode (`DEMO_MODE = true`):
1. `getDemoHistory` لـ LY485_TEMP و LY485_HUM (50 نقطة)
2. `getDemoSensorData` للقراءات الحية
3. Interval كل **5 ثوانٍ**:
   - يحدث `latest` ببيانات عشوائية مع انحراف طفيف
   - يضيف نقطة جديدة للـ history
4. `connected` دايماً `true`

#### Production Mode (`DEMO_MODE = false`):
1. ينتظر تحميل الـ devices من `useDevices`
2. لو مفيش devices: يضبط empty state (setLatest({}), history فاضي, connected = false)
3. لو في devices:
   - `fetchLatestTelemetry(deviceIds)` → يجيب آخر قراءة لكل sensor
   - `fetchTelemetryHistory('LY485_TEMP', 50, deviceIds)` + `fetchTelemetryHistory('LY485_HUM', 50, deviceIds)` → تاريخ الـ 50 قراءة الأخيرة
4. يشترك في **Realtime channel** `telemetry-live`:
   - `postgres_changes` event: INSERT على `telemetry` table
   - فلترة client-side: يقبل بس الـ rows اللي `device_id` بتاعها من devices بتاعة المستخدم
   - يحدث `latest` و `appendHistory`

### `appendHistory`:
- بيضيف القراءة الجديدة للـ history array
- يحافظ على آخر `HISTORY_MAX = 60` نقطة
- بيدعم بس sensor types: `LY485_TEMP` و `LY485_HUM`

### الـ Return:
```js
{ latest, history, connected, hasDevices }
```

---

## 9. Supabase Database Layer

**الملف**: `src/lib/supabase.js`

### الـ Client:
```js
supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
})
```

### دوال الـ Telemetry:

**`fetchLatestTelemetry(deviceIds)`**:
- يجيب آخر قراءة لكل sensor (LY485_TEMP, LY485_HUM, NPK_NITROGEN, NPK_PHOSPHORUS, NPK_POTASSIUM)
- بيعمل `.order('created_at', { ascending: false }).limit(1).single()` لكل sensor
- بيفلتر بـ `.in('device_id', deviceIds)` لو في devices
- لو مفيش devices → بيـ `continue` (مش بيعمل query)

**`fetchTelemetryHistory(sensorType, limit, deviceIds)`**:
- بيجيب آخر `limit` قراءة من `telemetry` table
- بترتيب تنازلي وبعدين عكسه (عشان يكون من الأقدم للأحدث)
- لو مفيش devices → يرجع array فاضي

### دوال الـ Controls:

**`fetchControlState(deviceIds)`**:
- بيجيب أخر control state من `controls` table
- بيستخدم `.order('updated_at', { ascending: false }).limit(1).single()`
- لو مفيش result: يرجع default values `{ pump_speed: 0, status: false, target_pressure: 3.5, ota_esp32_url: null, ota_stm32_url: null }`

**`updateControlState(payload, deviceId)`**:
- بيجيب الـ current control state
- بيزود `{ force_wakeup: true, updated_at: new Date().toISOString() }` على الـ payload
  - `force_wakeup` ده اختراع ذكي: بيخلّي الـ ESP32 يفيق من الـ sleep أسرع (خلال 30 ثانية بدل 5 دقائق)
  - الـ ESP32 لما يصحى ويعمل poll ويشوف `force_wakeup=true` → يضبط الـ sleep timer على 30s بس
  - بعد أول wakeup، يرجع `force_wakeup` لـ `false` والـ sleep timer يرجع طبيعي 5 دقائق
- لو في `current.id` (record موجود): UPDATE
- لو ﻻ: INSERT

### الـ Database Tables المتوقعة:
| Table | Key Fields | Usage |
|-------|-----------|-------|
| `telemetry` | `id, device_id, sensor_type, value, unit, created_at` | قراءات الحساسات |
| `controls` | `id, device_id, pump_speed, status, target_pressure, force_wakeup, ota_esp32_url, ota_stm32_url, updated_at` | أوامر التحكم + OTA |
| `devices` | `device_id, user_id, name, claimed_at` | ربط الأجهزة |
| `profiles` | `id, email, full_name, username, phone, avatar_url, created_at, updated_at` | الملف الشخصي |
| `auth.users` | (Supabase built-in) | المصادقة |

---

## 10. Demo Data Generator

**الملف**: `src/lib/demo.js`

### `DEMO_MODE = false` (حالياً شغال على Supabase حقيقي)

### الـ Internal State:
```js
{
  ly485Temp: 28.6,
  ly485Hum: 62.3,
  npkN: 320,
  npkP: 180,
  npkK: 450,
  pumpOn: true,
  pumpSpeed: 48,
  targetPressure: 4.0,
}
```

### `getDemoSensorData()`:
- يزحزح كل قيمة شويه عشوائياً
- يرجع object بالـ 5 سنسورات:
```js
{
  LY485_TEMP: { sensor_type, value, unit: '°C', created_at },
  LY485_HUM: { sensor_type, value, unit: '%RH', created_at },
  NPK_NITROGEN: { sensor_type, value, unit: 'mg/kg', created_at },
  NPK_PHOSPHORUS: { sensor_type, value, unit: 'mg/kg', created_at },
  NPK_POTASSIUM: { sensor_type, value, unit: 'mg/kg', created_at },
}
```

### `getDemoControlState()`:
- يرجع `{ pump_speed, status, target_pressure }`

### `setDemoControl(payload)`:
- يحدث الـ internal state
- يدعم: `status`, `pump_speed`, `target_pressure`
- يرجع الـ state الجديد

### `getDemoHistory(sensorKey, points = 50)`:
- يولد 50 نقطة تاريخية (كل 6 ثواني) بقيم عشوائية
- لـ LY485_TEMP: تبدأ من 28°C، تتزحزح ±0.5
- لـ LY485_HUM: تبدأ من 60%RH، تتزحزح ±0.5
- يستخدم `clamp` عشان القيم متخرجش عن النطاق

---

## 11. VFD Control System

**الملفات**: `src/hooks/useControls.js` + `src/components/ControlPanel.jsx`

### `useControls()` Hook:
- يستخدم `useDevices` عشان يجيب الـ devices المرتبطة
- يجيب أول device_id كـ `primaryId`
- يجيب الـ control state من Supabase/demo
- يشترك في Realtime channel `controls-live-*` عشان يسمع التحديثات من devices تانية (أو من ESP32 لما يقرا الأمر)
- `applyControl(payload)`: بيكتب أمر جديد للـ controls table

### ControlPanel Component:

**Pump Status Card**:
- زر دائري كبير: RUNNING (أخضر) / STOPPED (داكن)
- Pulse animation على النقطة الخضرا
- شريط تحتها بيوضح الـ frequency %
- Glow effect أخضر لما الموتور شغال

**VFD Frequency Control**:
- عرض التردد الحالي (0-50 Hz)
- عرض السرعة بـ % (freqPct)
- **Slider**: range input من 0 لـ 50 Hz بخطوة 0.5
  - مخصص (custom styled) في `index.css`: thumb أزرق متوهج
  - معطل لو الـ pump مش شغال
  - Tick marks: 0, 10, 20, 30, 40, 50
- **Manual input**:
  - Increment/decrement buttons (±0.5)
  - Number input (min 0, max 50, step 0.5)
  - APPLY button (معطل لو updating أو pump مش شغال)

**Target Pressure Setpoint**:
- Increment/decrement buttons (±0.1 bar)
- Number input (0.5 – 8.0 bar)
- SET SP button
- Note: Setpoint range 0.5 – 8.0 bar · Closed-loop PID via VFD

**Emergency Stop & Reset**:
- زر واحد: يرسل `{ status: false, pump_speed: 0, target_pressure: 3.5 }`
- يعيد ضبط المصنع

**Error Display**:
- لو في error، يظهر banner أحمر في أول الـ panel

**Lock Indicator**:
- بيظهر email المستخدم الحالي كـ "ADMIN" في شريط

---

## 12. Device Management

**الملفات**: `src/hooks/useDevices.js` + `src/components/DevicesPage.jsx`

### `useDevices()` Hook:
**الـ State**: `{ devices, loading, error }`

**الوظائف**:
- **`fetchDevices()`**: بيجيب كل devices المستخدم من Supabase (`devices` table, filter بـ `user_id`)
- **`claimDevice(deviceId, name)`**:
  1. يتحقق لو الـ device مأخوذ من مستخدم تاني
  2. Upsert في `devices` table (عشان لو device_id موجود بس user مختلف → error)
  3. يحدث الـ local state
- **`removeDevice(deviceId)`**: DELETE من `devices` table + فلترة local state
- **`renameDevice(deviceId, newName)`**: UPDATE الـ name + تحديث local state

### DevicesPage Component:

**في Demo Mode**:
- رسالة: "Device pairing is disabled in demo mode"
- مجرد أيقونة Cpu + نص

**في Production**:
- Header: عدد devices + "ADD DEVICE" زر
- Success message (يختفي بعد 4 ثواني)
- Error banner
- Empty state: أيقونة Cpu + "NO DEVICES LINKED" + "ADD FIRST DEVICE" زر
- قايمة الـ Device Cards

### QR Scanner (`QRScanner` component):
- بيستخدم `jsQR` لقراءة QR code من الكاميرا
- يستخدم `getUserMedia` بـ `facingMode: 'environment'` (الكاميرا الخلفية)
- Canvas مخفي للـ image processing
- Animation: scan line بتتحرك فوق مربع المسح
- حالات: starting (spinner), scanning (overlay مع corner brackets), error (لو camera مرفوضة)

### Add Device Modal:
- خطوتين: Scan QR code OR manual entry
- Device ID input (placeholder: "e.g. AA:BB:CC:DD:EE:FF")
- Device Name input (optional)
- LINK DEVICE button بلون أحمر (#B94040)

### Device Card:
- أيقونة Cpu في مربع أحمر
- Device name (editable inline)
- تاريخ الربط
- Device ID (monospace, break-all)
- أزرار: Edit (Pencil), Delete (Trash2) مع تأكيد الحذف
- Confirm remove: "Click again to confirm"

---

## 13. OTA Firmware Update

**الملف**: `src/components/OtaPage.jsx`

### OTA أي **Over-The-Air** تحديث الـ firmware عن بعد

### الـ UI:
- **Safety warning** banner أصفر: "OTA updates will reboot the target device"
- **ESP32-S3 target card**: أيقونة Wifi، عنوان "ESP32-S3 FIRMWARE"، وصف "Wi-Fi · Supabase · UART Bridge"
- **STM32F401 target card**: أيقونة Cpu، عنوان "STM32F401 FIRMWARE"، وصف "Sensors · Modbus · VFD Control"
- **How It Works**: collapsible section بـ 6 خطوات + warning

### كل OtaTarget:
1. URL input (https://...firmware.bin)
2. SEND OTA button
3. States:
   - `idle`: زر "SEND OTA"
   - `pending`: زر "QUEUING…" مع أيقونة Clock
   - `ok`: زر "SENT ✓" مع أيقونة CheckCircle2 + رسالة خضرا "OTA command queued — device will update on next poll (≈5 s)" (يختفي بعد 10 ثواني)
   - `error`: رسالة خطأ حمرا + زر Reset
4. Validation:
   - Must not be empty
   - Must start with `https://`
   - Must end with `.bin`

### آلية العمل (من How It Works):
1. تلصق رابط .bin المباشر (مثلاً من GitHub Release)
2. تضغط SEND OTA → الرابط بيتكتب في `controls` table في Supabase
3. ESP32 يقراه في poll cycle الجاي (خلال 5 ثواني)
4. ESP32 OTA: يحمل الـ binary عبر HTTPS وي reboot على الـ firmware الجديد
5. STM32 OTA: ESP32 يحمل الـ .bin وبعدين يبرمج STM32 عن طريق UART bootloader
6. النظام يكمل شغله تلقائياً

### ملاحظات:
- الرابط لازم يكون publicly accessible (مش محتاج authentication)
- GitHub Releases direct asset links تشتغل perfect
- الـ OTA command بيتكتب في `controls` table بحقل `ota_esp32_url` أو `ota_stm32_url`
- بيستخدم `applyControl` من `useControls` Hook

---

## 14. Energy Tracking

**الملف**: `src/components/PowerStats.jsx`

### الـ Logic:
```js
const MOTOR_RATED_KW = 45    // قدرة الموتور بالـ kW
const VFD_MAX_HZ     = 50    // أقصى تردد للـ VFD
const EFFICIENCY     = 0.92  // كفاءة الموتور + الـ VFD

// Affinity Law: P = P_rated × (Hz/Hz_max)³ ÷ η
function calcPowerKW(hz) { ... }
```
قانون التقارب: القدرة بتتغير بمكعب التردد (P ∝ f³)

### الـ UI:

**Live Power Draw Card**:
- عرض "LIVE POWER DRAW"
- Badge: RUNNING (أصفر) / IDLE (داكن)
- الرقم: XX.X kW (أصفر)
- Hz · % speed · % load
- Progress bar: نسبة من الـ rated power
- "XX kW rated"

**Stats List** (5 entries):
1. PAST HOUR — kWh (أزرق)
2. TODAY — kWh (أخضر)
3. THIS WEEK — kWh (أصفر)
4. THIS MONTH — kWh (برتقالي)
5. THIS YEAR — kWh (أحمر)

كل entry فيها: أيقونة + label + قيمة + unit

**12-Hour Bar Chart**:
- 12 بار يمثل آخر 12 ساعة
- قيمة متغيرة عشوائياً (pump on: 0.8-1.2 × kwhPerHour, pump off: 0-0.2 × kwhPerHour)
- Current hour باللون الأصفر، الباقي أزرق غامق
- Recharts BarChart + CustomTooltip

---

## 15. Notifications & Alerts

**الملفات**: `src/components/AlertsPanel.jsx` + `src/components/NotificationsPage.jsx`

### `AlertsPanel.jsx`:
- **`getAlerts(latest)`**: يبني array من التنبيهات من الـ latest readings
  - لكل sensor لو status = warning أو critical → يضيف alert
  - لكل sensor رسائل مخصصة:
    - LY485_TEMP: "Temperature elevated" / "CRITICAL TEMPERATURE — risk of equipment damage"
    - LY485_HUM: "Humidity above normal range" / "CRITICAL HUMIDITY — condensation risk"
    - NPK_NITROGEN: "Nitrogen level elevated" / "CRITICAL NITROGEN — excessive fertilization"
    - NPK_PHOSPHORUS: "Phosphorus level elevated" / "CRITICAL PHOSPHORUS — environmental risk"
    - NPK_POTASSIUM: "Potassium level elevated" / "CRITICAL POTASSIUM — check soil conditions"
  - الترتيب: critical الأول

- Normal state: "ALL SYSTEMS NORMAL" مع أيقونة CheckCircle خضرا
- Alert state: Header مع عدّاد (CRITICAL + WARN badges) + قايمة قابلة للـ scroll

### `NotificationsPage.jsx`:
- **`buildSensorAlerts(latest)`**: نفس فكرة AlertsPanel
- **`buildMotorAlerts(controls, prevControls)`**: يرصد تغيير حالة المضخة (on → off, off → on)
  - كل تغيير بيعمل event object مع category: 'motor', status: 'info'/'warning'
- **`getNotifCount(latest)`**: بتتحسب عدد التنبيهات النشطة (للبadge في الـ Drawer sidebar)

**الـ UI**:
- Header summary bar: "NOTIFICATION CENTER" + badges
- AlertsPanel widget (full)
- "LIVE SENSOR ALERTS" section
- "MOTOR / PUMP EVENTS" section مع Clear button
- Empty state: "ALL SYSTEMS NORMAL" مع أيقونة BellOff

**Motor Event Tracking**:
- `useRef(prevControls)` عشان يقارن الحالة القديمة بالجديدة
- يحتفظ بآخر 50 motor event
- Dismiss فردي (Trash2) أو جماعي (Clear)
- localStorage مش مستخدم — الـ dismissed events في Set في الـ state فقط

**NotifCard Component**:
- أيقونة حسب الـ category (sensor vs motor)
- Status badge: CRITICAL (أحمر) / WARNING (أصفر) / INFO (أزرق)
- تنسيق كامل: label + message + value + time + dismiss button

---

## 16. Profile Page

**الملف**: `src/components/ProfilePage.jsx`

### الـ UI:
- **Avatar Section**:
  - دائرة 96px مع border
  - يعرض الصورة أو initials (أول حرفين من الاسم)
  - Camera button عشان يغير الصورة
  - File input (accept: image/*, max: 2MB)

- **Profile Form** (grid 2 columns):
  - Full Name
  - Username
  - Phone Number (tel)
  - Email (disabled, readonly)
  - كل field مع أيقونة

- **Save Button** (أحمر #B94040)

- **Change Password (Collapsible)**:
  - زر "CHANGE PASSWORD" مع أيقونة Lock وشيفرون
  - New Password + Confirm Password مع show/hide
  - UPDATE PASSWORD button

### الـ Logic:
1. **On mount**:
   - يحمل من `user.user_metadata` (سريع)
   - بعدها يحمل من `profiles` table في Supabase (المصدر الرسمي)
2. **Save Profile**:
   - لو في صورة جديدة: يرفعها لـ Supabase Storage (`profiles` bucket, path: `avatars/{user.id}.{ext}`)
   - يحدث `supabase.auth.updateUser()` (الـ metadata)
   - Upsert في `profiles` table
3. **Change Password**:
   - `supabase.auth.updateUser({ password })`
   - Validation: 6 characters minimum + match confirmation

### Demo Mode:
- في demo mode، كل العمليات simulated (بـ setTimeout) ومش بتتكتب في Supabase

---

## 17. Charts System

**الملف**: `src/components/LiveChart.jsx`

### التقنية:
- Recharts: `ResponsiveContainer` + `AreaChart` + `Area` + `XAxis` + `YAxis` + `CartesianGrid` + `Tooltip` + `ReferenceLine`

### الألوان:
```js
LY485_TEMP: { stroke: '#FF6B35', fill: '#FF6B35' }  // برتقالي
LY485_HUM:  { stroke: '#00D4FF', fill: '#00D4FF' }  // أزرق سماوي
```

### الميزات:
- Gradient fill تحت الخط (من لون الـ stroke لـ transparent)
- Reference lines للـ warning و critical thresholds
- Custom tooltip (بخلفية داكنة)
- Domain مظبوط على [min, max] بتاع كل sensor
- Animation معطل (isAnimationActive={false}) عشان realtime performance
- تنسيق الوقت: HH:MM:SS

### العرض:
- في Dashboard تحت تبويب "Trend Analysis"
- شبكة 2 columns: Temperature (برتقالي) + Humidity (أزرق)
- كل رسمة: 180px ارتفاع + title + subtitle + LIVE badge

---

## 18. Dashboard Layout

**الملف**: `src/pages/Dashboard.jsx`

### الـ Tabs (9 تبويبات):
| id | label | أيقونة |
|----|-------|--------|
| sensors | Sensor Overview | LayoutDashboard |
| charts | Trend Analysis | LineChart |
| control | VFD Control Panel | Settings |
| energy | Energy Tracking | Zap |
| devices | My Devices | Cpu |
| ota | Firmware Update | Upload |
| notifications | Notifications | Bell |
| support | Support | HeadphonesIcon |
| profile | Profile | User |

### الـ Navigation:
**Desktop**: Tap-based tabs مع switch animation (fade + translateY)
**Mobile**: Drawer (hamberger menu) يظهر من الشمال

### الـ Drawer:
- خلفية: gradient أزرق غامق (#0d1b3e → #0a1f4a)
- عرض 248px
- كل tab فيها hover effect + active indicator (red border-left + background)
- Notification badge (عدد التنبيهات) جنب Alerts tab
- Sign Out في الآخر
- Transition متحركة لكل item (تأخير تصاعدي حسب الـ index)
- Overlay شفاف يطفي المحتوى وراه

### الـ Background:
- Gradient أزرق ثابت في الخلف
- Radial glow في النص
- Grid pattern (52px squares, خطوط زرقا شفافة)
- `AutomationBg` SVG: circuit board pattern (خطوط متقطعة + نقاط)

### الـ SectionHeader Component:
- عنوان + subtitle تحت
- خط فاصل تحتيهم

### NoDevicesBanner Component:
- يظهر في أي تبويب محتاج devices لو مفيش devices
- أيقونة 🔌
- "NO DEVICE LINKED"
- "+ ADD DEVICE" زر يحول على تبويب Devices

### الـ Top Bar:
- أحمر (#B94040)
- Hamburger menu (يسار)
- Logo + "TAKAMUL — SMART SOLUTION"
- Connection indicator (نقطة خضرا/رمادية)
- User email badge
- Sign out button

### Transition System:
- `transitioning` state
- 180ms switch delay
- فكرة ذكية: `requestAnimationFrame` مزدوج عشان الـ transition تشتغل مرة واحدة

---

## 19. Service Worker & PWA

### `public/sw.js`:
- Service Worker للتشغيل الـ offline
- يسجل في `main.jsx` بعد تحميل الصفحة:
```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Takamul/sw.js')
  })
}
```
- المسار `/Takamul/` (GitHub Pages base path)

### PWA Support:
- `manifest.json`: name, icons (192+512), display standalone, portrait orientation
- iOS: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent`
- Theme color: `#B94040`
- Background color: `#0A2A6E`

---

## 20. UI Components & Patterns الموحدة

| Component | الملف | الوظيفة |
|-----------|-------|---------|
| `Field` | ProfilePage.jsx | Label + icon + input موحد |
| `StatusMsg` | ProfilePage.jsx | Green (success) / Red (error) messages |
| `Card` | OtaPage.jsx | بطاقة بشفافية + border radius |
| `StatusBadge` | OtaPage.jsx | IDLE / QUEUING / SENT / ERROR |
| `InputField` | LoginPage.jsx | أيقونة في الـ input + label |
| `SectionHeader` | Dashboard.jsx | عنوان + subtitle + border |
| `NoDevicesBanner` | Dashboard.jsx + OtaPage.jsx | رسالة "لا يوجد جهاز" + زر |
| `CustomTooltip` | LiveChart.jsx + PowerStats.jsx | Tooltip بتنسيق SCADA |
| `ContactCard` | SupportPage.jsx | بطاقة اتصال مع hover lift + glow |

---

## 21. Support Page

**الملف**: `src/components/SupportPage.jsx`

### Contact Info:
- Email: `team.takamul.eg@gmail.com`
- العنوان: "Takamul Smart Solutions · Egypt · Industrial Automation"

### الـ UI:
- Hero card: gradient أحمر/أزرق مع decorative rings + أيقونة MessageCircle + "TAKAMUL SUPPORT" + description
- Contact methods (3 cards):
  1. **Email Support**: `team.takamul.eg@gmail.com` — "Send Email"
  2. **Quick Report**: pre-filled bug report mailto link — "Report Bug"
  3. **Company**: "Takamul Smart Solutions · Egypt · Industrial Automation" — "Contact"
- Footer: "© 2025 TAKAMUL SMART SOLUTIONS · EGYPT"

### Bug Report Link:
```js
`mailto:${CONTACT_EMAIL}?subject=Bug%20Report%20...&body=Device%3A%0AIssue%3A%0ASteps...`
```

---

## 22. Alerts & Thresholds System كاملة

### لكل Sensor:
```js
{
  warningThreshold,  // أول حد ينبه عنده
  criticalThreshold, // الحد الحرج
  min, max,         // مدى القياس
  normalRange,      // [min_max] الطبيعي
}
```

### `getSensorStatus`:
- `value >= criticalThreshold` → `'critical'`
- `value >= warningThreshold` → `'warning'`
- غير كدا → `'normal'`
- لو value null/undefined → `'unknown'`

### `STATUS_COLORS`:
```js
normal:   { text: green, border: green/40, bg: green/10, glow }
warning:  { text: amber, border: amber/40, bg: amber/10, glow }
critical: { text: red,   border: red/50,   bg: red/10,   glow }
unknown:  { text: muted, border: muted/30, bg: dim/20,   glow: none }
```

### Alert Messages (3 مستويات لكل sensor):
- لكل sensor رسالتين: warning + critical
- بتظهر في AlertsPanel و NotificationsPage و SensorCard (critical بس)

---

## 23. الـ CSS

**الملف**: `src/index.css`

- Tailwind base/components/utilities
- `box-sizing: border-box` على كل العناصر
- Custom scrollbar (داكن × 4px)
- Range input styling (WebKit):
  - Thumb: 18px دائرة زرقا (#00D4FF) مع glow + hover scale
  - Disabled: رمادي غامق
- Hide number input arrows (webkit)
- Glow utility classes: `glow-accent`, `glow-green`, `glow-red`

---

## 24. Realtime Channels في Supabase

| Channel Name | Event | Table | الغرض |
|-------------|-------|-------|-------|
| `telemetry-live` | INSERT | `telemetry` | استقبال قراءات الحساسات الحية |
| `controls-live-{random}` | ALL | `controls` | سماع تحديثات التحكم |

---

## 25. Datasheets المرفوعة

| الملف | الجهاز | البروتوكول |
|-------|--------|-----------|
| `LY485 temperature and humidity sensor English description.pdf` | LY485 Temp & Humidity | Modbus RTU RS485 |
| `soil-sensor-jxbs-3001-npk-rs.pdf` | JXBS-3001-NPK-RS Soil NPK | Modbus RTU RS485 |
| `pressure-sensor-lft2000.pdf` | Pressure sensor LFT2000 | — |
| `t2000.pdf` | T2000 | — |

### LY485 Wiring:
| اللون | الوظيفة |
|-------|---------|
| أحمر (Red) | + (5~30V DC) |
| أسود (Black) | GND |
| أصفر (Yellow) | 485-A |
| أخضر (Green) | 485-B |

### LY485 Registers (قراءة فقط):
| الـ Register | القيمة |
|-------------|--------|
| 0x0000 | Humidity (القيمة الفعلية × 10) |
| 0x0001 | Temperature (القيمة الفعلية × 10, complement لو سالب) |

### JXBS-3001-NPK-RS Wiring:
| اللون | الوظيفة |
|-------|---------|
| بني (Brown) | Power + |
| أسود (Black) | Power - |
| أصفر/رمادي (Yellow/Grey) | 485-A |
| أزرق (Blue) | 485-B |

### JXBS-3001-NPK-RS Registers (قراءة فقط):
| الـ Register | المحتوى |
|-------------|---------|
| 0x001E | Nitrogen (mg/kg) |
| 0x001F | Phosphorus (mg/kg) |
| 0x0020 | Potassium (mg/kg) |

---

## 26. ملاحظات عامة و Architectural Decisions

1. **ليش Supabase مش backend custom?** — أسرع في التطوير، realtime built-in، ما فيش حاجة لإدارة سيرفر
2. **ليش `force_wakeup`?** — الـ ESP32 بيعمل sleep فترات طويلة (5 دقائق) عشان يحافظ على البطارية. الـ `force_wakeup` بيخلّي أول أمر يوصله يضبط الـ sleep timer على 30 ثانية بس، فالأوامر اللاحقة بتنفذ أسرع
3. **ليش الـ switch animation 180ms?** — عشان يعطي user feedback سلس ومريح، بدون ما يكون بطيء
4. **المشكلة المعمارية**: الـ Tailwind config فيه custom colors بألوان بيج/بني، بس الـ Dashboard الفعلي بيستخدم inline styles بألوان زرقا/حمرا. الـ Tailwind colors مش مستخدمة إلا في الكروت والـ components الداخلية (SensorCard, ControlPanel, إلخ)
5. **التوافق مع الهاردوير**: الـ ESP32-S3 هو الـ bridge بين الإنترنت (Wi-Fi + Supabase) والـ STM32F401 (عبر UART). الـ STM32 هو المسؤول عن قراءة الحساسات (RS485 Modbus) والتحكم في الـ VFD
6. **دقة الـ DEMO_MODE**: `DEMO_MODE = false` حالياً، يعني المشروع مربوط بـ Supabase حقيقي
7. **الـ PWA**: المشروع كامل قابل للـ install على الموبايل، مع service worker و splash screen وأيقونات
