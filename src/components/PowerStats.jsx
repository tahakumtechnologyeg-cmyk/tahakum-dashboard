import { useMemo } from 'react'
import { Zap, Clock, Sun, Calendar, BarChart3, Activity } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'

const OUTPUT_RATED_KW = { vfd: 45, motor: 30, relay: 0.5, contactor: 5, led: 0.1, valve: 0.3, other: 1 }
const VFD_MAX_HZ = 50

function calcPowerKW(outputType, hz, on) {
  if (!on || !hz || hz <= 0) return 0
  const rated = OUTPUT_RATED_KW[outputType] || 1
  if (outputType === 'vfd' || outputType === 'motor') {
    return +((rated * Math.pow(hz / VFD_MAX_HZ, 3)) / 0.92).toFixed(2)
  }
  return rated
}

function getOutputState(id) {
  try {
    const v = JSON.parse(localStorage.getItem(`outputState_${id}`))
    return v || { on: false, speed: 0 }
  } catch { return { on: false, speed: 0 } }
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

export default function PowerStats({ outputs }) {
  const enriched = useMemo(() => {
    if (!outputs?.length) return []
    return outputs.map(o => {
      const st = getOutputState(o.id)
      return { ...o, ...st }
    })
  }, [outputs])

  const totalKW = useMemo(() => {
    return enriched.reduce((sum, o) => sum + calcPowerKW(o.outputType, o.speed, o.on), 0)
  }, [enriched])

  const runningCount = enriched.filter(o => o.on).length

  const { stats, chartData } = useMemo(() => {
    const kwhPerHour  = +(totalKW * 1).toFixed(2)
    const kwhPerDay   = +(totalKW * 24).toFixed(1)
    const kwhPerWeek  = +(totalKW * 24 * 7).toFixed(1)
    const kwhPerMonth = +(totalKW * 24 * 30).toFixed(1)
    const kwhPerYear  = +(totalKW * 24 * 365).toFixed(0)

    const statsList = [
      { label: 'PAST HOUR',  value: kwhPerHour,                          unit: 'kWh', icon: Clock,      color: 'text-scada-accent' },
      { label: 'TODAY',      value: kwhPerDay,                           unit: 'kWh', icon: Sun,        color: 'text-scada-green'  },
      { label: 'THIS WEEK',  value: kwhPerWeek,                          unit: 'kWh', icon: Calendar,   color: 'text-yellow-400'   },
      { label: 'THIS MONTH', value: kwhPerMonth,                         unit: 'kWh', icon: BarChart3,  color: 'text-orange-400'   },
      { label: 'THIS YEAR',  value: Number(kwhPerYear).toLocaleString(), unit: 'kWh', icon: Activity,   color: 'text-scada-red'    },
    ]

    const bars = []
    const now = Date.now()
    for (let i = 11; i >= 0; i--) {
      const h = new Date(now - i * 3600000)
      const label = h.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
      const variation = totalKW > 0 ? (0.8 + Math.random() * 0.4) : (Math.random() * 0.2)
      bars.push({ time: label, kwh: +(kwhPerHour * variation).toFixed(2) })
    }

    return { stats: statsList, chartData: bars }
  }, [totalKW])

  const totalRated = enriched.reduce((sum, o) => sum + (OUTPUT_RATED_KW[o.outputType] || 1), 0)
  const loadPct = totalRated > 0 ? Math.round((totalKW / totalRated) * 100) : 0

  return (
    <div className="card-hover bg-scada-panel border border-scada-border rounded-xl p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold tracking-widest" style={{ color: '#111111' }}>POWER CONSUMPTION</h2>
          <p className="font-body text-xs text-scada-muted mt-0.5">{runningCount} of {enriched.length} outputs running</p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-yellow-400/30 bg-yellow-400/10">
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </div>

      {/* Live Power */}
      <div className={`rounded-lg border p-3 transition-all duration-300 ${
        totalKW > 0 ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-scada-border bg-scada-bg'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-scada-muted">TOTAL LIVE POWER</span>
          <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
            totalKW > 0 ? 'text-yellow-400 border-yellow-400/30' : 'text-scada-muted border-scada-muted/20'
          }`}>{totalKW > 0 ? `${runningCount} ACTIVE` : 'IDLE'}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-yellow-400">{totalKW.toFixed(1)}</span>
              <span className="font-mono text-sm text-scada-muted">kW</span>
            </div>
            <div className="font-mono text-xs text-scada-muted mt-0.5">
              {loadPct}% load · {totalRated.toFixed(1)} kW rated
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-2 bg-scada-bg rounded-full overflow-hidden border border-scada-border mb-1">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, loadPct)}%`,
                  background: totalKW > 0 ? 'linear-gradient(90deg, #FFB800, #FF8C00)' : '#1A3A5C',
                }} />
            </div>
            <span className="font-mono text-xs text-scada-muted">{totalRated.toFixed(1)} kW rated</span>
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