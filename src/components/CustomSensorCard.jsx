import { Trash2, Gauge } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

export default function CustomSensorCard({ sensor, onDelete }) {
  const { t, isRTL } = useI18n()

  return (
    <div className="card-hover relative bg-scada-panel border border-scada-border rounded-xl p-5 overflow-hidden transition-all duration-500 shadow-sm">
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 bg-primary"
          style={{ transform: 'translate(50%, -50%)' }} />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border border-primary/40 bg-primary/10">
            <Gauge className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-display text-xs font-bold tracking-widest text-scada-text">
              {sensor.name}
            </div>
            <div className="font-body text-xs text-scada-muted mt-0.5">
              {t('dashboard.customSensor')}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(sensor.id)}
          className="p-1.5 rounded-lg text-scada-muted/40 hover:text-scada-red/70 hover:bg-scada-red/10 transition-colors"
          title={t('dashboard.deleteSensor')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-primary">
            —
          </span>
          <span className="font-mono text-sm text-scada-muted">{sensor.unit}</span>
        </div>
        <div className="font-body text-xs text-scada-muted mt-1">
          {sensor.rangeMin} – {sensor.rangeMax} {sensor.unit}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="relative h-2 rounded-full bg-scada-bg overflow-hidden">
          <div className="absolute h-full rounded-full bg-primary/30"
            style={{ width: '50%' }} />
        </div>
        <div className="flex justify-between font-mono text-xs text-scada-muted">
          <span>{sensor.rangeMin}</span>
          <span>{sensor.unit}</span>
          <span>{sensor.rangeMax}</span>
        </div>
      </div>
    </div>
  )
}
