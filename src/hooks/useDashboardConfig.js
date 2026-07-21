import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import {
  fetchCustomSensors,
  addCustomSensor,
  deleteCustomSensor,
  fetchCustomOutputs,
  addCustomOutput,
  deleteCustomOutput,
} from '../lib/dashboard'

const DEFAULT_SENSORS = [
  { id: 'NPK_NITROGEN',   builtIn: true, label: 'Nitrogen (N)',       unit: 'mg/kg', min: 0, max: 1999 },
  { id: 'NPK_PHOSPHORUS', builtIn: true, label: 'Phosphorus (P)',     unit: 'mg/kg', min: 0, max: 1999 },
  { id: 'NPK_POTASSIUM',  builtIn: true, label: 'Potassium (K)',      unit: 'mg/kg', min: 0, max: 1999 },
  { id: 'PRESSURE',       builtIn: true, label: 'Water Pressure',      unit: 'bar',   min: 0, max: 10   },
]

const DEFAULT_OUTPUTS = [
  { id: 'pump_vfd', builtIn: true, outputType: 'vfd', name: 'Water Pump' },
]

export function useDashboardConfig() {
  const { user } = useAuth()
  const [customSensors, setCustomSensors] = useState([])
  const [customOutputs, setCustomOutputs] = useState([])
  const [loading, setLoading] = useState(true)

  const [removedSensorIds, setRemovedSensorIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('removedSensorIds') || '[]') }
    catch { return [] }
  })
  const [removedOutputIds, setRemovedOutputIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('removedOutputIds') || '[]') }
    catch { return [] }
  })

  // Sync removed ids to localStorage
  useEffect(() => { localStorage.setItem('removedSensorIds', JSON.stringify(removedSensorIds)) }, [removedSensorIds])
  useEffect(() => { localStorage.setItem('removedOutputIds', JSON.stringify(removedOutputIds)) }, [removedOutputIds])

  // Fetch custom items from Supabase on mount
  useEffect(() => {
    if (!user) {
      setCustomSensors([])
      setCustomOutputs([])
      setLoading(false)
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [sensors, outputs] = await Promise.all([
          fetchCustomSensors(user.id),
          fetchCustomOutputs(user.id),
        ])
        if (cancelled) return
        setCustomSensors(sensors)
        setCustomOutputs(outputs)
      } catch (e) { console.error('useDashboardConfig fetch failed:', e) }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [user])

  // Merge defaults + custom, filtering out removed built-in items
  const sensors = [
    ...DEFAULT_SENSORS.filter(s => !removedSensorIds.includes(s.id)),
    ...customSensors,
  ]
  const outputs = [
    ...DEFAULT_OUTPUTS.filter(o => !removedOutputIds.includes(o.id)),
    ...customOutputs,
  ]

  const addSensor = useCallback(async (sensorData) => {
    try {
      if (sensorData.builtIn) {
        setRemovedSensorIds(prev => prev.filter(id => id !== sensorData.id))
        return
      }
      if (!user) { console.error('addSensor: no user'); return }
      const newSensor = await addCustomSensor(user.id, sensorData)
      setCustomSensors(prev => [...prev, newSensor])
      return newSensor
    } catch (e) { console.error('addSensor failed:', e) }
  }, [user])

  const deleteSensor = useCallback(async (id) => {
    try {
      const isBuiltIn = DEFAULT_SENSORS.some(s => s.id === id)
      if (isBuiltIn) {
        setRemovedSensorIds(prev => [...prev, id])
      } else {
        if (!user) { console.error('deleteSensor: no user'); return }
        await deleteCustomSensor(id, user.id)
        setCustomSensors(prev => prev.filter(s => s.id !== id))
      }
    } catch (e) { console.error('deleteSensor failed:', e) }
  }, [user])

  const addOutput = useCallback(async (outputData) => {
    try {
      if (!user) { console.error('addOutput: no user'); return }
      const newOutput = await addCustomOutput(user.id, outputData)
      setCustomOutputs(prev => [...prev, newOutput])
      return newOutput
    } catch (e) { console.error('addOutput failed:', e) }
  }, [user])

  const deleteOutput = useCallback(async (id) => {
    try {
      const isBuiltIn = DEFAULT_OUTPUTS.some(o => o.id === id)
      if (isBuiltIn) {
        setRemovedOutputIds(prev => [...prev, id])
      } else {
        if (!user) { console.error('deleteOutput: no user'); return }
        await deleteCustomOutput(id, user.id)
        setCustomOutputs(prev => prev.filter(o => o.id !== id))
      }
    } catch (e) { console.error('deleteOutput failed:', e) }
  }, [user])

  return { sensors, outputs, loading, addSensor, deleteSensor, addOutput, deleteOutput }
}
