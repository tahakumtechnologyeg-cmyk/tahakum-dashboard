// Demo mode: generates realistic sensor data when Supabase is not configured

export const DEMO_MODE = false // Set to false when Supabase is connected

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const rand = (min, max) => Math.random() * (max - min) + min

let state = {
  ly485Temp: 28.6,
  ly485Hum: 62.3,
  npkN: 320,
  npkP: 180,
  npkK: 450,
  pumpOn: true,
  pumpSpeed: 48,
  targetPressure: 4.0,
}

export function getDemoSensorData() {
  state.ly485Temp = clamp(state.ly485Temp + rand(-0.3, 0.3), -5, 60)
  state.ly485Hum = clamp(state.ly485Hum + rand(-1.5, 1.5), 10, 99)
  state.npkN = clamp(state.npkN + rand(-8, 8), 0, 1999)
  state.npkP = clamp(state.npkP + rand(-5, 5), 0, 1999)
  state.npkK = clamp(state.npkK + rand(-10, 10), 0, 1999)

  const now = new Date().toISOString()
  return {
    LY485_TEMP: { sensor_type: 'LY485_TEMP', value: +state.ly485Temp.toFixed(1), unit: '°C', created_at: now },
    LY485_HUM: { sensor_type: 'LY485_HUM', value: +state.ly485Hum.toFixed(1), unit: '%RH', created_at: now },
    NPK_NITROGEN: { sensor_type: 'NPK_NITROGEN', value: Math.round(state.npkN), unit: 'mg/kg', created_at: now },
    NPK_PHOSPHORUS: { sensor_type: 'NPK_PHOSPHORUS', value: Math.round(state.npkP), unit: 'mg/kg', created_at: now },
    NPK_POTASSIUM: { sensor_type: 'NPK_POTASSIUM', value: Math.round(state.npkK), unit: 'mg/kg', created_at: now },
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
  let val = sensorKey === 'LY485_TEMP' ? 28 : 60

  for (let i = points; i >= 0; i--) {
    val = clamp(val + rand(-0.5, 0.5), sensorKey === 'LY485_TEMP' ? 15 : 20, sensorKey === 'LY485_TEMP' ? 45 : 95)
    history.push({
      time: new Date(now - i * 6000).toISOString(),
      value: +val.toFixed(2),
    })
  }
  return history
}
