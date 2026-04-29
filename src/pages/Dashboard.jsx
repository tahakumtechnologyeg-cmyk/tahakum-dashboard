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
import PowerStats from '../components/PowerStats'
import AlertsPanel from '../components/AlertsPanel'
import { DEMO_MODE } from '../lib/demo'

const SENSOR_ORDER = ['TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE']

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, history, connected } = useTelemetry()
  const [mobileTab, setMobileTab] = useState('sensors')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const now = new Date()

  return (
    <div className="min-h-screen bg-scada-bg font-body">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-scada-border shadow-sm" style={{background:'#B94040'}}>

        {/* ── Desktop row (single row, unchanged) ── */}
        <div className="hidden sm:flex items-center justify-between px-6 h-14">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="./bolt-logo.svg" alt="Takamul Logo" className="w-8 h-8 rounded-lg" style={{ boxShadow: '0 0 15px rgba(211,47,47,0.3)' }} />
            <div>
              <div className="font-display text-sm font-bold tracking-widest leading-none" style={{color:'#FBF7EF'}}>TAKAMUL</div>
              <div className="font-mono text-xs" style={{color:'rgba(251,247,239,0.75)'}}>SMART SOLUTION</div>
            </div>
          </div>
          {/* Center */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs" style={{color:'rgba(251,247,239,0.8)'}}>
              {now.toLocaleDateString()} · <span style={{color:'#FBF7EF'}}>{now.toLocaleTimeString()}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono ${
              connected ? 'border-white/30 text-white bg-white/15' : 'border-white/20 text-white/70 bg-white/10'
            }`}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {connected ? (DEMO_MODE ? 'DEMO LIVE' : 'SUPABASE LIVE') : 'DISCONNECTED'}
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/30 rounded-lg" style={{background:'rgba(255,255,255,0.12)'}}>
              <div className="w-2 h-2 rounded-full bg-green-300 flex-shrink-0" />
              <span className="font-mono text-xs" style={{color:'#FBF7EF'}}>{user?.email?.split('@')[0]}</span>
            </div>
            <button onClick={signOut} className="p-2 transition-colors" style={{color:'rgba(251,247,239,0.8)'}} title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Mobile: Row 1 — Logo + User + Logout ── */}
        <div className="sm:hidden flex items-center justify-between px-3 h-12">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img src="./bolt-logo.svg" alt="Takamul Logo" className="w-7 h-7 rounded-lg" style={{ boxShadow: '0 0 15px rgba(211,47,47,0.3)' }} />
            <div>
              <div className="font-display text-sm font-bold tracking-widest leading-none" style={{color:'#FBF7EF'}}>TAKAMUL</div>
              <div className="font-mono text-[10px] leading-none mt-0.5" style={{color:'rgba(251,247,239,0.7)'}}>SMART SOLUTION</div>
            </div>
          </div>
          {/* Right: connection + user + logout */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-mono ${
              connected ? 'border-white/30 text-white bg-white/15' : 'border-white/20 text-white/60 bg-white/10'
            }`}>
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{connected ? 'LIVE' : 'OFF'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1.5 border border-white/30 rounded-lg" style={{background:'rgba(255,255,255,0.12)'}}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 flex-shrink-0" />
              <span className="font-mono text-[11px] max-w-[90px] truncate" style={{color:'#FBF7EF'}}>
                {user?.email?.split('@')[0]}
              </span>
            </div>
            <button onClick={signOut} className="p-1.5 transition-colors" style={{color:'rgba(251,247,239,0.8)'}} title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile tab nav */}
        <div className="sm:hidden flex border-t border-white/20">
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
                  ? 'border-b-2 border-white font-bold'
                  : 'opacity-70'
              }`}
              style={{color: mobileTab === id ? '#FBF7EF' : 'rgba(251,247,239,0.7)'}}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

        <div className="hidden sm:grid sm:grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <SectionHeader title="SENSOR OVERVIEW" subtitle="Real-time monitoring · 5s interval" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {SENSOR_ORDER.map(type => (
                <SensorCard key={type} sensorType={type} data={latest[type]} />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            <SectionHeader title="TREND ANALYSIS" subtitle="Live time-series data" />
            <LiveChart sensorType="FLOW" data={history.FLOW} title="FLOW RATE" />
            <LiveChart sensorType="PRESSURE" data={history.PRESSURE} title="LINE PRESSURE" />
            <AlertsPanel latest={latest} />
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-4">
            <SectionHeader title="CONTROL PANEL" subtitle="Admin access required" />
            <ControlPanel />
            <div className="pt-2">
              <SectionHeader title="ENERGY TRACKING" subtitle="Pump consumption data" />
            </div>
            <PowerStats />
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
              <div className="pt-2">
                <SectionHeader title="ENERGY TRACKING" subtitle="Pump consumption data" />
              </div>
              <PowerStats />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-scada-border mt-8 px-6 py-4 bg-white">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-xs text-scada-muted">
            Takamul Smart Solution · ESP32-S3 + STM32 · Supabase Realtime
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
