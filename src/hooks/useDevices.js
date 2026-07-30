import { useState, useEffect, useCallback } from 'react'
import { readAll, insertRow, deleteRow, updateRow } from '../lib/gsheet'
import { useAuth } from './useAuth'

export function useDevices() {
  const { user } = useAuth()
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDevices = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await readAll('devices', { filters: { user_id: user.id }, orderBy: 'claimed_at', order: 'desc' })
      setDevices(data || [])
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchDevices() }, [fetchDevices])

  async function claimDevice(deviceId, name) {
    setError(null)
    if (!deviceId?.trim()) return { error: 'Device ID is required' }

    try {
      const existing = await readAll('devices', { filters: { device_id: deviceId.trim() }, single: true })
      if (existing && existing.user_id !== user.id) {
        return { error: 'This device is already registered to another account' }
      }

      const data = await insertRow('devices', {
        device_id: deviceId.trim(),
        user_id: user.id,
        name: name?.trim() || `Device ${deviceId.slice(-6)}`,
      })
      setDevices(prev => [data, ...prev.filter(d => d.device_id !== data.device_id)])
      return { data }
    } catch (e) {
      return { error: e.message }
    }
  }

  async function removeDevice(deviceId) {
    try {
      await deleteRow('devices', deviceId, 'device_id')
      setDevices(prev => prev.filter(d => d.device_id !== deviceId))
      return {}
    } catch (e) {
      return { error: e.message }
    }
  }

  async function renameDevice(deviceId, newName) {
    try {
      const updated = await updateRow('devices', { device_id: deviceId, name: newName.trim() }, 'device_id')
      setDevices(prev => prev.map(d => d.device_id === deviceId ? updated : d))
      return { data: updated }
    } catch (e) {
      return { error: e.message }
    }
  }

  return { devices, loading, error, claimDevice, removeDevice, renameDevice, refetch: fetchDevices }
}
