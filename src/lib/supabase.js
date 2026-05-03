import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
})

// ─── Telemetry ────────────────────────────────────────────────

// deviceIds = array of device_id strings belonging to the current user
export async function fetchLatestTelemetry(deviceIds = []) {
  const sensors = ['TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE']
  const results = {}

  for (const sensor of sensors) {
    let query = supabase
      .from('telemetry')
      .select('*')
      .eq('sensor_type', sensor)
      .order('created_at', { ascending: false })
      .limit(1)

    // Filter to user's devices only if they have any linked
    if (deviceIds.length > 0) {
      query = query.in('device_id', deviceIds)
    } else {
      // User has no devices — return nothing
      continue
    }

    const { data, error } = await query.single()
    if (!error && data) results[sensor] = data
  }

  return results
}

export async function fetchTelemetryHistory(sensorType, limit = 50, deviceIds = []) {
  if (deviceIds.length === 0) return []

  let query = supabase
    .from('telemetry')
    .select('*')
    .eq('sensor_type', sensorType)
    .in('device_id', deviceIds)
    .order('created_at', { ascending: false })
    .limit(limit)

  const { data, error } = await query
  if (error) throw error
  return (data || []).reverse()
}

// ─── Controls ─────────────────────────────────────────────────

export async function fetchControlState(deviceIds = []) {
  let query = supabase
    .from('controls')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)

  if (deviceIds.length > 0) {
    query = query.in('device_id', deviceIds)
  }

  const { data, error } = await query.single()
  if (error && error.code !== 'PGRST116') throw error
  return data || { pump_speed: 0, status: false, target_pressure: 3.5, id: null, ota_esp32_url: null, ota_stm32_url: null }
}

export async function updateControlState(payload, deviceId = null) {
  const current = await fetchControlState(deviceId ? [deviceId] : [])

  const updatePayload = {
    ...payload,
    updated_at: new Date().toISOString(),
    ...(deviceId ? { device_id: deviceId } : {}),
  }

  if (current.id) {
    const { data, error } = await supabase
      .from('controls')
      .update(updatePayload)
      .eq('id', current.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('controls')
      .insert([updatePayload])
      .select()
      .single()
    if (error) throw error
    return data
  }
}
