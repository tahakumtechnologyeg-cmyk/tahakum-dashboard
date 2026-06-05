import { useState, useEffect, useRef } from 'react'
import { Bell, AlertTriangle, CheckCircle, Power, Zap, Droplets, Thermometer, Leaf, Sprout, Flower2, Trash2, BellOff } from 'lucide-react'
import { SENSORS, getSensorStatus } from '../lib/thresholds'
import { useControls } from '../hooks/useControls'
import AlertsPanel from './AlertsPanel'

const SENSOR_ICONS = {
  LY485_TEMP: Thermometer,
  LY485_HUM: Droplets,
  NPK_NITROGEN: Leaf,
  NPK_PHOSPHORUS: Sprout,
  NPK_POTASSIUM: Flower2,
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  if (isToday) return 'Today ' + formatTime(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' · ' + formatTime(iso)
}

// build sensor alerts from latest telemetry
function buildSensorAlerts(latest) {
  const ALERT_MSGS = {
    LY485_TEMP_warning: 'Temperature elevated',
    LY485_TEMP_critical: 'CRITICAL TEMPERATURE',
    LY485_HUM_warning: 'Humidity above normal range',
    LY485_HUM_critical: 'CRITICAL HUMIDITY — condensation risk',
    NPK_NITROGEN_warning: 'Nitrogen level elevated',
    NPK_NITROGEN_critical: 'CRITICAL NITROGEN',
    NPK_PHOSPHORUS_warning: 'Phosphorus level elevated',
    NPK_PHOSPHORUS_critical: 'CRITICAL PHOSPHORUS',
    NPK_POTASSIUM_warning: 'Potassium level elevated',
    NPK_POTASSIUM_critical: 'CRITICAL POTASSIUM',
  }

  const alerts = []
  for (const [type, data] of Object.entries(latest)) {
    const status = getSensorStatus(type, data?.value)
    if (status === 'warning' || status === 'critical') {
      const key = `${type}_${status}`
      alerts.push({
        id: `sensor_${key}_${data?.created_at || Date.now()}`,
        category: 'sensor',
        type,
        status,
        value: data?.value,
        unit: SENSORS[type]?.unit,
        label: SENSORS[type]?.label,
        fullLabel: SENSORS[type]?.fullLabel,
        message: ALERT_MSGS[key] || `${SENSORS[type]?.label} ${status} threshold exceeded`,
        time: data?.created_at || new Date().toISOString(),
        live: true,
      })
    }
  }
  return alerts.sort((a, b) => (a.status === 'critical' ? -1 : 1))
}

// build motor/pump alerts from controls state
function buildMotorAlerts(controls, prevControls) {
  const events = []
  if (!controls) return events

  if (prevControls && controls.status !== prevControls.status) {
    events.push({
      id: `motor_${controls.status ? 'on' : 'off'}_${Date.now()}`,
      category: 'motor',
      status: controls.status ? 'info' : 'warning',
      label: 'PUMP',
      message: controls.status ? 'Pump started — motor running' : 'Pump stopped — motor offline',
      time: new Date().toISOString(),
      live: true,
    })
  }

  return events
}

const STATUS_STYLES = {
  critical: {
    border: 'rgba(185,64,64,0.4)',
    bg: 'rgba(185,64,64,0.1)',
    iconColor: '#ff5252',
    labelColor: '#ff5252',
    badge: { bg: 'rgba(185,64,64,0.2)', border: 'rgba(185,64,64,0.5)', color: '#ff8a80', text: 'CRITICAL' },
  },
  warning: {
    border: 'rgba(255,184,0,0.35)',
    bg: 'rgba(255,184,0,0.08)',
    iconColor: '#ffb800',
    labelColor: '#ffb800',
    badge: { bg: 'rgba(255,184,0,0.15)', border: 'rgba(255,184,0,0.4)', color: '#ffd54f', text: 'WARNING' },
  },
  info: {
    border: 'rgba(100,210,255,0.3)',
    bg: 'rgba(100,210,255,0.07)',
    iconColor: '#64d2ff',
    labelColor: '#64d2ff',
    badge: { bg: 'rgba(100,210,255,0.12)', border: 'rgba(100,210,255,0.35)', color: '#64d2ff', text: 'INFO' },
  },
}

function NotifCard({ notif, onDismiss }) {
  const style = STATUS_STYLES[notif.status] || STATUS_STYLES.info
  const SensorIcon = notif.category === 'sensor' ? (SENSOR_ICONS[notif.type] || Bell) : Power

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '14px 16px', borderRadius: 12,
        border: `1px solid ${style.border}`,
        background: style.bg,
        marginBottom: 10,
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: `${style.iconColor}18`,
        border: `1px solid ${style.iconColor}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {notif.status === 'critical' ? (
          <AlertTriangle style={{ width: 16, height: 16, color: style.iconColor }} />
        ) : notif.category === 'motor' ? (
          <Power style={{ width: 15, height: 15, color: style.iconColor }} />
        ) : (
          <SensorIcon style={{ width: 15, height: 15, color: style.iconColor }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', color: style.labelColor,
          }}>
            [{notif.label || 'MOTOR'}]
          </span>
          <span style={{
            padding: '1px 7px', borderRadius: 5,
            background: style.badge.bg, border: `1px solid ${style.badge.border}`,
            fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.06em', color: style.badge.color,
          }}>
            {style.badge.text}
          </span>
          {notif.live && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: style.iconColor, display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>LIVE</span>
            </span>
          )}
        </div>

        <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.88)', marginBottom: 5 }}>
          {notif.message}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {notif.value !== undefined && notif.value !== null && (
            <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {typeof notif.value === 'number' ? notif.value.toFixed(2) : notif.value} {notif.unit || ''}
            </span>
          )}
          {notif.fullLabel && (
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              {notif.fullLabel}
            </span>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>
            {formatDate(notif.time)}
          </span>
        </div>
      </div>

      {/* Dismiss */}
      {!notif.live && (
        <button
          onClick={() => onDismiss(notif.id)}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, borderRadius: 6,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          title="Dismiss"
        >
          <Trash2 style={{ width: 13, height: 13 }} />
        </button>
      )}
    </div>
  )
}

export default function NotificationsPage({ latest = {} }) {
  const { controls } = useControls()
  const prevControlsRef = useRef(null)
  const [motorHistory, setMotorHistory] = useState([])
  const [dismissed, setDismissed] = useState(new Set())

  // Track pump status changes and log them
  useEffect(() => {
    if (!controls) return
    const prev = prevControlsRef.current
    const newEvents = buildMotorAlerts(controls, prev)
    if (newEvents.length > 0) {
      setMotorHistory(h => [...newEvents, ...h].slice(0, 50))
    }
    prevControlsRef.current = controls
  }, [controls?.status])

  const liveAlerts = buildSensorAlerts(latest)
  const allMotorAlerts = motorHistory.filter(n => !dismissed.has(n.id))

  // Combine: live sensor alerts first, then motor history
  const allNotifications = [
    ...liveAlerts,
    ...allMotorAlerts,
  ]

  function dismiss(id) {
    setDismissed(prev => new Set([...prev, id]))
  }

  function clearHistory() {
    setDismissed(new Set(motorHistory.map(n => n.id)))
  }

  const criticalCount = liveAlerts.filter(a => a.status === 'critical').length
  const warningCount = liveAlerts.filter(a => a.status === 'warning').length

  return (
    <div>
      {/* Header summary bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderRadius: 14, marginBottom: 20,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell style={{ width: 16, height: 16, color: '#64d2ff' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#FBF7EF' }}>
            NOTIFICATION CENTER
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {criticalCount > 0 && (
            <span style={{
              padding: '2px 10px', borderRadius: 6,
              background: 'rgba(185,64,64,0.2)', border: '1px solid rgba(185,64,64,0.45)',
              fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
              color: '#ff8a80', letterSpacing: '0.06em', animation: 'pulse 2s infinite',
            }}>
              {criticalCount} CRITICAL
            </span>
          )}
          {warningCount > 0 && (
            <span style={{
              padding: '2px 10px', borderRadius: 6,
              background: 'rgba(255,184,0,0.15)', border: '1px solid rgba(255,184,0,0.4)',
              fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
              color: '#ffd54f', letterSpacing: '0.06em',
            }}>
              {warningCount} WARN
            </span>
          )}
          {allNotifications.length === 0 && (
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              All clear
            </span>
          )}
        </div>
      </div>

      {/* System Alerts panel (full widget) */}
      <div style={{ marginBottom: 24 }}>
        <AlertsPanel latest={latest} />
      </div>

      {/* Live sensor alerts */}
      {liveAlerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
            paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <AlertTriangle style={{ width: 13, height: 13, color: '#ffb800' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)' }}>
              LIVE SENSOR ALERTS
            </span>
          </div>
          {liveAlerts.map(n => (
            <NotifCard key={n.id} notif={n} onDismiss={() => {}} />
          ))}
        </div>
      )}

      {/* Motor / pump event history */}
      {allMotorAlerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Power style={{ width: 13, height: 13, color: '#64d2ff' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)' }}>
                MOTOR / PUMP EVENTS
              </span>
            </div>
            <button
              onClick={clearHistory}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 7, padding: '4px 10px', cursor: 'pointer',
                fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >
              <Trash2 style={{ width: 11, height: 11 }} /> Clear
            </button>
          </div>
          {allMotorAlerts.map(n => (
            <NotifCard key={n.id} notif={n} onDismiss={dismiss} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {allNotifications.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '56px 24px', textAlign: 'center',
          background: 'rgba(255,255,255,0.04)', borderRadius: 16,
          border: '1px dashed rgba(255,255,255,0.15)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, marginBottom: 20,
            background: 'rgba(100,210,255,0.08)', border: '1px solid rgba(100,210,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BellOff style={{ width: 24, height: 24, color: 'rgba(100,210,255,0.6)' }} />
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#FBF7EF', marginBottom: 8 }}>
            ALL SYSTEMS NORMAL
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', maxWidth: 280, lineHeight: 1.6 }}>
            No active alerts · All sensors within normal range · Motor operating normally
          </div>
        </div>
      )}
    </div>
  )
}

// Export badge count helper for the Drawer
export function getNotifCount(latest, controls) {
  const sensorAlerts = Object.entries(latest || {}).filter(([type, data]) => {
    const s = getSensorStatus(type, data?.value)
    return s === 'warning' || s === 'critical'
  }).length
  return sensorAlerts
}
