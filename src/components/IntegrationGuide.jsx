import { X, Cpu, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'
const ANON_KEY = 'YOUR_ANON_KEY'

const CURL_POST = `# POST sensor reading from ESP32-S3
curl -X POST '${SUPABASE_URL}/rest/v1/telemetry' \\
  -H 'apikey: ${ANON_KEY}' \\
  -H 'Authorization: Bearer ${ANON_KEY}' \\
  -H 'Content-Type: application/json' \\
  -H 'Prefer: return=minimal' \\
  -d '{
    "sensor_type": "PRESSURE",
    "value": 3.82,
    "unit": "bar"
  }'`

const CURL_GET = `# GET latest VFD control state
curl -X GET '${SUPABASE_URL}/rest/v1/controls?select=*&order=updated_at.desc&limit=1' \\
  -H 'apikey: ${ANON_KEY}' \\
  -H 'Authorization: Bearer ${ANON_KEY}'`

const ARDUINO_CODE = `#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASS";
const char* SUPABASE_URL = "${SUPABASE_URL}";
const char* ANON_KEY = "${ANON_KEY}";

// Post sensor reading to Supabase
void postTelemetry(const char* sensorType, float value, const char* unit) {
  HTTPClient http;
  String url = String(SUPABASE_URL) + "/rest/v1/telemetry";
  
  http.begin(url);
  http.addHeader("apikey", ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + ANON_KEY);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Prefer", "return=minimal");
  
  StaticJsonDocument<200> doc;
  doc["sensor_type"] = sensorType;
  doc["value"] = value;
  doc["unit"] = unit;
  
  String body;
  serializeJson(doc, body);
  int code = http.POST(body);
  
  Serial.printf("[TELEMETRY] %s = %.3f %s → HTTP %d\\n",
    sensorType, value, unit, code);
  http.end();
}

// Read VFD control state
struct ControlState {
  float pump_speed;
  bool status;
  float target_pressure;
};

ControlState getControlState() {
  HTTPClient http;
  String url = String(SUPABASE_URL) + 
    "/rest/v1/controls?select=*&order=updated_at.desc&limit=1";
  
  http.begin(url);
  http.addHeader("apikey", ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + ANON_KEY);
  
  ControlState state = {0, false, 3.5};
  
  if (http.GET() == 200) {
    StaticJsonDocument<512> doc;
    deserializeJson(doc, http.getString());
    if (doc.is<JsonArray>() && doc.size() > 0) {
      state.pump_speed = doc[0]["pump_speed"];
      state.status = doc[0]["status"];
      state.target_pressure = doc[0]["target_pressure"];
    }
  }
  http.end();
  return state;
}

void loop() {
  // Read sensors (replace with your ADC/sensor code)
  float tds = readTDS();           // ppm
  float temp = readPT100();        // °C
  float flow = readFlowSensor();   // L/min
  float pressure = readPressure(); // bar
  float diffP = readDiffPressure(); // bar
  
  // Push to Supabase
  postTelemetry("TDS", tds, "ppm");
  postTelemetry("TEMPERATURE", temp, "°C");
  postTelemetry("FLOW", flow, "L/min");
  postTelemetry("PRESSURE", pressure, "bar");
  postTelemetry("DIFF_PRESSURE", diffP, "bar");
  
  // Pull VFD control setpoints
  ControlState ctrl = getControlState();
  setVFDFrequency(ctrl.pump_speed);  // send via UART/Modbus to STM32→VFD
  
  delay(5000); // 5s polling interval
}`

const SQL_SCHEMA = `-- Run in Supabase SQL Editor

-- Telemetry table (sensor readings from ESP32)
CREATE TABLE public.telemetry (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz DEFAULT now() NOT NULL,
  sensor_type text NOT NULL CHECK (sensor_type IN (
    'TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE'
  )),
  value       numeric(12, 4) NOT NULL,
  unit        text NOT NULL
);

-- Index for fast time-series queries
CREATE INDEX idx_telemetry_sensor_time
  ON telemetry(sensor_type, created_at DESC);

-- Enable real-time
ALTER TABLE public.telemetry REPLICA IDENTITY FULL;

-- Controls table (VFD setpoints written by dashboard)
CREATE TABLE public.controls (
  id               bigserial PRIMARY KEY,
  updated_at       timestamptz DEFAULT now() NOT NULL,
  pump_speed       numeric(5,1) DEFAULT 0 NOT NULL,  -- Hz (0–50)
  status           boolean DEFAULT false NOT NULL,
  target_pressure  numeric(5,2) DEFAULT 3.5 NOT NULL -- bar
);

-- Enable real-time
ALTER TABLE public.controls REPLICA IDENTITY FULL;

-- Seed default control row
INSERT INTO public.controls (pump_speed, status, target_pressure)
VALUES (0, false, 3.5);

-- Row Level Security (allow ESP32 anon key to insert telemetry)
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert telemetry"
  ON public.telemetry FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read telemetry"
  ON public.telemetry FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon read controls"
  ON public.controls FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated update controls"
  ON public.controls FOR ALL TO authenticated USING (true);

-- Enable real-time publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry;
ALTER PUBLICATION supabase_realtime ADD TABLE public.controls;`

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-scada-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-scada-dim/40 border-b border-scada-border">
        <span className="font-mono text-xs text-scada-muted">{label}</span>
        <button onClick={copy} className="flex items-center gap-1.5 font-mono text-xs text-scada-text hover:text-white transition-colors">
          {copied ? <Check className="w-3 h-3 text-scada-green" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-scada-text overflow-x-auto leading-relaxed bg-scada-bg/50">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Section({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-scada-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-scada-panel hover:bg-scada-dim/30 transition-colors">
        <span className="font-display text-xs font-bold tracking-wider text-scada-text">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-scada-muted" /> : <ChevronDown className="w-4 h-4 text-scada-muted" />}
      </button>
      {open && <div className="p-4 bg-scada-bg/30 space-y-3 border-t border-scada-border">{children}</div>}
    </div>
  )
}

export default function IntegrationGuide({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-scada-panel border border-scada-border rounded-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-scada-border">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-scada-accent" />
            <div>
              <h2 className="font-display text-sm font-bold tracking-widest text-white">ESP32-S3 INTEGRATION GUIDE</h2>
              <p className="font-body text-xs text-scada-muted">Hardware → Supabase REST API</p>
            </div>
          </div>
          <button onClick={onClose} className="text-scada-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Architecture note */}
          <div className="bg-scada-accent/5 border border-scada-accent/20 rounded-lg px-4 py-3">
            <p className="font-body text-xs text-scada-text leading-relaxed">
              <span className="text-scada-accent font-bold">Architecture: </span>
              ESP32-S3 handles WiFi + Supabase REST calls. STM32 handles real-time ADC sampling,
              PT100 temperature via SPI, and VFD control via Modbus RTU/UART. ESP32 polls STM32 over UART
              and relays data to Supabase every 5s.
            </p>
          </div>

          <Section title="1. SUPABASE SQL SCHEMA — Run First">
            <CodeBlock code={SQL_SCHEMA} label="SQL · Supabase Editor" />
          </Section>

          <Section title="2. POST Sensor Data (cURL)">
            <CodeBlock code={CURL_POST} label="bash · cURL" />
          </Section>

          <Section title="3. GET VFD Control State (cURL)">
            <CodeBlock code={CURL_GET} label="bash · cURL" />
          </Section>

          <Section title="4. Arduino / ESP32-S3 Sketch">
            <p className="font-body text-xs text-scada-muted">
              Requires: ArduinoJson, WiFi, HTTPClient libraries. Replace sensor read functions with your ADC code.
            </p>
            <CodeBlock code={ARDUINO_CODE} label="arduino · ESP32-S3" />
          </Section>

          <Section title="5. Environment Variables (.env)">
            <CodeBlock
              label=".env · Vite frontend"
              code={`VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co\nVITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY`} />
            <p className="font-body text-xs text-scada-muted mt-2">
              Set <code className="text-scada-accent">DEMO_MODE = false</code> in <code className="text-scada-accent">src/lib/demo.js</code> after connecting Supabase.
            </p>
          </Section>

          <Section title="6. GitHub Pages Deployment">
            <CodeBlock
              label="bash · deploy"
              code={`# Build
npm run build

# Deploy to GitHub Pages (using gh-pages)
npm install -g gh-pages
gh-pages -d dist

# Or add to package.json scripts:
# "deploy": "gh-pages -d dist"`} />
          </Section>
        </div>
      </div>
    </div>
  )
}
