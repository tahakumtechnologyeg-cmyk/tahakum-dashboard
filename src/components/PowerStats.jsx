import { Zap, Activity, Clock, Calendar, AlertCircle } from 'lucide-react'
import { useControls } from '../hooks/useControls'

const NOMINAL_POWER_KW = 45; // Base assumption for Motor Power > 37kW
const MAX_FREQ_HZ = 50;

export default function PowerStats() {
  const { controls } = useControls();

  // If pump is off, power is 0. If on, calculate based on affinity laws: P = P_nominal * (speed/max_speed)^3
  const currentSpeed = controls.pump_speed || 0;
  let currentPower = 0;

  if (controls.status && currentSpeed > 0) {
    const speedRatio = currentSpeed / MAX_FREQ_HZ;
    currentPower = NOMINAL_POWER_KW * Math.pow(speedRatio, 3);
  }

  // Estimated consumption
  const dailyKwh = currentPower * 24;
  const weeklyKwh = dailyKwh * 7;
  const monthlyKwh = dailyKwh * 30; // approx
  const yearlyKwh = dailyKwh * 365;

  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-5 relative overflow-hidden">
      {/* Decorative scan line / background glow */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Zap className="w-32 h-32 text-scada-accent" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-scada-border/50">
          <Zap className="w-4 h-4 text-scada-accent" />
          <h2 className="font-display text-xs font-bold tracking-widest text-scada-text">POWER CONSUMPTION ESTIMATES</h2>
        </div>

        {/* Current Power Rating */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-xs text-scada-muted mb-1">LIVE DRAW (ESTIMATED)</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-white">{currentPower.toFixed(1)}</span>
              <span className="font-mono text-sm text-scada-accent">kW</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-scada-muted mb-1">MOTOR RATING</div>
            <div className="font-mono text-sm text-scada-text font-bold">45.0 kW</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatBox 
            icon={<Clock className="w-3.5 h-3.5" />} 
            label="DAILY" 
            value={dailyKwh} 
            suffix="kWh/day" 
          />
          <StatBox 
            icon={<Activity className="w-3.5 h-3.5" />} 
            label="WEEKLY" 
            value={weeklyKwh} 
            suffix="kWh/wk" 
          />
          <StatBox 
            icon={<Calendar className="w-3.5 h-3.5" />} 
            label="MONTHLY" 
            value={monthlyKwh} 
            suffix="kWh/mo" 
          />
          <StatBox 
            icon={<AlertCircle className="w-3.5 h-3.5" />} 
            label="YEARLY" 
            value={yearlyKwh} 
            suffix="kWh/yr" 
          />
        </div>

        <div className="font-mono text-[10px] text-scada-muted/60 leading-tight">
          *Estimates based on current VFD speed ({currentSpeed} Hz) running continuously 24/7.
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, suffix }) {
  // Format large numbers with commas
  const formattedValue = value >= 1000 
    ? Math.round(value).toLocaleString() 
    : value.toFixed(1);

  return (
    <div className="bg-scada-bg/50 border border-scada-border/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-scada-muted mb-2">
        {icon}
        <span className="font-mono text-[10px] tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-base font-bold text-scada-text">{formattedValue}</span>
      </div>
      <div className="font-mono text-[10px] text-scada-accent/70 mt-0.5">{suffix}</div>
    </div>
  );
}
