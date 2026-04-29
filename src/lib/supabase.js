import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: { eventsPerSecond: 10 }
  }
})

// ─── Telemetry ────────────────────────────────────────────────────────────────

export async function fetchLatestTelemetry() {
  const sensors = ['TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE']
  const results = {}

  for (const sensor of sensors) {
    const { data, error } = await supabase
      .from('telemetry')
      .select('*')
      .eq('sensor_type', sensor)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!error && data) results[sensor] = data
  }

  return results
}

export async function fetchTelemetryHistory(sensorType, limit = 50) {
  const { data, error } = await supabase
    .from('telemetry')
    .select('*')
    .eq('sensor_type', sensorType)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []).reverse()
}

// ─── Controls ─────────────────────────────────────────────────────────────────

export async function fetchControlState() {
  const { data, error } = await supabase
    .from('controls')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data || { pump_speed: 0, status: false, target_pressure: 3.5, id: null }
}

export async function updateControlState(payload) {
  const current = await fetchControlState()

  if (current.id) {
    const { data, error } = await supabase
      .from('controls')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', current.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('controls')
      .insert([{ ...payload, updated_at: new Date().toISOString() }])
      .select()
      .single()
    if (error) throw error
    return data
  }
}
