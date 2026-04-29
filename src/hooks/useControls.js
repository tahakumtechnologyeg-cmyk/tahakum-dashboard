import { useState, useEffect } from 'react'
import { supabase, fetchControlState, updateControlState } from '../lib/supabase'
import { DEMO_MODE, getDemoControlState, setDemoControl } from '../lib/demo'

export function useControls() {
  const [controls, setControls] = useState({
    pump_speed: 0,
    status: false,
    target_pressure: 3.5,
  })
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (DEMO_MODE) {
      setControls(getDemoControlState())
      return
    }

    fetchControlState().then(data => {
      if (data) setControls(data)
    })

    const channel = supabase
      .channel('controls-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'controls' }, payload => {
        setControls(payload.new)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function applyControl(payload) {
    setUpdating(true)
    setError(null)
    try {
      if (DEMO_MODE) {
        const updated = setDemoControl(payload)
        setControls(updated)
      } else {
        const updated = await updateControlState(payload)
        setControls(updated)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  return { controls, updating, error, applyControl }
}
