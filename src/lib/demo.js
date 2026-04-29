// Demo mode: generates realistic sensor data when Supabase is not configured

export const DEMO_MODE = false // Set to false when Supabase is connected

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const rand = (min, max) => Math.random() * (max - min) + min

let state = {
  tds: 285,
  temperature: 22.4,
  flow: 42.1,
  pressure: 3.8,
  diffPressure: 0.42,
  pumpOn: true,
  pumpSpeed: 48,
  targetPressure: 4.0,
}

export function getDemoSensorData() {
  // Drift values slightly each call
  state.tds = clamp(state.tds + rand(-4, 4), 100, 900)
  state.temperature = clamp(state.temperature + rand(-0.3, 0.3), 5, 45)
  state.flow = state.pumpOn ? clamp(state.flow + rand(-2, 2), 5, 120) : rand(0, 1)
  state.pressure = state.pumpOn ? clamp(state.pressure + rand(-0.15, 0.15), 0.5, 8) : rand(0, 0.2)
  state.diffPressure = clamp(state.diffPressure + rand(-0.02, 0.02), 0.05, 1.2)

  const now = new Date().toISOString()
  return {
    TDS: { sensor_type: 'TDS', value: +state.tds.toFixed(1), unit: 'ppm', created_at: now },
    TEMPERATURE: { sensor_type: 'TEMPERATURE', value: +state.temperature.toFixed(2), unit: '°C', created_at: now },
    FLOW: { sensor_type: 'FLOW', value: +state.flow.toFixed(2), unit: 'L/min', created_at: now },
    PRESSURE: { sensor_type: 'PRESSURE', value: +state.pressure.toFixed(3), unit: 'bar', created_at: now },
    DIFF_PRESSURE: { sensor_type: 'DIFF_PRESSURE', value: +state.diffPressure.toFixed(3), unit: 'bar', created_at: now },
  }
}

export function getDemoControlState() {
  return {
    pump_speed: state.pumpSpeed,
    status: state.pumpOn,
    target_pressure: state.targetPressure,
  }
}

export function setDemoControl(payload) {
  if (payload.status !== undefined) state.pumpOn = payload.status
  if (payload.pump_speed !== undefined) state.pumpSpeed = payload.pump_speed
  if (payload.target_pressure !== undefined) state.targetPressure = payload.target_pressure
  return getDemoControlState()
}

// Generate history for charts
export function getDemoHistory(sensorKey, points = 50) {
  const history = []
  const now = Date.now()
  let val = sensorKey === 'FLOW' ? 40 : 3.5

  for (let i = points; i >= 0; i--) {
    val = clamp(val + rand(-2, 2), sensorKey === 'FLOW' ? 5 : 0.5, sensorKey === 'FLOW' ? 120 : 8)
    history.push({
      time: new Date(now - i * 6000).toISOString(),
      value: +val.toFixed(2),
    })
  }
  return history
}
