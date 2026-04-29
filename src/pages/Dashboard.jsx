import { useState } from 'react'
import {
  Droplets, Wifi, WifiOff, LogOut, Cpu, Menu, X,
  Bell, LayoutDashboard, Settings
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTelemetry } from '../hooks/useTelemetry'
import SensorCard from '../components/SensorCard'
import LiveChart from '../components/LiveChart'
import ControlPanel from '../components/ControlPanel'
import AlertsPanel from '../components/AlertsPanel'
import { DEMO_MODE } from '../lib/demo'

const SENSOR_ORDER = ['TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE']

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, history, connected } = useTelemetry()
  const [mobileTab, setMobileTab] = useState('sensors') // sensors | charts | control
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const now = new Date()

  return (
    <div className="min-h-screen bg-scada-bg font-body">
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
        <div className="w-full h-8 bg-gradient-to-b from-transparent via-scada-accent to-transparent animate-scan" />
      </div>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-scada-border bg-scada-bg/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden shadow-lg" style={{ boxShadow: '0 0 15px rgba(211,47,47,0.3)' }}>
              <img src="/bolt-logo.svg" alt="Takamul" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display text-sm font-bold tracking-widest text-white leading-none">TAKAMUL</div>
              <div className="font-mono text-xs text-scada-muted hidden sm:block">SMART SOLUTION</div>
            </div>
          </div>

          {/* Center: clock + connection */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="font-mono text-xs text-scada-muted">
              {now.toLocaleDateString()} · <span className="text-scada-text">{now.toLocaleTimeString()}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono ${
              connected
                ? 'border-scada-green/30 text-scada-green bg-scada-green/5'
                : 'border-scada-red/30 text-scada-red bg-scada-red/5'
            }`}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {connected ? (DEMO_MODE ? 'DEMO LIVE' : 'SUPABASE LIVE') : 'DISCONNECTED'}
            </div>
          </div>

          {/* Right: user + actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-scada-border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-scada-green" />
              <span className="font-mono text-xs text-scada-text">{user?.email?.split('@')[0]}</span>
            </div>
            <button onClick={signOut}
              className="p-2 text-scada-muted hover:text-scada-red transition-colors"
              title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
            <button onClick={() => setSidebarOpen(o => !o)} className="sm:hidden p-2 text-scada-muted">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile tab nav */}
        <div className="sm:hidden flex border-t border-scada-border">
          {[
            { id: 'sensors', label: 'Sensors', icon: LayoutDashboard },
            { id: 'charts', label: 'Charts', icon: Bell },
            { id: 'control', label: 'Control', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-colors ${
                mobileTab === id
                  ? 'text-scada-accent border-b-2 border-scada-accent'
                  : 'text-scada-muted'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        {/* Desktop: 3-column grid | Mobile: tabbed */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-6">

          {/* LEFT: Sensor Cards (5 cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <SectionHeader title="SENSOR OVERVIEW" subtitle="Real-time monitoring · 5s interval" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {SENSOR_ORDER.map(type => (
                <SensorCard key={type} sensorType={type} data={latest[type]} />
              ))}
            </div>
          </div>

          {/* MIDDLE: Charts + Alerts (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <SectionHeader title="TREND ANALYSIS" subtitle="Live time-series data" />
            <LiveChart sensorType="FLOW" data={history.FLOW} title="FLOW RATE" />
            <LiveChart sensorType="PRESSURE" data={history.PRESSURE} title="LINE PRESSURE" />
            <AlertsPanel latest={latest} />
          </div>

          {/* RIGHT: Control Panel (3 cols) */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <SectionHeader title="CONTROL PANEL" subtitle="Admin access required" />
            <ControlPanel />
          </div>
        </div>

        {/* MOBILE: tabbed view */}
        <div className="sm:hidden">
          {mobileTab === 'sensors' && (
            <div className="space-y-3">
              <AlertsPanel latest={latest} />
              {SENSOR_ORDER.map(type => (
                <SensorCard key={type} sensorType={type} data={latest[type]} />
              ))}
            </div>
          )}
          {mobileTab === 'charts' && (
            <div className="space-y-4">
              <LiveChart sensorType="FLOW" data={history.FLOW} title="FLOW RATE" />
              <LiveChart sensorType="PRESSURE" data={history.PRESSURE} title="LINE PRESSURE" />
            </div>
          )}
          {mobileTab === 'control' && (
            <div className="space-y-4">
              <ControlPanel />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-scada-border mt-8 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-xs text-scada-muted">
            AquaControl SCADA · ESP32-S3 + STM32 · Supabase Realtime
          </span>
          <span className="font-mono text-xs text-scada-muted">
            {DEMO_MODE ? '⚡ DEMO MODE — connect Supabase to go live' : '🟢 LIVE — Supabase connected'}
          </span>
        </div>
      </footer>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between pb-1 border-b border-scada-border/60">
      <div>
        <h2 className="font-display text-xs font-bold tracking-widest text-scada-text">{title}</h2>
        <p className="font-body text-xs text-scada-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}
