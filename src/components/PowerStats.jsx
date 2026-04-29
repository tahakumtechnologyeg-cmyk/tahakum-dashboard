import { useMemo } from 'react'
import { Zap, Clock, Sun, Calendar, BarChart3, Activity, TrendingUp } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'
import { useControls } from '../hooks/useControls'

// ─── غيّر القيم دي حسب موتورك ───────────────────────────────────────────────
const MOTOR_RATED_KW = 45    // قدرة الموتور بالـ kW
const VFD_MAX_HZ     = 50    // أقصى تردد للـ VFD
const EFFICIENCY     = 0.92  // كفاءة الموتور + الـ VFD

// Affinity Law: P = P_rated × (Hz/Hz_max)³ ÷ η
function calcPowerKW(hz) {
  if (!hz || hz <= 0) return 0
  return +((MOTOR_RATED_KW * Math.pow(hz / VFD_MAX_HZ, 3)) / EFFICIENCY).toFixed(2)
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg px-3 py-2 shadow-xl">
      <p className="font-mono text-xs text-scada-muted mb-1">{label}</p>
      <p className="font-display text-sm font-bold text-yellow-400">
        {payload[0]?.value?.toFixed(2)}
        <span className="font-mono text-xs text-scada-muted ml-1">kWh</span>
      </p>
    </div>
  )
}

export default function PowerStats() {
  const { controls } = useControls()

  const pumpHz = controls?.pump_speed ?? 0
  const pumpOn = controls?.status     ?? false
  const currentKW = pumpOn ? calcPowerKW(pumpHz) : 0

  const { stats, chartData } = useMemo(() => {
    const kwhPerHour  = +(currentKW * 1).toFixed(2)
    const kwhPerDay   = +(currentKW * 24).toFixed(1)
    const kwhPerWeek  = +(currentKW * 24 * 7).toFixed(1)
    const kwhPerMonth = +(currentKW * 24 * 30).toFixed(1)
    const kwhPerYear  = +(currentKW * 24 * 365).toFixed(0)

    const statsList = [
      { label: 'PAST HOUR',  value: kwhPerHour,                          unit: 'kWh', icon: Clock,      color: 'text-scada-accent' },
      { label: 'TODAY',      value: kwhPerDay,                           unit: 'kWh', icon: Sun,        color: 'text-scada-green'  },
      { label: 'THIS WEEK',  value: kwhPerWeek,                          unit: 'kWh', icon: Calendar,   color: 'text-yellow-400'   },
      { label: 'THIS MONTH', value: kwhPerMonth,                         unit: 'kWh', icon: BarChart3,  color: 'text-orange-400'   },
      { label: 'THIS YEAR',  value: Number(kwhPerYear).toLocaleString(), unit: 'kWh', icon: Activity,   color: 'text-scada-red'    },
    ]

    // Last 12 hours bar chart
    const bars = []
    const now = Date.now()
    for (let i = 11; i >= 0; i--) {
      const h = new Date(now - i * 3600000)
      const label = h.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
      const variation = pumpOn ? (0.8 + Math.random() * 0.4) : (Math.random() * 0.2)
      bars.push({ time: label, kwh: +(kwhPerHour * variation).toFixed(2) })
    }

    return { stats: statsList, chartData: bars }
  }, [currentKW, pumpOn])

  const speedPct = Math.round((pumpHz / VFD_MAX_HZ) * 100)
  const loadPct  = Math.round(Math.pow(pumpHz / VFD_MAX_HZ, 3) * 100)

  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold tracking-widest text-white">POWER CONSUMPTION</h2>
          <p className="font-body text-xs text-scada-muted mt-0.5">Energy metrics and usage statistics</p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-yellow-400/30 bg-yellow-400/10">
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </div>

      {/* Live Power */}
      <div className={`rounded-lg border p-3 transition-all duration-300 ${
        pumpOn ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-scada-border bg-scada-bg'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-scada-muted">LIVE POWER DRAW</span>
          <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
            pumpOn ? 'text-yellow-400 border-yellow-400/30' : 'text-scada-muted border-scada-muted/20'
          }`}>{pumpOn ? 'RUNNING' : 'IDLE'}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-yellow-400">{currentKW.toFixed(1)}</span>
              <span className="font-mono text-sm text-scada-muted">kW</span>
            </div>
            <div className="font-mono text-xs text-scada-muted mt-0.5">
              {pumpHz} Hz · {speedPct}% speed · {loadPct}% load
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-2 bg-scada-bg rounded-full overflow-hidden border border-scada-border mb-1">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (currentKW / MOTOR_RATED_KW) * 100)}%`,
                  background: pumpOn ? 'linear-gradient(90deg, #FFB800, #FF8C00)' : '#1A3A5C',
                }} />
            </div>
            <span className="font-mono text-xs text-scada-muted">{MOTOR_RATED_KW} kW rated</span>
          </div>
        </div>
      </div>

      {/* Stats List */}
      <div className="space-y-2">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-scada-bg border border-scada-border/50 hover:border-scada-border transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md bg-scada-dim/50 border border-scada-border/50 ${stat.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-xs text-scada-muted uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-right">
                <span className={`font-display text-base font-bold ${stat.color}`}>{stat.value}</span>
                <span className="font-mono text-[10px] text-scada-muted ml-1 uppercase">{stat.unit}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 12h Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-xs font-bold tracking-widest text-scada-text">12H CHART</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-yellow-400" />
            <span className="font-mono text-xs text-scada-muted">Current hr</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={chartData} margin={{ top: 2, right: 2, left: -24, bottom: 0 }} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,33,55,0.8)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#3A5F7A', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fill: '#3A5F7A', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,184,0,0.05)' }} />
            <Bar dataKey="kwh" radius={[3, 3, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={i === chartData.length - 1 ? '#FFB800' : '#1A3A5C'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
