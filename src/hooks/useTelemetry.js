import { useState, useEffect, useRef, useCallback } from 'react'
import { readAll } from '../lib/gsheet'
import { DEMO_MODE, getDemoSensorData, getDemoHistory } from '../lib/demo'

const HISTORY_MAX = 60
const SENSOR_TYPES = ['NPK_NITROGEN', 'NPK_PHOSPHORUS', 'NPK_POTASSIUM', 'PRESSURE']

export function useTelemetry() {
  const [latest, setLatest]   = useState({})
  const [history, setHistory] = useState({})
  const [connected, setConnected] = useState(false)
  const intervalRef = useRef(null)

  const appendHistory = useCallback((sensorType, entry) => {
    setHistory(prev => {
      const arr = [...(prev[sensorType] || []), { time: entry.created_at, value: entry.value }]
      return { ...prev, [sensorType]: arr.slice(-HISTORY_MAX) }
    })
  }, [])

  useEffect(() => {
    if (DEMO_MODE) {
      setLatest(getDemoSensorData())
      setConnected(true)
      intervalRef.current = setInterval(() => {
        const data = getDemoSensorData()
        setLatest(data)
        const now = new Date().toISOString()
        setHistory(prev => {
          const next = { ...prev }
          Object.entries(data).forEach(([type, entry]) => {
            const arr = [...(next[type] || []), { time: now, value: entry.value }].slice(-HISTORY_MAX)
            next[type] = arr
          })
          return next
        })
      }, 5000)
      return () => clearInterval(intervalRef.current)
    }

    async function load() {
      try {
        const all = await readAll('telemetry', { orderBy: 'created_at', order: 'desc', limit: 100 })

        const latestMap = {}
        const historyMap = {}
        SENSOR_TYPES.forEach(t => { historyMap[t] = [] })

        for (const row of all) {
          const type = row.sensor_type
          if (!SENSOR_TYPES.includes(type)) continue
          if (!latestMap[type]) latestMap[type] = row
          historyMap[type].unshift({ time: row.created_at, value: row.value })
        }

        setLatest(latestMap)
        SENSOR_TYPES.forEach(t => {
          historyMap[t] = historyMap[t].slice(-HISTORY_MAX)
        })
        setHistory(historyMap)
        setConnected(true)
      } catch (e) {
        console.error('Telemetry load error:', e)
      }
    }

    load()

    const poll = setInterval(load, 10000)
    return () => clearInterval(poll)
  }, [])

  return { latest, history, connected, hasDevices: true }
}
