import { useState, useEffect } from 'react'
import { readAll, insertRow, updateRow } from '../lib/gsheet'
import { DEMO_MODE, getDemoControlState, setDemoControl } from '../lib/demo'

const DEFAULT = { pump_speed: 0, status: false, target_pressure: 3.5 }

export function useControls() {
  const [controls, setControls] = useState(DEFAULT)
  const [updating, setUpdating] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (DEMO_MODE) {
      setControls(getDemoControlState())
      return
    }

    readAll('controls', { orderBy: 'updated_at', order: 'desc', single: true }).then(data => {
      if (data && !data.error) setControls(data)
    })
  }, [])

  async function applyControl(payload) {
    setUpdating(true)
    setError(null)
    try {
      if (DEMO_MODE) {
        const updated = setDemoControl(payload)
        setControls(updated)
        return
      }

      const current = await readAll('controls', { orderBy: 'updated_at', order: 'desc', single: true })
      const now = new Date().toISOString()
      const data = { ...payload, force_wakeup: true, updated_at: now }

      if (current && current.id) {
        const updated = await updateRow('controls', { ...data, id: current.id })
        setControls(updated)
      } else {
        const inserted = await insertRow('controls', data)
        setControls(inserted)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setUpdating(false)
    }
  }

  return { controls, updating, error, applyControl, hasDevices: true }
}
