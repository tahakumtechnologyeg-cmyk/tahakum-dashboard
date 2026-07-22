-- ============================================================
-- Complete Supabase schema for Tahakum Dashboard
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ikifunpftkjbvqihnmti/sql/new
-- ============================================================

-- 1. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  username TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. devices
CREATE TABLE IF NOT EXISTS devices (
  device_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL DEFAULT '',
  claimed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own devices"
  ON devices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
  ON devices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
  ON devices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
  ON devices FOR DELETE
  USING (auth.uid() = user_id);

-- 3. controls
CREATE TABLE IF NOT EXISTS controls (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  updated_at TIMESTAMPTZ DEFAULT now(),
  pump_speed REAL DEFAULT 0,
  status BOOLEAN DEFAULT false,
  target_pressure REAL DEFAULT 0,
  device_id TEXT REFERENCES devices(device_id) ON DELETE SET NULL,
  ota_esp32_url TEXT,
  ota_stm32_url TEXT,
  force_wakeup BOOLEAN DEFAULT false
);

ALTER TABLE controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view controls of their devices"
  ON controls FOR SELECT
  USING (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert controls for their devices"
  ON controls FOR INSERT
  WITH CHECK (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update controls of their devices"
  ON controls FOR UPDATE
  USING (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  )
  WITH CHECK (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete controls of their devices"
  ON controls FOR DELETE
  USING (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

-- 4. telemetry
CREATE TABLE IF NOT EXISTS telemetry (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT now(),
  sensor_type TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  device_id TEXT REFERENCES devices(device_id) ON DELETE CASCADE
);

ALTER TABLE telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view telemetry of their devices"
  ON telemetry FOR SELECT
  USING (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert telemetry for their devices"
  ON telemetry FOR INSERT
  WITH CHECK (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete telemetry of their devices"
  ON telemetry FOR DELETE
  USING (
    device_id IN (SELECT device_id FROM devices WHERE user_id = auth.uid())
  );

-- 5. dashboard_sensors
CREATE TABLE IF NOT EXISTS dashboard_sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '-',
  range_min REAL NOT NULL DEFAULT 0,
  range_max REAL NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dashboard_sensors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sensors"
  ON dashboard_sensors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sensors"
  ON dashboard_sensors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sensors"
  ON dashboard_sensors FOR DELETE
  USING (auth.uid() = user_id);

-- 6. dashboard_outputs
CREATE TABLE IF NOT EXISTS dashboard_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  output_type TEXT NOT NULL DEFAULT 'relay',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dashboard_outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outputs"
  ON dashboard_outputs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outputs"
  ON dashboard_outputs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outputs"
  ON dashboard_outputs FOR DELETE
  USING (auth.uid() = user_id);
