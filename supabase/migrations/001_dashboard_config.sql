-- Dashboard custom sensors & outputs tables
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/xfcicrtmyvpgirwvnqfh/sql/new)

CREATE TABLE IF NOT EXISTS dashboard_sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '-',
  range_min REAL NOT NULL DEFAULT 0,
  range_max REAL NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dashboard_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  output_type TEXT NOT NULL DEFAULT 'relay',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE dashboard_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_outputs ENABLE ROW LEVEL SECURITY;

-- RLS policies: each user can only see/manage their own
CREATE POLICY "Users can view their own sensors"
  ON dashboard_sensors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sensors"
  ON dashboard_sensors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sensors"
  ON dashboard_sensors FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own outputs"
  ON dashboard_outputs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outputs"
  ON dashboard_outputs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outputs"
  ON dashboard_outputs FOR DELETE
  USING (auth.uid() = user_id);
