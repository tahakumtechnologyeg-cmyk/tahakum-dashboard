import { supabase } from './supabase'

export async function fetchCustomSensors(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('dashboard_sensors')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(s => ({
    id: s.id,
    builtIn: false,
    name: s.name,
    unit: s.unit,
    min: s.range_min,
    max: s.range_max,
  }))
}

export async function addCustomSensor(userId, { name, unit, min, max }) {
  const { data, error } = await supabase
    .from('dashboard_sensors')
    .insert({
      user_id: userId,
      name,
      unit: unit || '-',
      range_min: min || 0,
      range_max: max || 100,
    })
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    builtIn: false,
    name: data.name,
    unit: data.unit,
    min: data.range_min,
    max: data.range_max,
  }
}

export async function deleteCustomSensor(id, userId) {
  const { error } = await supabase
    .from('dashboard_sensors')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function fetchCustomOutputs(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('dashboard_outputs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(o => ({
    id: o.id,
    builtIn: false,
    name: o.name,
    outputType: o.output_type,
  }))
}

export async function addCustomOutput(userId, { name, outputType }) {
  const { data, error } = await supabase
    .from('dashboard_outputs')
    .insert({
      user_id: userId,
      name,
      output_type: outputType || 'relay',
    })
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    builtIn: false,
    name: data.name,
    outputType: data.output_type,
  }
}

export async function deleteCustomOutput(id, userId) {
  const { error } = await supabase
    .from('dashboard_outputs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}
