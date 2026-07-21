import { describe, it, expect } from 'vitest'
import { SENSORS, getSensorStatus } from './thresholds'

describe('Performance: getSensorStatus', () => {
  const TYPES = Object.keys(SENSORS)
  const VALUES = [0, 1, 50, 100, 500, 1000, 1500, 1800, 1999, null, undefined]

  it('completes 1000 iterations in under 10ms', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      const t = TYPES[i % TYPES.length]
      const v = VALUES[i % VALUES.length]
      getSensorStatus(t, v)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(10)
  })
})

describe('Performance: SENSORS lookup', () => {
  it('completes 10000 lookups in under 5ms', () => {
    const keys = Object.keys(SENSORS)
    const start = performance.now()
    for (let i = 0; i < 10000; i++) {
      const _ = SENSORS[keys[i % keys.length]]
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5)
  })
})

describe('Performance: React renders', () => {
  it('SensorCard renders in under 200ms', async () => {
    const React = await import('react')
    const { render } = await import('@testing-library/react')
    const SensorCard = (await import('../components/SensorCard')).default

    const start = performance.now()
    const { unmount } = render(
      React.createElement(SensorCard, {
        sensorType: 'NPK_NITROGEN',
        data: { value: 750, created_at: new Date().toISOString() },
      })
    )
    const elapsed = performance.now() - start
    unmount()
    expect(elapsed).toBeLessThan(200)
  })

  it('OutputCard renders in under 200ms', async () => {
    const React = await import('react')
    const { render } = await import('@testing-library/react')
    const { I18nProvider } = await import('../i18n/I18nContext')
    const OutputCard = (await import('../components/OutputCard')).default

    const start = performance.now()
    const { unmount } = render(
      React.createElement(I18nProvider, null,
        React.createElement(OutputCard, {
          output: { id: 'test', outputType: 'vfd', name: 'Test Pump' },
          onDelete: () => {},
        })
      )
    )
    const elapsed = performance.now() - start
    unmount()
    expect(elapsed).toBeLessThan(200)
  })
})

describe('localStorage read/write performance', () => {
  beforeEach(() => localStorage.clear())

  it('writes and reads 100 sensor entries in under 20ms', () => {
    const data = Array.from({ length: 100 }, (_, i) => ({
      id: `sensor_${i}`,
      name: `Sensor ${i}`,
      builtIn: false,
      unit: 'unit',
      min: 0, max: 100,
    }))

    const start = performance.now()
    localStorage.setItem('test_sensors', JSON.stringify(data))
    const read = JSON.parse(localStorage.getItem('test_sensors'))
    const elapsed = performance.now() - start

    expect(read).toHaveLength(100)
    expect(elapsed).toBeLessThan(20)
  })

  it('handles 50 output entries under 10ms', () => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      id: `output_${i}`,
      name: `Output ${i}`,
      outputType: 'relay',
      builtIn: false,
    }))

    const start = performance.now()
    localStorage.setItem('test_outputs', JSON.stringify(data))
    const read = JSON.parse(localStorage.getItem('test_outputs'))
    const elapsed = performance.now() - start

    expect(read).toHaveLength(50)
    expect(elapsed).toBeLessThan(10)
  })
})

describe('i18n translation performance', () => {
  it('1000 translations complete in under 5ms', async () => {
    const { I18nProvider, useI18n } = await import('../i18n/I18nContext')
    const React = await import('react')
    const { render } = await import('@testing-library/react')

    let tFn
    function Grabber() {
      const { t } = useI18n()
      tFn = t
      return null
    }

    render(React.createElement(I18nProvider, null, React.createElement(Grabber)))

    const keys = ['dashboard.title', 'dashboard.sensors', 'auth.signIn', 'nav.control', 'support.contactUs', 'dashboard.consumption']
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      tFn(keys[i % keys.length])
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5)
  })
})

describe('buildSensorAlerts performance', () => {
  it('processes 100 sensor readings in under 5ms', async () => {
    const { buildSensorAlerts } = await import('../components/NotificationsPage')

    const data = {}
    for (let i = 0; i < 25; i++) {
      data[`PRESSURE_${i}`] = { value: 3 + Math.random() * 8, created_at: new Date().toISOString() }
    }

    const start = performance.now()
    for (let i = 0; i < 4; i++) {
      buildSensorAlerts(data)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5)
  })
})
