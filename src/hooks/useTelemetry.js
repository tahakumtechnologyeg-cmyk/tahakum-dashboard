import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, fetchLatestTelemetry, fetchTelemetryHistory } from '../lib/supabase'
import { DEMO_MODE, getDemoSensorData, getDemoHistory } from '../lib/demo'
import { useDevices } from './useDevices'

const HISTORY_MAX = 60

export function useTelemetry() {
  const { devices, loading: devicesLoading } = useDevices()
  const [latest, setLatest]   = useState({})
  const [history, setHistory] = useState({ LY485_TEMP: [], LY485_HUM: [] })
  const [connected, setConnected] = useState(false)
  const intervalRef = useRef(null)

  // Extract device_id list from user's linked devices
  const deviceIds = devices.map(d => d.device_id)

  const appendHistory = useCallback((sensorType, entry) => {
    if (sensorType !== 'LY485_TEMP' && sensorType !== 'LY485_HUM') return
    setHistory(prev => {
      const arr = [...(prev[sensorType] || []), { time: entry.created_at, value: entry.value }]
      return { ...prev, [sensorType]: arr.slice(-HISTORY_MAX) }
    })
  }, [])

  useEffect(() => {
    if (DEMO_MODE) {
      setHistory({
        LY485_TEMP: getDemoHistory('LY485_TEMP'),
        LY485_HUM: getDemoHistory('LY485_HUM'),
      })
      setLatest(getDemoSensorData())
      setConnected(true)

      intervalRef.current = setInterval(() => {
        const data = getDemoSensorData()
        setLatest(data)
        const now = new Date().toISOString()
        setHistory(prev => ({
          LY485_TEMP: [...prev.LY485_TEMP, { time: now, value: data.LY485_TEMP.value }].slice(-HISTORY_MAX),
          LY485_HUM:  [...prev.LY485_HUM,  { time: now, value: data.LY485_HUM.value }].slice(-HISTORY_MAX),
        }))
      }, 5000)

      return () => clearInterval(intervalRef.current)
    }

    // Wait until devices are loaded
    if (devicesLoading) return

    // If user has no devices linked — show empty state
    if (deviceIds.length === 0) {
      setLatest({})
      setHistory({ LY485_TEMP: [], LY485_HUM: [] })
      setConnected(false)
      return
    }

    async function init() {
      try {
        const data = await fetchLatestTelemetry(deviceIds)
        setLatest(data)

        const [tempHist, humHist] = await Promise.all([
          fetchTelemetryHistory('LY485_TEMP', 50, deviceIds),
          fetchTelemetryHistory('LY485_HUM',  50, deviceIds),
        ])

        setHistory({
          LY485_TEMP: tempHist.map(r => ({ time: r.created_at, value: r.value })),
          LY485_HUM:  humHist.map(r  => ({ time: r.created_at, value: r.value })),
        })

        setConnected(true)
      } catch (e) {
        console.error('Telemetry init error:', e)
      }
    }

    init()

    // Realtime: only show inserts from user's devices
    const channel = supabase
      .channel('telemetry-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetry' },
        payload => {
          const row = payload.new
          // Filter client-side — only accept rows from user's devices
          if (!deviceIds.includes(row.device_id)) return
          setLatest(prev => ({ ...prev, [row.sensor_type]: row }))
          appendHistory(row.sensor_type, row)
        }
      )
      .subscribe(status => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => supabase.removeChannel(channel)

  // Re-run whenever device list changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesLoading, deviceIds.join(',')])

  return { latest, history, connected, hasDevices: deviceIds.length > 0 }
}
