import { useState } from 'react'
import { LogOut, Bell, LayoutDashboard, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTelemetry } from '../hooks/useTelemetry'
import SensorCard from '../components/SensorCard'
import LiveChart from '../components/LiveChart'
import ControlPanel from '../components/ControlPanel'
import PowerStats from '../components/PowerStats'
import AlertsPanel from '../components/AlertsPanel'

const SENSOR_ORDER = ['TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE']

/* ── Subtle automation background (circuit + gears) ── */
function AutomationBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Warm cream base — matches scada-bg */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.18 }}>
        <defs>
          <pattern id="circuit-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Grid lines */}
            <line x1="0" y1="40" x2="80" y2="40" stroke="#8B6F47" strokeWidth="0.5" strokeDasharray="4 4"/>
            <line x1="40" y1="0" x2="40" y2="80" stroke="#8B6F47" strokeWidth="0.5" strokeDasharray="4 4"/>
            {/* Circuit nodes */}
            <circle cx="40" cy="40" r="2.5" fill="#7B5E3A" fillOpacity="0.6"/>
            <circle cx="0" cy="0" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            <circle cx="80" cy="0" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            <circle cx="0" cy="80" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            <circle cx="80" cy="80" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            {/* Short traces */}
            <line x1="40" y1="40" x2="60" y2="40" stroke="#7B5E3A" strokeWidth="1.2"/>
            <line x1="60" y1="40" x2="60" y2="55" stroke="#7B5E3A" strokeWidth="1.2"/>
            <circle cx="60" cy="55" r="2" fill="#7B5E3A" fillOpacity="0.5"/>
            <line x1="40" y1="40" x2="40" y2="20" stroke="#7B5E3A" strokeWidth="1.2"/>
            <line x1="40" y1="20" x2="25" y2="20" stroke="#7B5E3A" strokeWidth="1.2"/>
            <circle cx="25" cy="20" r="2" fill="#7B5E3A" fillOpacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-grid)"/>
      </svg>

      {/* Gear — top right */}
      <svg className="absolute" style={{ top: '6%', right: '3%', width: 120, height: 120, opacity: 0.1 }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(50,50)">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
            <rect key={i} x="-4" y="-46" width="8" height="14" rx="2"
              fill="#7B5E3A"
              transform={`rotate(${a})`}/>
          ))}
          <circle r="34" fill="none" stroke="#7B5E3A" strokeWidth="3"/>
          <circle r="14" fill="none" stroke="#7B5E3A" strokeWidth="2.5"/>
          <circle r="5" fill="#7B5E3A"/>
        </g>
      </svg>

      {/* Gear — bottom left, smaller */}
      <svg className="absolute" style={{ bottom: '8%', left: '1.5%', width: 80, height: 80, opacity: 0.09 }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(50,50)">
          {[0,45,90,135,180,225,270,315].map((a, i) => (
            <rect key={i} x="-4" y="-44" width="8" height="12" rx="2"
              fill="#7B5E3A"
              transform={`rotate(${a})`}/>
          ))}
          <circle r="32" fill="none" stroke="#7B5E3A" strokeWidth="3"/>
          <circle r="13" fill="none" stroke="#7B5E3A" strokeWidth="2"/>
          <circle r="4.5" fill="#7B5E3A"/>
        </g>
      </svg>

      {/* Robot arm silhouette — bottom right corner */}
      <svg className="absolute" style={{ bottom: 0, right: '6%', width: 160, height: 160, opacity: 0.07 }}
        viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        {/* Base */}
        <rect x="60" y="130" width="40" height="12" rx="3" fill="#7B5E3A"/>
        <rect x="68" y="116" width="24" height="16" rx="3" fill="#7B5E3A"/>
        {/* Upper arm */}
        <rect x="72" y="70" width="16" height="48" rx="4" fill="#7B5E3A"/>
        <circle cx="80" cy="70" r="10" fill="#7B5E3A"/>
        {/* Forearm */}
        <g transform="rotate(-35, 80, 70)">
          <rect x="74" y="22" width="12" height="50" rx="3" fill="#7B5E3A"/>
          <circle cx="80" cy="22" r="8" fill="#7B5E3A"/>
          {/* Wrist */}
          <g transform="rotate(45, 80, 22)">
            <rect x="76" y="-16" width="8" height="20" rx="2" fill="#7B5E3A"/>
            <line x1="72" y1="-22" x2="77" y2="-16" stroke="#7B5E3A" strokeWidth="3" strokeLinecap="round"/>
            <line x1="88" y1="-22" x2="83" y2="-16" stroke="#7B5E3A" strokeWidth="3" strokeLinecap="round"/>
          </g>
        </g>
      </svg>

      {/* Conveyor belt — bottom left */}
      <svg className="absolute" style={{ bottom: 0, left: 0, width: 280, height: 60, opacity: 0.08 }}
        viewBox="0 0 280 60" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="260" height="22" rx="4" fill="none" stroke="#7B5E3A" strokeWidth="2"/>
        {[30,60,90,120,150,180,210,240].map(x => (
          <line key={x} x1={x} y1="20" x2={x} y2="42" stroke="#7B5E3A" strokeWidth="1.5"/>
        ))}
        <circle cx="22" cy="42" r="10" fill="none" stroke="#7B5E3A" strokeWidth="2"/>
        <circle cx="258" cy="42" r="10" fill="none" stroke="#7B5E3A" strokeWidth="2"/>
      </svg>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, history, connected } = useTelemetry()
  const [mobileTab, setMobileTab] = useState('sensors')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [prevTab, setPrevTab] = useState('sensors')
  const [transitioning, setTransitioning] = useState(false)

  function switchTab(newTab) {
    if (newTab === mobileTab) return
    setTransitioning(true)
    setTimeout(() => {
      setPrevTab(mobileTab)
      setMobileTab(newTab)
      // small delay before fading back in so content has rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitioning(false))
      })
    }, 220)
  }


  return (
    <div className="min-h-screen bg-scada-bg font-body relative">
      <AutomationBg />
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
          {/* Center — just a subtle live dot, no text clutter */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-white/40'}`} />
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
              onClick={() => switchTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono text-xs transition-all duration-200 ${
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
      <main className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">

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

        {/* MOBILE: tabbed view with smooth fade+slide transition */}
        <div className="sm:hidden" style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(10px) scale(0.99)' : 'translateY(0) scale(1)',
          transition: transitioning
            ? 'opacity 0.22s cubic-bezier(0.4,0,1,1), transform 0.22s cubic-bezier(0.4,0,1,1)'
            : 'opacity 0.32s cubic-bezier(0,0,0.2,1), transform 0.32s cubic-bezier(0,0,0.2,1)'
        }}>
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
