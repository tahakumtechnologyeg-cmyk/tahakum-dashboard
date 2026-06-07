import { AlertTriangle, CheckCircle, X, Bell } from 'lucide-react'
import { SENSORS, getSensorStatus } from '../lib/thresholds'

function getAlerts(latest) {
  const alerts = []
  const ALERT_MSGS = {
    NPK_NITROGEN_warning: 'Nitrogen level elevated',
    NPK_NITROGEN_critical: 'CRITICAL NITROGEN — excessive fertilization',
    NPK_PHOSPHORUS_warning: 'Phosphorus level elevated',
    NPK_PHOSPHORUS_critical: 'CRITICAL PHOSPHORUS — environmental risk',
    NPK_POTASSIUM_warning: 'Potassium level elevated',
    NPK_POTASSIUM_critical: 'CRITICAL POTASSIUM — check soil conditions',
    PRESSURE_warning: 'Pressure elevated',
    PRESSURE_critical: 'CRITICAL PRESSURE — risk of pipe damage',
  }

  for (const [type, data] of Object.entries(latest)) {
    const status = getSensorStatus(type, data?.value)
    if (status === 'warning' || status === 'critical') {
      const key = `${type}_${status}`
      alerts.push({
        id: key,
        type,
        status,
        value: data?.value,
        unit: SENSORS[type]?.unit,
        label: SENSORS[type]?.label,
        message: ALERT_MSGS[key] || `${SENSORS[type]?.label} ${status} threshold exceeded`,
        time: data?.created_at,
      })
    }
  }

  return alerts.sort((a, b) => (a.status === 'critical' ? -1 : 1))
}

export default function AlertsPanel({ latest }) {
  const alerts = getAlerts(latest)

  if (alerts.length === 0) {
    return (
      <div className="card-hover bg-scada-panel border border-scada-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-scada-muted" />
          <span className="font-display text-xs font-bold tracking-widest text-scada-text">SYSTEM ALERTS</span>
        </div>
        <div className="flex items-center gap-3 py-4">
          <CheckCircle className="w-5 h-5 text-scada-green" />
          <div>
            <div className="font-mono text-sm text-scada-green font-bold">ALL SYSTEMS NORMAL</div>
            <div className="font-body text-xs text-scada-muted mt-0.5">No active alerts · All sensors within range</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-scada-red" />
          <span className="font-display text-xs font-bold tracking-widest text-scada-text">SYSTEM ALERTS</span>
        </div>
        <div className="flex items-center gap-2">
          {alerts.filter(a => a.status === 'critical').length > 0 && (
            <span className="px-2 py-0.5 bg-scada-red/20 border border-scada-red/40 rounded text-scada-red font-mono text-xs font-bold animate-pulse">
              {alerts.filter(a => a.status === 'critical').length} CRITICAL
            </span>
          )}
          {alerts.filter(a => a.status === 'warning').length > 0 && (
            <span className="px-2 py-0.5 bg-scada-amber/20 border border-scada-amber/40 rounded text-scada-amber font-mono text-xs font-bold">
              {alerts.filter(a => a.status === 'warning').length} WARN
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 px-3 py-3 rounded-lg border transition-all ${
              alert.status === 'critical'
                ? 'bg-scada-red/10 border-scada-red/30'
                : 'bg-scada-amber/10 border-scada-amber/30'
            }`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
              alert.status === 'critical' ? 'text-scada-red' : 'text-scada-amber'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-mono text-xs font-bold ${
                  alert.status === 'critical' ? 'text-scada-red' : 'text-scada-amber'
                }`}>
                  [{alert.label}]
                </span>
                <span className="font-mono text-xs text-white">{alert.message}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-display text-sm font-bold text-white">
                  {alert.value?.toFixed(2)} {alert.unit}
                </span>
                {alert.time && (
                  <span className="font-mono text-xs text-scada-muted">
                    {new Date(alert.time).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
