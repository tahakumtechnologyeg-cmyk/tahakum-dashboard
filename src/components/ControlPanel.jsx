import { useState, useEffect } from 'react'
import { Power, Cpu, Target, RotateCcw, AlertCircle, ChevronUp, ChevronDown, Lock } from 'lucide-react'
import { useControls } from '../hooks/useControls'
import { useAuth } from '../hooks/useAuth'

export default function ControlPanel() {
  const { controls, updating, error, applyControl } = useControls()
  const { user } = useAuth()

  const [localSpeed, setLocalSpeed] = useState(controls?.pump_speed ?? 0)
  const [localPressure, setLocalPressure] = useState(controls?.target_pressure ?? 3.5)
  const [pendingSpeed, setPendingSpeed] = useState(false)
  const [pendingPressure, setPendingPressure] = useState(false)

  useEffect(() => { setLocalSpeed(controls?.pump_speed ?? 0) }, [controls?.pump_speed])
  useEffect(() => { setLocalPressure(controls?.target_pressure ?? 3.5) }, [controls?.target_pressure])

  // Speed: 0–50 Hz (VFD output frequency)
  const freqPct = Math.round(((localSpeed || 0) / 50) * 100)

  async function togglePump() {
    await applyControl({ status: !controls?.status, pump_speed: controls?.status ? 0 : localSpeed })
  }

  async function sendSpeed() {
    setPendingSpeed(true)
    await applyControl({ pump_speed: localSpeed })
    setPendingSpeed(false)
  }

  async function sendPressure() {
    setPendingPressure(true)
    await applyControl({ target_pressure: localPressure })
    setPendingPressure(false)
  }

  const pumpStatusColor = controls?.status
    ? 'text-scada-green border-scada-green/40 bg-scada-green/10'
    : 'text-scada-muted border-scada-muted/30 bg-scada-dim/20'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-white/20 mb-4">
        <div>
          <h2 className="font-display text-sm font-bold tracking-widest text-white">VFD CONTROL PANEL</h2>
          <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Variable Frequency Drive · Water Pump</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-scada-accent/30 bg-scada-accent/5">
          <Lock className="w-3 h-3 text-scada-accent" />
          <span className="font-mono text-xs text-scada-accent">{user?.email?.split('@')[0] || 'ADMIN'}</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded-lg px-4 py-2">
          <AlertCircle className="w-4 h-4 text-scada-red" />
          <span className="font-mono text-xs text-scada-red">{error}</span>
        </div>
      )}

      {/* Pump ON/OFF */}
      <div className={`bg-scada-panel border rounded-xl p-5 transition-all duration-300 ${
        controls?.status ? 'border-scada-green/30' : 'border-scada-border'
      }`} style={controls?.status ? { boxShadow: '0 0 20px rgba(0,255,136,0.15)' } : {}}>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-xs font-bold tracking-widest text-scada-text mb-1">PUMP STATUS</div>
            <div className={`flex items-center gap-2 text-sm font-mono font-bold ${
              controls?.status ? 'text-scada-green' : 'text-scada-muted'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                controls?.status ? 'bg-scada-green animate-pulse' : 'bg-scada-muted'
              }`} />
              {controls?.status ? 'RUNNING' : 'STOPPED'}
            </div>
          </div>

          <button
            onClick={togglePump}
            disabled={updating}
            className={`relative w-16 h-16 rounded-full border-2 font-display font-bold text-xs tracking-wider transition-all duration-300 flex flex-col items-center justify-center gap-1 ${pumpStatusColor} ${
              updating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
            style={controls?.status ? { boxShadow: '0 0 24px rgba(0,255,136,0.4)' } : {}}>
            <Power className="w-6 h-6" />
            <span className="text-[9px] leading-none">{controls?.status ? 'STOP' : 'START'}</span>
          </button>
        </div>

        {/* Run time indicator */}
        {controls?.status && (
          <div className="mt-4 h-1 rounded-full bg-scada-bg overflow-hidden">
            <div className="h-full bg-scada-green rounded-full animate-pulse" style={{ width: `${freqPct}%` }} />
          </div>
        )}
      </div>

      {/* VFD Frequency */}
      <div className="bg-scada-panel border border-scada-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-scada-accent" />
          <span className="font-display text-xs font-bold tracking-widest text-scada-text">VFD FREQUENCY</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-display text-4xl font-bold text-scada-accent">{localSpeed}</span>
            <span className="font-mono text-sm text-scada-muted ml-2">Hz</span>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-scada-muted">MOTOR SPEED</div>
            <div className="font-display text-lg font-bold text-white">{freqPct}<span className="text-sm text-scada-muted">%</span></div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-4">
          <input
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={localSpeed}
            onChange={e => setLocalSpeed(parseFloat(e.target.value))}
            disabled={!controls?.status}
            className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: `linear-gradient(to right, #00D4FF ${freqPct}%, #0A1520 ${freqPct}%)`,
            }}
          />
          {/* Tick marks */}
          <div className="flex justify-between mt-1">
            {[0, 10, 20, 30, 40, 50].map(v => (
              <span key={v} className="font-mono text-xs text-scada-muted">{v}</span>
            ))}
          </div>
        </div>

        {/* Manual input */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-scada-border rounded-lg overflow-hidden bg-scada-bg">
            <button onClick={() => setLocalSpeed(s => Math.max(0, +(s - 0.5).toFixed(1)))}
              className="px-2 py-2 text-scada-muted hover:text-white hover:bg-scada-dim transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={localSpeed}
              onChange={e => setLocalSpeed(Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)))}
              className="w-16 bg-transparent text-center font-mono text-sm text-white focus:outline-none py-2"
            />
            <button onClick={() => setLocalSpeed(s => Math.min(50, +(s + 0.5).toFixed(1)))}
              className="px-2 py-2 text-scada-muted hover:text-white hover:bg-scada-dim transition-colors">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <span className="font-mono text-sm text-scada-muted">Hz</span>
          <button
            onClick={sendSpeed}
            disabled={updating || pendingSpeed || !controls?.status}
            className="flex-1 bg-scada-accent/10 border border-scada-accent/30 text-scada-accent font-display text-xs font-bold tracking-wider py-2 rounded-lg hover:bg-scada-accent/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {pendingSpeed ? 'SENDING...' : 'APPLY'}
          </button>
        </div>
      </div>

      {/* Target Pressure */}
      <div className="bg-scada-panel border border-scada-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-scada-green" />
          <span className="font-display text-xs font-bold tracking-widest text-scada-text">TARGET PRESSURE</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-scada-border rounded-lg overflow-hidden bg-scada-bg">
            <button onClick={() => setLocalPressure(p => Math.max(0.5, +(p - 0.1).toFixed(1)))}
              className="px-2 py-2 text-scada-muted hover:text-white hover:bg-scada-dim transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={0.5}
              max={8}
              step={0.1}
              value={localPressure}
              onChange={e => setLocalPressure(Math.min(8, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
              className="w-16 bg-transparent text-center font-mono text-sm text-white focus:outline-none py-2"
            />
            <button onClick={() => setLocalPressure(p => Math.min(8, +(p + 0.1).toFixed(1)))}
              className="px-2 py-2 text-scada-muted hover:text-white hover:bg-scada-dim transition-colors">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <span className="font-mono text-sm text-scada-muted">bar</span>
          <button
            onClick={sendPressure}
            disabled={updating || pendingPressure}
            className="flex-1 bg-scada-green/10 border border-scada-green/30 text-scada-green font-display text-xs font-bold tracking-wider py-2 rounded-lg hover:bg-scada-green/20 transition-colors disabled:opacity-40">
            {pendingPressure ? 'SENDING...' : 'SET SP'}
          </button>
        </div>

        <div className="mt-3 font-mono text-xs text-scada-muted">
          Setpoint range: 0.5 – 8.0 bar · Closed-loop PID via VFD
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => applyControl({ status: false, pump_speed: 0, target_pressure: 3.5 })}
        disabled={updating}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-scada-border rounded-lg text-scada-muted hover:text-scada-red hover:border-scada-red/30 font-mono text-xs transition-all disabled:opacity-40">
        <RotateCcw className="w-3.5 h-3.5" />
        EMERGENCY STOP & RESET
      </button>
    </div>
  )
}
