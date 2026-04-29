import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, fetchLatestTelemetry, fetchTelemetryHistory } from '../lib/supabase'
import { DEMO_MODE, getDemoSensorData, getDemoHistory } from '../lib/demo'

const HISTORY_MAX = 60

export function useTelemetry() {
  const [latest, setLatest] = useState({})
  const [history, setHistory] = useState({ FLOW: [], PRESSURE: [] })
  const [connected, setConnected] = useState(false)
  const intervalRef = useRef(null)

  const appendHistory = useCallback((sensorType, entry) => {
    if (sensorType !== 'FLOW' && sensorType !== 'PRESSURE') return
    setHistory(prev => {
      const arr = [...(prev[sensorType] || []), { time: entry.created_at, value: entry.value }]
      return { ...prev, [sensorType]: arr.slice(-HISTORY_MAX) }
    })
  }, [])

  useEffect(() => {
    if (DEMO_MODE) {
      // Seed initial history
      setHistory({
        FLOW: getDemoHistory('FLOW'),
        PRESSURE: getDemoHistory('PRESSURE'),
      })
      setLatest(getDemoSensorData())
      setConnected(true)

      // Poll every 5 seconds
      intervalRef.current = setInterval(() => {
        const data = getDemoSensorData()
        setLatest(data)
        const now = new Date().toISOString()
        setHistory(prev => ({
          FLOW: [...prev.FLOW, { time: now, value: data.FLOW.value }].slice(-HISTORY_MAX),
          PRESSURE: [...prev.PRESSURE, { time: now, value: data.PRESSURE.value }].slice(-HISTORY_MAX),
        }))
      }, 5000)

      return () => clearInterval(intervalRef.current)
    }

    // Live mode: fetch initial data + subscribe
    async function init() {
      try {
        const data = await fetchLatestTelemetry()
        setLatest(data)

        const [flowHist, pressHist] = await Promise.all([
          fetchTelemetryHistory('FLOW', 50),
          fetchTelemetryHistory('PRESSURE', 50),
        ])

        setHistory({
          FLOW: flowHist.map(r => ({ time: r.created_at, value: r.value })),
          PRESSURE: pressHist.map(r => ({ time: r.created_at, value: r.value })),
        })

        setConnected(true)
      } catch (e) {
        console.error('Telemetry init error:', e)
      }
    }

    init()

    const channel = supabase
      .channel('telemetry-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'telemetry' }, payload => {
        const row = payload.new
        setLatest(prev => ({ ...prev, [row.sensor_type]: row }))
        appendHistory(row.sensor_type, row)
      })
      .subscribe(status => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => supabase.removeChannel(channel)
  }, [appendHistory])

  return { latest, history, connected }
}
