import { describe, it, expect } from 'vitest'
import { SENSORS, getSensorStatus, STATUS_COLORS } from './thresholds'

describe('SENSORS registry', () => {
  it('defines all 4 sensors', () => {
    expect(Object.keys(SENSORS)).toHaveLength(4)
    expect(SENSORS).toHaveProperty('PRESSURE')
    expect(SENSORS).toHaveProperty('NPK_NITROGEN')
    expect(SENSORS).toHaveProperty('NPK_PHOSPHORUS')
    expect(SENSORS).toHaveProperty('NPK_POTASSIUM')
  })

  it('each sensor has required fields', () => {
    Object.values(SENSORS).forEach(cfg => {
      expect(cfg).toHaveProperty('label')
      expect(cfg).toHaveProperty('unit')
      expect(cfg).toHaveProperty('min')
      expect(cfg).toHaveProperty('max')
      expect(cfg).toHaveProperty('warningThreshold')
      expect(cfg).toHaveProperty('criticalThreshold')
      expect(cfg).toHaveProperty('normalRange')
      expect(cfg.normalRange).toHaveLength(2)
    })
  })

  it('pressure sensor has correct specs', () => {
    const p = SENSORS.PRESSURE
    expect(p.unit).toBe('bar')
    expect(p.min).toBe(0)
    expect(p.max).toBe(10)
    expect(p.warningThreshold).toBe(8)
    expect(p.criticalThreshold).toBe(9.5)
    expect(p.normalRange).toEqual([1, 5])
  })

  it('NPK sensors have same threshold config', () => {
    ;['NPK_NITROGEN', 'NPK_PHOSPHORUS', 'NPK_POTASSIUM'].forEach(key => {
      expect(SENSORS[key].warningThreshold).toBe(1500)
      expect(SENSORS[key].criticalThreshold).toBe(1800)
      expect(SENSORS[key].unit).toBe('mg/kg')
    })
  })
})

describe('getSensorStatus', () => {
  it('returns unknown for null/undefined/unknown type', () => {
    expect(getSensorStatus('PRESSURE', null)).toBe('unknown')
    expect(getSensorStatus('PRESSURE', undefined)).toBe('unknown')
    expect(getSensorStatus('UNKNOWN_TYPE', 5)).toBe('unknown')
  })

  it('returns normal for safe values', () => {
    expect(getSensorStatus('PRESSURE', 3)).toBe('normal')
    expect(getSensorStatus('NPK_NITROGEN', 500)).toBe('normal')
    expect(getSensorStatus('NPK_PHOSPHORUS', 300)).toBe('normal')
    expect(getSensorStatus('NPK_POTASSIUM', 400)).toBe('normal')
  })

  it('returns warning when at threshold', () => {
    expect(getSensorStatus('PRESSURE', 8)).toBe('warning')
    expect(getSensorStatus('NPK_NITROGEN', 1500)).toBe('warning')
  })

  it('returns warning for values between warning and critical', () => {
    expect(getSensorStatus('PRESSURE', 9)).toBe('warning')
    expect(getSensorStatus('NPK_NITROGEN', 1600)).toBe('warning')
  })

  it('returns critical for values at or above critical threshold', () => {
    expect(getSensorStatus('PRESSURE', 9.5)).toBe('critical')
    expect(getSensorStatus('NPK_NITROGEN', 1800)).toBe('critical')
    expect(getSensorStatus('NPK_NITROGEN', 1999)).toBe('critical')
  })

  it('returns normal for zero value', () => {
    expect(getSensorStatus('PRESSURE', 0)).toBe('normal')
  })

  it('handles boundary at max value', () => {
    expect(getSensorStatus('PRESSURE', 10)).toBe('critical')
  })
})

describe('STATUS_COLORS', () => {
  it('has entries for all statuses', () => {
    expect(STATUS_COLORS).toHaveProperty('normal')
    expect(STATUS_COLORS).toHaveProperty('warning')
    expect(STATUS_COLORS).toHaveProperty('critical')
    expect(STATUS_COLORS).toHaveProperty('unknown')
  })

  it('each status has required style fields', () => {
    Object.values(STATUS_COLORS).forEach(style => {
      expect(style).toHaveProperty('text')
      expect(style).toHaveProperty('border')
      expect(style).toHaveProperty('bg')
      expect(style).toHaveProperty('glow')
    })
  })

  it('normal status uses green', () => {
    expect(STATUS_COLORS.normal.text).toContain('green')
  })

  it('critical status uses red', () => {
    expect(STATUS_COLORS.critical.text).toContain('red')
  })
})
