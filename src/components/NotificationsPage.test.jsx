import { describe, it, expect } from 'vitest'
import { buildSensorAlerts, buildMotorAlerts, getNotifCount, formatTime, formatDate } from './NotificationsPage'

describe('buildSensorAlerts', () => {
  it('returns empty array for no data', () => {
    expect(buildSensorAlerts({})).toEqual([])
  })

  it('returns empty array for normal values', () => {
    const data = { PRESSURE: { value: 3, created_at: new Date().toISOString() } }
    expect(buildSensorAlerts(data)).toEqual([])
  })

  it('creates warning alert for elevated pressure', () => {
    const data = { PRESSURE: { value: 8, created_at: '2026-01-01T00:00:00Z' } }
    const alerts = buildSensorAlerts(data)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].status).toBe('warning')
    expect(alerts[0].type).toBe('PRESSURE')
    expect(alerts[0].label).toBe('PRES')
    expect(alerts[0].live).toBe(true)
  })

  it('creates critical alert for excessive pressure', () => {
    const data = { PRESSURE: { value: 10, created_at: '2026-01-01T00:00:00Z' } }
    const alerts = buildSensorAlerts(data)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].status).toBe('critical')
    expect(alerts[0].message).toBe('CRITICAL PRESSURE')
  })

  it('creates alerts for NPK warnings', () => {
    const data = { NPK_NITROGEN: { value: 1500, created_at: new Date().toISOString() } }
    const alerts = buildSensorAlerts(data)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].status).toBe('warning')
    expect(alerts[0].message).toBe('Nitrogen level elevated')
  })

  it('creates critical alerts for NPK', () => {
    const data = { NPK_NITROGEN: { value: 1800, created_at: new Date().toISOString() } }
    const alerts = buildSensorAlerts(data)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].status).toBe('critical')
    expect(alerts[0].message).toBe('CRITICAL NITROGEN')
  })

  it('creates alerts for Phosphorus warning', () => {
    const data = { NPK_PHOSPHORUS: { value: 1550, created_at: new Date().toISOString() } }
    const alerts = buildSensorAlerts(data)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].message).toBe('Phosphorus level elevated')
  })

  it('creates alerts for Potassium critical', () => {
    const data = { NPK_POTASSIUM: { value: 1900, created_at: new Date().toISOString() } }
    const alerts = buildSensorAlerts(data)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].status).toBe('critical')
    expect(alerts[0].message).toBe('CRITICAL POTASSIUM')
  })

  it('sorts critical alerts before warnings', () => {
    const data = {
      PRESSURE: { value: 3, created_at: new Date().toISOString() },
      NPK_NITROGEN: { value: 1800, created_at: new Date().toISOString() },
      NPK_PHOSPHORUS: { value: 1500, created_at: new Date().toISOString() },
    }
    const alerts = buildSensorAlerts(data)
    expect(alerts[0].status).toBe('critical')
    expect(alerts[1].status).toBe('warning')
  })

  it('handles multiple alerts simultaneously', () => {
    const data = {
      PRESSURE: { value: 10, created_at: new Date().toISOString() },
      NPK_NITROGEN: { value: 1800, created_at: new Date().toISOString() },
      NPK_PHOSPHORUS: { value: 1900, created_at: new Date().toISOString() },
      NPK_POTASSIUM: { value: 2000, created_at: new Date().toISOString() },
    }
    const alerts = buildSensorAlerts(data)
    expect(alerts.length).toBeGreaterThanOrEqual(4)
    alerts.forEach(a => expect(a.status).toBe('critical'))
  })

  it('includes value and unit in alert', () => {
    const data = { PRESSURE: { value: 9.5, created_at: new Date().toISOString() } }
    const alerts = buildSensorAlerts(data)
    expect(alerts[0].value).toBe(9.5)
    expect(alerts[0].unit).toBe('bar')
  })

  it('ignores sensors without threshold config', () => {
    const data = { UNKNOWN_SENSOR: { value: 999, created_at: new Date().toISOString() } }
    expect(buildSensorAlerts(data)).toEqual([])
  })
})

describe('buildMotorAlerts', () => {
  it('returns empty when no controls', () => {
    expect(buildMotorAlerts(null, null)).toEqual([])
  })

  it('returns empty when status unchanged', () => {
    const controls = { status: true }
    expect(buildMotorAlerts(controls, controls)).toEqual([])
  })

  it('creates info event when pump starts', () => {
    const prev = { status: false }
    const curr = { status: true }
    const events = buildMotorAlerts(curr, prev)
    expect(events).toHaveLength(1)
    expect(events[0].status).toBe('info')
    expect(events[0].message).toContain('Pump started')
    expect(events[0].category).toBe('motor')
  })

  it('creates warning event when pump stops', () => {
    const prev = { status: true }
    const curr = { status: false }
    const events = buildMotorAlerts(curr, prev)
    expect(events).toHaveLength(1)
    expect(events[0].status).toBe('warning')
    expect(events[0].message).toContain('Pump stopped')
  })
})

describe('getNotifCount', () => {
  it('returns 0 for no data', () => {
    expect(getNotifCount({})).toBe(0)
    expect(getNotifCount(null)).toBe(0)
  })

  it('returns 0 for normal values', () => {
    expect(getNotifCount({ PRESSURE: { value: 3 } })).toBe(0)
  })

  it('counts warning sensors', () => {
    expect(getNotifCount({ PRESSURE: { value: 8 } })).toBe(1)
  })

  it('counts critical sensors', () => {
    expect(getNotifCount({ PRESSURE: { value: 10 } })).toBe(1)
  })

  it('counts multiple alerting sensors', () => {
    const data = {
      PRESSURE: { value: 10 },
      NPK_NITROGEN: { value: 1800 },
      NPK_PHOSPHORUS: { value: 500 },
    }
    expect(getNotifCount(data)).toBe(2)
  })
})

describe('formatTime', () => {
  it('returns empty for null/undefined', () => {
    expect(formatTime(null)).toBe('')
    expect(formatTime(undefined)).toBe('')
  })

  it('formats ISO string to time', () => {
    const result = formatTime('2026-07-21T14:30:00Z')
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })
})

describe('formatDate', () => {
  it('returns empty for null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('formats today with "Today" prefix', () => {
    const today = new Date().toISOString()
    expect(formatDate(today)).toContain('Today')
  })
})
