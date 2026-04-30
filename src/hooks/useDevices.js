import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useDevices() {
  const { user } = useAuth()
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDevices = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .order('claimed_at', { ascending: false })
    if (error) setError(error.message)
    else setDevices(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  // Claim a device by device_id (scanned from QR or typed manually)
  async function claimDevice(deviceId, name) {
    setError(null)
    if (!deviceId?.trim()) return { error: 'Device ID is required' }

    // Check if device is already claimed by someone else
    const { data: existing } = await supabase
      .from('devices')
      .select('user_id')
      .eq('device_id', deviceId.trim())
      .single()

    if (existing && existing.user_id !== user.id) {
      return { error: 'This device is already registered to another account' }
    }

    const { data, error } = await supabase
      .from('devices')
      .upsert({
        device_id: deviceId.trim(),
        user_id: user.id,
        name: name?.trim() || `Device ${deviceId.slice(-6)}`,
        claimed_at: new Date().toISOString(),
      }, { onConflict: 'device_id' })
      .select()
      .single()

    if (error) return { error: error.message }
    setDevices(prev => {
      const filtered = prev.filter(d => d.device_id !== data.device_id)
      return [data, ...filtered]
    })
    return { data }
  }

  async function removeDevice(deviceId) {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('device_id', deviceId)
      .eq('user_id', user.id)
    if (error) return { error: error.message }
    setDevices(prev => prev.filter(d => d.device_id !== deviceId))
    return {}
  }

  async function renameDevice(deviceId, newName) {
    const { data, error } = await supabase
      .from('devices')
      .update({ name: newName.trim() })
      .eq('device_id', deviceId)
      .eq('user_id', user.id)
      .select()
      .single()
    if (error) return { error: error.message }
    setDevices(prev => prev.map(d => d.device_id === deviceId ? data : d))
    return { data }
  }

  return { devices, loading, error, claimDevice, removeDevice, renameDevice, refetch: fetchDevices }
}
