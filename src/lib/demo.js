export const DEMO_MODE = false

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const rand = (min, max) => Math.random() * (max - min) + min

let state = {
  npkN: 320,
  npkP: 180,
  npkK: 450,
  pressure: 50,
  pumpOn: true,
  pumpSpeed: 48,
  targetPressure: 4.0,
}

export function getDemoSensorData() {
  state.npkN = clamp(state.npkN + rand(-8, 8), 0, 1999)
  state.npkP = clamp(state.npkP + rand(-5, 5), 0, 1999)
  state.npkK = clamp(state.npkK + rand(-10, 10), 0, 1999)
  state.pressure = clamp(state.pressure + rand(-2, 2), 0, 200)

  const now = new Date().toISOString()
  return {
    NPK_NITROGEN: { sensor_type: 'NPK_NITROGEN', value: Math.round(state.npkN), unit: 'mg/kg', created_at: now },
    NPK_PHOSPHORUS: { sensor_type: 'NPK_PHOSPHORUS', value: Math.round(state.npkP), unit: 'mg/kg', created_at: now },
    NPK_POTASSIUM: { sensor_type: 'NPK_POTASSIUM', value: Math.round(state.npkK), unit: 'mg/kg', created_at: now },
    PRESSURE: { sensor_type: 'PRESSURE', value: +state.pressure.toFixed(2), unit: 'bar', created_at: now },
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

export function getDemoHistory(sensorKey, points = 50) {
  const history = []
  const now = Date.now()
  let val = 300
  for (let i = points; i >= 0; i--) {
    val = clamp(val + rand(-10, 10), 0, 1999)
    history.push({
      time: new Date(now - i * 6000).toISOString(),
      value: +val.toFixed(2),
    })
  }
  return history
}
