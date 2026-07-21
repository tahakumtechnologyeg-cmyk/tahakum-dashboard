import { Trash2, Power, Cpu, ToggleLeft, Lightbulb, Gauge, Pipette, Box } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

const TYPE_CONFIG = {
  vfd: { icon: Cpu, color: 'text-scada-accent', bg: 'bg-scada-accent/10', border: 'border-scada-accent/40' },
  relay: { icon: ToggleLeft, color: 'text-scada-green', bg: 'bg-scada-green/10', border: 'border-scada-green/40' },
  contactor: { icon: Power, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40' },
  led: { icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/40' },
  motor: { icon: Gauge, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/40' },
  valve: { icon: Pipette, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/40' },
  other: { icon: Box, color: 'text-scada-muted', bg: 'bg-scada-dim/20', border: 'border-scada-border' },
}

export default function OutputCard({ output, onDelete }) {
  const { t } = useI18n()
  const cfg = TYPE_CONFIG[output.type] || TYPE_CONFIG.other
  const Icon = cfg.icon

  return (
    <div className="card-hover bg-scada-panel border border-scada-border rounded-xl p-5 overflow-hidden transition-all duration-500 shadow-sm">
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 ${cfg.color.replace('text-', 'bg-')}`}
          style={{ transform: 'translate(50%, -50%)' }} />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${cfg.border} ${cfg.bg}`}>
            <Icon className={`w-4 h-4 ${cfg.color}`} />
          </div>
          <div>
            <div className="font-display text-xs font-bold tracking-widest text-scada-text">
              {output.name}
            </div>
            <div className="font-body text-xs text-scada-muted mt-0.5">
              {t(`dashboard.outputType${output.type.charAt(0).toUpperCase() + output.type.slice(1)}`)}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(output.id)}
          className="p-1.5 rounded-lg text-scada-muted/40 hover:text-scada-red/70 hover:bg-scada-red/10 transition-colors"
          title={t('dashboard.deleteOutput')}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold tracking-wider ${cfg.border} ${cfg.bg} ${cfg.color}`}>
          {output.type.toUpperCase()}
        </div>
        <span className="font-mono text-xs text-scada-muted">
          {t('dashboard.customOutput')}
        </span>
      </div>
    </div>
  )
}
