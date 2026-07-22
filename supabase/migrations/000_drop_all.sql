-- ============================================================
-- Step 1: Drop all existing tables (clean slate)
-- Run this FIRST in SQL Editor to delete all old tables
-- ============================================================

DROP TABLE IF EXISTS telemetry CASCADE;
DROP TABLE IF EXISTS controls CASCADE;
DROP TABLE IF EXISTS dashboard_outputs CASCADE;
DROP TABLE IF EXISTS dashboard_sensors CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
