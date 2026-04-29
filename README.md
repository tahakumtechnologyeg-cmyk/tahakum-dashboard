# 💧 AquaControl SCADA — Water Treatment Monitor & Control System

A professional Industrial SCADA dashboard for real-time water treatment monitoring and VFD pump control, built with **React + Vite + Supabase** and deployable to **GitHub Pages**.

## 🏭 Hardware Integration
- **ESP32-S3** — WiFi connectivity, Supabase REST API bridge
- **STM32** — Real-time ADC, PT100 (SPI), Modbus RTU → VFD
- **Sensors**: TDS, PT100 Temperature, Flow Rate, Line Pressure, Differential Pressure
- **Actuators**: VFD-controlled water pump (0–50 Hz)

## ⚡ Quick Start (Demo Mode)

```bash
npm install
npm run dev
```

Login with: `admin@aquacontrol.io` / `scada2024`

> Demo mode streams realistic synthetic sensor data — no Supabase required.

## 🔌 Connect to Supabase

### 1. Create Supabase project at [supabase.com](https://supabase.com)

### 2. Run SQL Schema (Supabase SQL Editor)

```sql
-- Telemetry table
CREATE TABLE public.telemetry (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz DEFAULT now() NOT NULL,
  sensor_type text NOT NULL CHECK (sensor_type IN (
    'TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE'
  )),
  value       numeric(12, 4) NOT NULL,
  unit        text NOT NULL
);
CREATE INDEX idx_telemetry_sensor_time ON telemetry(sensor_type, created_at DESC);
ALTER TABLE public.telemetry REPLICA IDENTITY FULL;

-- Controls table
CREATE TABLE public.controls (
  id               bigserial PRIMARY KEY,
  updated_at       timestamptz DEFAULT now() NOT NULL,
  pump_speed       numeric(5,1) DEFAULT 0 NOT NULL,
  status           boolean DEFAULT false NOT NULL,
  target_pressure  numeric(5,2) DEFAULT 3.5 NOT NULL
);
ALTER TABLE public.controls REPLICA IDENTITY FULL;

INSERT INTO public.controls (pump_speed, status, target_pressure) VALUES (0, false, 3.5);

-- Enable RLS
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon insert telemetry" ON public.telemetry FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read telemetry"   ON public.telemetry FOR SELECT TO anon USING (true);
CREATE POLICY "anon read controls"    ON public.controls  FOR SELECT TO anon USING (true);
CREATE POLICY "auth manage controls"  ON public.controls  FOR ALL    TO authenticated USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry;
ALTER PUBLICATION supabase_realtime ADD TABLE public.controls;
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase URL and anon key
```

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Disable Demo Mode

In `src/lib/demo.js`:
```js
export const DEMO_MODE = false
```

## 🌐 Deploy to GitHub Pages

### Automatic (GitHub Actions)

1. Push to `main` branch
2. Go to **Settings → Pages → Source: GitHub Actions**
3. Add secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Manual

```bash
npm run build
npx gh-pages -d dist
```

## 🔧 ESP32-S3 REST API

### POST Sensor Data
```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/telemetry' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"sensor_type": "PRESSURE", "value": 3.82, "unit": "bar"}'
```

### GET VFD Control State
```bash
curl 'https://YOUR_PROJECT.supabase.co/rest/v1/controls?select=*&order=updated_at.desc&limit=1' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

## 🚨 Alert Thresholds

| Sensor | Warning | Critical | Action |
|--------|---------|----------|--------|
| TDS | 500 ppm | 700 ppm | Check RO membrane / source |
| Temperature | 35°C | 40°C | Check heat exchanger |
| Flow | 100 L/min | 115 L/min | Check valve positions |
| Pressure | 6.0 bar | 7.0 bar | Overpressure risk |
| ΔP (Filter) | 0.8 bar | 1.0 bar | **Filter clogging** |

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Supabase (PostgreSQL + Realtime + Auth)
- **Fonts**: Orbitron (display), IBM Plex Sans (body), JetBrains Mono (data)
- **Hosting**: GitHub Pages

## 📁 Project Structure

```
src/
├── components/
│   ├── SensorCard.jsx       # Individual sensor display with alerts
│   ├── LiveChart.jsx        # Recharts area chart with thresholds
│   ├── ControlPanel.jsx     # VFD controls (pump on/off, freq, pressure SP)
│   ├── AlertsPanel.jsx      # Active system alerts
│   └── IntegrationGuide.jsx # ESP32 + SQL setup guide
├── hooks/
│   ├── useAuth.jsx          # Authentication context
│   ├── useTelemetry.js      # Real-time sensor data hook
│   └── useControls.js       # VFD controls hook
├── lib/
│   ├── supabase.js          # Supabase client + data functions
│   ├── demo.js              # Demo mode synthetic data generator
│   └── thresholds.js        # Alert thresholds + sensor config
└── pages/
    ├── LoginPage.jsx        # Admin authentication
    └── Dashboard.jsx        # Main SCADA dashboard
```
