import { Zap, Clock, Sun, Calendar, BarChart, Activity } from 'lucide-react'

export default function PowerStats() {
  const stats = [
    { label: 'PAST HOUR', value: '1.24', unit: 'kWh', icon: Clock, color: 'text-scada-accent' },
    { label: 'TODAY', value: '28.5', unit: 'kWh', icon: Sun, color: 'text-scada-green' },
    { label: 'THIS WEEK', value: '198.2', unit: 'kWh', icon: Calendar, color: 'text-yellow-400' },
    { label: 'THIS MONTH', value: '840.5', unit: 'kWh', icon: BarChart, color: 'text-orange-400' },
    { label: 'THIS YEAR', value: '10,250', unit: 'kWh', icon: Activity, color: 'text-scada-red' },
  ]

  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-sm font-bold tracking-widest text-white">POWER CONSUMPTION</h2>
          <p className="font-body text-xs text-scada-muted mt-0.5">Energy metrics and usage statistics</p>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-yellow-400/30 bg-yellow-400/10">
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </div>

      <div className="space-y-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-scada-bg border border-scada-border/50 hover:border-scada-border transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-scada-dim/50 border border-scada-border/50 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs text-scada-muted uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-right">
                <span className={`font-display text-lg font-bold ${stat.color}`}>{stat.value}</span>
                <span className="font-mono text-[10px] text-scada-muted ml-1.5 uppercase">{stat.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
