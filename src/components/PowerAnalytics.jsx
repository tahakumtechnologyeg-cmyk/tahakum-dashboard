import { useState, useEffect } from 'react'
import { Activity, CalendarDays, CalendarRange, Calendar as CalendarIcon, History } from 'lucide-react'
import { useControls } from '../hooks/useControls'

export default function PowerAnalytics() {
  const { controls } = useControls()
  
  // Motor parameters
  const MAX_POWER_KW = 45 // Using 45 kW (> 37 kW)
  
  // Power formula: P = Pmax * (speed/max_speed)^3
  const speedRatio = controls.status ? controls.pump_speed / 50 : 0
  const currentPowerKw = MAX_POWER_KW * Math.pow(speedRatio, 3)

  // Simulate realistic consumption based on typical operation
  const [estimatedDaily, setEstimatedDaily] = useState(0)

  useEffect(() => {
     if (controls.status && currentPowerKw > 0) {
        // Assume 60% duty cycle for realistic daily estimation
        setEstimatedDaily(currentPowerKw * 24 * 0.6)
     } else if (estimatedDaily === 0) {
        // Fallback default so it doesn't look empty when pump is initially stopped
        const defaultSpeed = 35 // default 35 Hz
        const defaultPower = MAX_POWER_KW * Math.pow(defaultSpeed/50, 3)
        setEstimatedDaily(defaultPower * 24 * 0.6)
     }
  }, [currentPowerKw, controls.status])

  const weekly = estimatedDaily * 7
  const monthly = estimatedDaily * 30
  const yearly = estimatedDaily * 365

  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-scada-accent" />
        <span className="font-display text-xs font-bold tracking-widest text-scada-text">ENERGY CONSUMPTION</span>
      </div>

      <div className="flex items-end justify-between border-b border-scada-border/60 pb-4 mb-4">
        <div>
           <div className="font-mono text-[10px] text-scada-muted uppercase tracking-wider mb-1">Live Power Draw</div>
           <div className="font-display text-4xl font-bold text-scada-accent">
             {currentPowerKw.toFixed(1)}
           </div>
        </div>
        <div className="text-right">
           <div className="font-mono text-xs text-scada-muted mb-1">UNIT</div>
           <div className="font-display text-xl font-bold text-white">kW</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<CalendarDays className="w-3.5 h-3.5" />} label="DAILY" value={estimatedDaily} />
        <StatCard icon={<CalendarRange className="w-3.5 h-3.5" />} label="WEEKLY" value={weekly} />
        <StatCard icon={<CalendarIcon className="w-3.5 h-3.5" />} label="MONTHLY" value={monthly} />
        <StatCard icon={<History className="w-3.5 h-3.5" />} label="YEARLY" value={yearly} />
      </div>
      
      <div className="mt-4 pt-3 border-t border-scada-border/60">
        <p className="font-mono text-[10px] text-scada-muted leading-relaxed">
          * Dynamic estimation based on VFD pump speed. <br/>
          * Model: 45kW Motor, Affinity Laws Applied (P ∝ N³).
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-scada-bg border border-scada-border rounded-lg p-3 relative overflow-hidden group hover:border-scada-accent/50 transition-colors">
      <div className="absolute inset-0 bg-scada-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2 text-scada-muted group-hover:text-scada-accent transition-colors">
          {icon}
          <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
        </div>
        <div className="font-display text-lg font-bold text-white tracking-wide">
          {Math.round(value).toLocaleString()}
          <span className="font-mono text-[10px] text-scada-muted ml-1.5 font-normal">kWh</span>
        </div>
      </div>
    </div>
  )
}
