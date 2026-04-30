import { useState, useEffect } from 'react'
import { supabase, fetchControlState, updateControlState } from '../lib/supabase'
import { DEMO_MODE, getDemoControlState, setDemoControl } from '../lib/demo'
import { useDevices } from './useDevices'

export function useControls() {
  const { devices, loading: devicesLoading } = useDevices()
  const [controls, setControls] = useState({
    pump_speed: 0,
    status: false,
    target_pressure: 3.5,
  })
  const [updating, setUpdating] = useState(false)
  const [error, setError]       = useState(null)

  const deviceIds  = devices.map(d => d.device_id)
  // Use first linked device for controls (primary device)
  const primaryId  = deviceIds[0] || null

  useEffect(() => {
    if (DEMO_MODE) {
      setControls(getDemoControlState())
      return
    }

    if (devicesLoading) return

    fetchControlState(deviceIds).then(data => {
      if (data) setControls(data)
    })

    const channelId = `controls-live-${Math.random().toString(36).substring(2, 9)}`
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'controls' }, payload => {
        if (!payload.new) return
        // Only accept control updates for user's devices
        if (payload.new.device_id && !deviceIds.includes(payload.new.device_id)) return
        setControls(payload.new)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesLoading, deviceIds.join(',')])

  async function applyControl(payload) {
    setUpdating(true)
    setError(null)
    try {
      if (DEMO_MODE) {
        const updated = setDemoControl(payload)
        setControls(updated)
      } else {
        const updated = await updateControlState(payload, primaryId)
        setControls(updated)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  return { controls, updating, error, applyControl, hasDevices: deviceIds.length > 0 }
}
