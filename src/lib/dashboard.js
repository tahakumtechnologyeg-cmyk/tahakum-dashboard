import { readAll, insertRow, deleteRow } from './gsheet'

export async function fetchCustomSensors(userId) {
  if (!userId) return []
  try {
    const data = await readAll('dashboard_sensors', { filters: { user_id: userId }, orderBy: 'created_at' })
    return (data || []).map(s => ({
      id: s.id,
      builtIn: false,
      name: s.name,
      unit: s.unit,
      min: s.range_min,
      max: s.range_max,
    }))
  } catch { return [] }
}

export async function addCustomSensor(userId, { name, unit, min, max }) {
  const data = await insertRow('dashboard_sensors', {
    user_id: userId,
    name,
    unit: unit || '-',
    range_min: min || 0,
    range_max: max || 100,
  })
  return {
    id: data.id,
    builtIn: false,
    name: data.name,
    unit: data.unit,
    min: data.range_min,
    max: data.range_max,
  }
}

export async function deleteCustomSensor(id) {
  await deleteRow('dashboard_sensors', id)
}

export async function fetchCustomOutputs(userId) {
  if (!userId) return []
  try {
    const data = await readAll('dashboard_outputs', { filters: { user_id: userId }, orderBy: 'created_at' })
    return (data || []).map(o => ({
      id: o.id,
      builtIn: false,
      name: o.name,
      outputType: o.output_type,
    }))
  } catch { return [] }
}

export async function addCustomOutput(userId, { name, outputType }) {
  const data = await insertRow('dashboard_outputs', {
    user_id: userId,
    name,
    output_type: outputType || 'relay',
  })
  return {
    id: data.id,
    builtIn: false,
    name: data.name,
    outputType: data.output_type,
  }
}

export async function deleteCustomOutput(id) {
  await deleteRow('dashboard_outputs', id)
}
