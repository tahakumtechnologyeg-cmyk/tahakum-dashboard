import { useState, useEffect, useRef } from 'react'
import { Trash2, Power, Cpu, ToggleLeft, Lightbulb, Gauge, Pipette, Box, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

const TYPE_CONFIG = {
  vfd:       { icon: Cpu,       color: 'text-scada-accent', bg: 'bg-scada-accent/10',  border: 'border-scada-accent/40' },
  relay:     { icon: ToggleLeft, color: 'text-scada-green',  bg: 'bg-scada-green/10',   border: 'border-scada-green/40' },
  contactor: { icon: Power,      color: 'text-primary',      bg: 'bg-primary/10',       border: 'border-primary/40' },
  led:       { icon: Lightbulb,  color: 'text-amber-400',    bg: 'bg-amber-400/10',     border: 'border-amber-400/40' },
  motor:     { icon: Gauge,      color: 'text-cyan-400',     bg: 'bg-cyan-400/10',      border: 'border-cyan-400/40' },
  valve:     { icon: Pipette,    color: 'text-blue-400',     bg: 'bg-blue-400/10',      border: 'border-blue-400/40' },
  other:     { icon: Box,        color: 'text-scada-muted',  bg: 'bg-scada-dim/20',     border: 'border-scada-border' },
}

const HAS_SPEED = ['vfd', 'motor']
const HAS_DIRECTION = ['motor', 'vfd']

export default function OutputCard({ output, onDelete }) {
  const { t } = useI18n()
  const cfg = TYPE_CONFIG[output.outputType] || TYPE_CONFIG.other
  const Icon = cfg.icon

  const [on, setOn] = useState(false)
  const [speed, setSpeed] = useState(output.outputType === 'vfd' ? 25 : 0)
  const [direction, setDirection] = useState('forward')
  const [daily, setDaily] = useState(0)
  const [weekly, setWeekly] = useState(0)
  const [monthly, setMonthly] = useState(0)

  const intervalRef = useRef(null)

  useEffect(() => {
    if (on) {
      intervalRef.current = setInterval(() => {
        setDaily(d => +(d + Math.random() * 0.15).toFixed(2))
        setWeekly(w => +(w + Math.random() * 0.15).toFixed(2))
        setMonthly(m => +(m + Math.random() * 0.15).toFixed(2))
      }, 3000)
    } else {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => clearInterval(intervalRef.current)
  }, [on])

  const freqPct = HAS_SPEED.includes(output.outputType) ? Math.round((speed / 50) * 100) : 0

  return (
    <div className={`card-hover bg-scada-panel border rounded-xl overflow-hidden transition-all duration-500 shadow-sm ${on ? 'border-scada-green/30' : 'border-scada-border'}`}
      style={on ? { boxShadow: '0 0 20px rgba(34,197,94,0.12)' } : {}}>
      {/* ── Header ── */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${cfg.border} ${cfg.bg}`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>
            <div>
              <div className="font-display text-xs font-bold tracking-widest text-scada-text">{output.name}</div>
              <div className="font-body text-xs text-scada-muted mt-0.5">
                {t(`dashboard.outputType${output.outputType.charAt(0).toUpperCase() + output.outputType.slice(1)}`)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider ${on ? 'bg-scada-green/10 text-scada-green border border-scada-green/30' : 'bg-scada-dim/20 text-scada-muted border border-scada-border'}`}>
              {on ? t('dashboard.powerOn') : t('dashboard.powerOff')}
            </span>
            <button onClick={() => onDelete(output.id)}
              className="p-1.5 rounded-lg text-scada-muted/40 hover:text-scada-red/70 hover:bg-scada-red/10 transition-colors"
              title={t('dashboard.deleteOutput')}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Power toggle + direction + speed ── */}
        <div className="flex items-center gap-3 mb-4">
          {/* Power button */}
          <button onClick={() => setOn(o => !o)}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
              on ? 'bg-scada-green/10 border-scada-green/40 text-scada-green' : 'bg-scada-dim/20 border-scada-border text-scada-muted'
            }`}>
            <Power className={`w-5 h-5 ${on ? 'animate-pulse' : ''}`} />
          </button>

          {/* Direction (motor/vfd) */}
          {HAS_DIRECTION.includes(output.outputType) && (
            <div className="flex rounded-lg border border-scada-border overflow-hidden">
              <button onClick={() => setDirection('forward')}
                className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider transition-colors ${
                  direction === 'forward' ? 'bg-scada-green/10 text-scada-green' : 'text-scada-muted hover:text-scada-text'
                }`}>
                {t('dashboard.forward')}
              </button>
              <button onClick={() => setDirection('reverse')}
                className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider border-x border-scada-border transition-colors ${
                  direction === 'reverse' ? 'bg-scada-amber/10 text-scada-amber' : 'text-scada-muted hover:text-scada-text'
                }`}>
                {t('dashboard.reverse')}
              </button>
            </div>
          )}

          {/* Type badge */}
          <div className={`px-2.5 py-1.5 rounded-lg border font-mono text-[10px] font-bold tracking-wider ${cfg.border} ${cfg.bg} ${cfg.color}`}>
            {output.outputType.toUpperCase()}
          </div>
        </div>

        {/* ── Speed slider (motor/vfd) ── */}
        {HAS_SPEED.includes(output.outputType) && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-scada-muted">{t('dashboard.speed')}</span>
              <span className="font-display text-lg font-bold text-scada-accent">{speed}<span className="font-mono text-xs text-scada-muted ml-1">Hz</span></span>
            </div>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={50} step={0.5} value={speed}
                onChange={e => setSpeed(parseFloat(e.target.value))}
                disabled={!on}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, var(--accent-primary) ${freqPct}%, var(--bg-inset) ${freqPct}%)`,
                }} />
              <div className="flex items-center border border-scada-border rounded-lg overflow-hidden shrink-0">
                <button onClick={() => setSpeed(s => Math.max(0, +(s - 0.5).toFixed(1)))}
                  className="px-2 py-1.5 text-scada-muted hover:text-scada-text hover:bg-scada-dim transition-colors">
                  <ChevronDown className="w-3 h-3" />
                </button>
                <input type="number" min={0} max={50} step={0.5} value={speed}
                  onChange={e => setSpeed(Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-12 bg-transparent text-center font-mono text-xs text-scada-text focus:outline-none py-1.5" />
                <button onClick={() => setSpeed(s => Math.min(50, +(s + 0.5).toFixed(1)))}
                  className="px-2 py-1.5 text-scada-muted hover:text-scada-text hover:bg-scada-dim transition-colors">
                  <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </div>
            {on && <div className="mt-1.5 h-1 rounded-full bg-scada-bg overflow-hidden">
              <div className="h-full bg-scada-accent rounded-full animate-pulse" style={{ width: `${freqPct}%` }} />
            </div>}
          </div>
        )}

        {/* ── Consumption stats ── */}
        <div>
          <div className="font-mono text-[10px] font-bold tracking-widest text-scada-muted mb-2">{t('dashboard.consumption')}</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: t('dashboard.daily'),   value: daily,   color: 'text-cyan-400' },
              { label: t('dashboard.weekly'),  value: weekly,  color: 'text-scada-accent' },
              { label: t('dashboard.monthly'), value: monthly, color: 'text-scada-green' },
            ].map(s => (
              <div key={s.label} className="bg-scada-bg rounded-lg px-3 py-2 text-center">
                <div className="font-mono text-[10px] text-scada-muted mb-0.5">{s.label}</div>
                <div className={`font-display text-sm font-bold ${s.color}`}>
                  {s.value}
                  <span className="font-mono text-[10px] text-scada-muted ml-0.5">kWh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
