import { Droplets, Thermometer, Gauge, Activity, ArrowLeftRight, AlertTriangle, CheckCircle } from 'lucide-react'
import { SENSORS, getSensorStatus, STATUS_COLORS } from '../lib/thresholds'

const ICONS = { Droplets, Thermometer, Gauge, Activity, ArrowLeftRight }

export default function SensorCard({ sensorType, data }) {
  const cfg = SENSORS[sensorType]
  if (!cfg) return null

  const value = data?.value
  const status = getSensorStatus(sensorType, value)
  const colors = STATUS_COLORS[status]
  const Icon = ICONS[cfg.icon] || Activity

  const isAlert = status === 'warning' || status === 'critical'

  // Gauge bar fill percentage
  const pct = value !== null && value !== undefined
    ? Math.min(100, Math.max(0, ((value - cfg.min) / (cfg.max - cfg.min)) * 100))
    : 0

  const normalStart = ((cfg.normalRange[0] - cfg.min) / (cfg.max - cfg.min)) * 100
  const normalEnd = ((cfg.normalRange[1] - cfg.min) / (cfg.max - cfg.min)) * 100

  return (
    <div
      className={`relative bg-scada-panel border rounded-xl p-5 overflow-hidden transition-all duration-500 ${colors.border} ${colors.bg}`}
      style={{ boxShadow: isAlert ? colors.glow : '0 2px 16px rgba(0,0,0,0.4)' }}>

      {/* Animated border for critical */}
      {status === 'critical' && (
        <div className="absolute inset-0 rounded-xl border-2 border-scada-red/30 animate-pulse-slow pointer-events-none" />
      )}

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 ${
          status === 'critical' ? 'bg-scada-red' : status === 'warning' ? 'bg-scada-amber' : 'bg-scada-accent'
        }`} style={{ transform: 'translate(50%, -50%)' }} />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${colors.border} ${colors.bg}`}>
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          <div>
            <div className="font-display text-xs font-bold tracking-widest text-scada-text">
              {cfg.label}
            </div>
            <div className="font-body text-xs text-scada-muted mt-0.5">{cfg.description}</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-mono ${colors.border} ${colors.bg} ${colors.text}`}>
          {isAlert
            ? <AlertTriangle className="w-3 h-3" />
            : <CheckCircle className="w-3 h-3" />
          }
          <span className="hidden sm:inline">{status.toUpperCase()}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        {value !== null && value !== undefined ? (
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-3xl font-bold ${colors.text}`} style={{ textShadow: isAlert ? colors.glow : 'none' }}>
              {typeof value === 'number'
                ? value < 10 ? value.toFixed(3) : value < 100 ? value.toFixed(2) : value.toFixed(1)
                : '—'}
            </span>
            <span className="font-mono text-sm text-scada-muted">{cfg.unit}</span>
          </div>
        ) : (
          <div className="font-display text-3xl font-bold text-scada-muted">—</div>
        )}
        <div className="font-body text-xs text-scada-muted mt-1">{cfg.fullLabel}</div>
      </div>

      {/* Range bar */}
      <div className="space-y-1.5">
        <div className="relative h-2 rounded-full bg-scada-bg overflow-hidden">
          {/* Normal zone */}
          <div className="absolute h-full bg-scada-green/20 rounded-full"
            style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%` }} />
          {/* Value indicator */}
          <div className={`absolute h-full rounded-full transition-all duration-700 ${
            status === 'critical' ? 'bg-scada-red' : status === 'warning' ? 'bg-scada-amber' : 'bg-scada-green'
          }`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between font-mono text-xs text-scada-muted">
          <span>{cfg.min}</span>
          <span>Normal: {cfg.normalRange[0]}–{cfg.normalRange[1]} {cfg.unit}</span>
          <span>{cfg.max}</span>
        </div>
      </div>

      {/* Alert message */}
      {status === 'critical' && sensorType === 'DIFF_PRESSURE' && (
        <div className="mt-3 flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded px-3 py-2">
          <AlertTriangle className="w-3 h-3 text-scada-red shrink-0" />
          <span className="font-mono text-xs text-scada-red">FILTER CLOGGING — MAINTENANCE REQUIRED</span>
        </div>
      )}
      {status === 'critical' && sensorType === 'TDS' && (
        <div className="mt-3 flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded px-3 py-2">
          <AlertTriangle className="w-3 h-3 text-scada-red shrink-0" />
          <span className="font-mono text-xs text-scada-red">HIGH CONTAMINATION — CHECK SOURCE</span>
        </div>
      )}

      {/* Timestamp */}
      {data?.created_at && (
        <div className="mt-3 font-mono text-xs text-scada-muted/60">
          {new Date(data.created_at).toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
