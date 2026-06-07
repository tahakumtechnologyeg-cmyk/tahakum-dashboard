import { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts'
import { SENSORS } from '../lib/thresholds'

const NPK_COLORS = ['#00E676', '#FF6B35', '#00D4FF']
const COLOR_MAP = {}
let colorIdx = 0
function getColor(sensorType) {
  if (!COLOR_MAP[sensorType]) {
    COLOR_MAP[sensorType] = NPK_COLORS[colorIdx++ % NPK_COLORS.length]
  }
  return { stroke: COLOR_MAP[sensorType], fill: COLOR_MAP[sensorType] }
}

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg px-3 py-2 shadow-xl">
      <p className="font-mono text-xs text-scada-muted mb-1">{label}</p>
      <p className="font-display text-base font-bold text-white">
        {payload[0]?.value?.toFixed(2)}
        <span className="font-mono text-xs text-scada-muted ml-1">{unit}</span>
      </p>
    </div>
  )
}

export default function LiveChart({ sensorType, data, title }) {
  const cfg = SENSORS[sensorType]
  const color = getColor(sensorType)

  const chartData = useMemo(() =>
    (data || []).map(d => ({
      time: new Date(d.time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: d.value,
    })),
    [data]
  )

  const minVal = cfg ? cfg.min : 0
  const maxVal = cfg ? cfg.max : 100
  const warnLine = cfg?.warningThreshold
  const critLine = cfg?.criticalThreshold

  return (
    <div className="card-hover bg-scada-panel border border-scada-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-sm font-bold tracking-widest text-scada-text">{title}</h3>
          <p className="font-body text-xs text-scada-muted mt-0.5">{cfg?.fullLabel} · Last {chartData.length} readings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color.stroke }} />
          <span className="font-mono text-xs" style={{ color: color.stroke }}>LIVE</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${sensorType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color.fill} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color.fill} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,33,55,0.8)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#3A5F7A', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minVal, maxVal]}
            tick={{ fill: '#3A5F7A', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip unit={cfg?.unit} />} />
          {warnLine && (
            <ReferenceLine y={warnLine} stroke="#FFB800" strokeDasharray="4 4" strokeOpacity={0.6}
              label={{ value: 'WARN', fill: '#FFB800', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
          )}
          {critLine && (
            <ReferenceLine y={critLine} stroke="#FF3B3B" strokeDasharray="4 4" strokeOpacity={0.6}
              label={{ value: 'CRIT', fill: '#FF3B3B', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color.stroke}
            strokeWidth={2}
            fill={`url(#grad-${sensorType})`}
            dot={false}
            activeDot={{ r: 4, fill: color.stroke, stroke: '#050A0E', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
