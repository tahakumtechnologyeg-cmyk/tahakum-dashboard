import { useState } from 'react'
import { LogOut, LayoutDashboard, LineChart, Settings, Zap, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTelemetry } from '../hooks/useTelemetry'
import SensorCard from '../components/SensorCard'
import LiveChart from '../components/LiveChart'
import ControlPanel from '../components/ControlPanel'
import PowerStats from '../components/PowerStats'
import AlertsPanel from '../components/AlertsPanel'
import ProfilePage from '../components/ProfilePage'

const SENSOR_ORDER = ['TDS', 'TEMPERATURE', 'FLOW', 'PRESSURE', 'DIFF_PRESSURE']

const TABS = [
  { id: 'sensors', label: 'Sensor Overview',    shortLabel: 'Sensors', icon: LayoutDashboard },
  { id: 'charts',  label: 'Trend Analysis',      shortLabel: 'Trends',  icon: LineChart },
  { id: 'control', label: 'VFD Control Panel',   shortLabel: 'Control', icon: Settings },
  { id: 'energy',  label: 'Energy Tracking',     shortLabel: 'Energy',  icon: Zap },
  { id: 'profile', label: 'Profile',             shortLabel: 'Profile', icon: User },
]

function AutomationBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.18 }}>
        <defs>
          <pattern id="circuit-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="40" x2="80" y2="40" stroke="#8B6F47" strokeWidth="0.5" strokeDasharray="4 4"/>
            <line x1="40" y1="0" x2="40" y2="80" stroke="#8B6F47" strokeWidth="0.5" strokeDasharray="4 4"/>
            <circle cx="40" cy="40" r="2.5" fill="#7B5E3A" fillOpacity="0.6"/>
            <circle cx="0" cy="0" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            <circle cx="80" cy="0" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            <circle cx="0" cy="80" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
            <circle cx="80" cy="80" r="1.5" fill="#7B5E3A" fillOpacity="0.4"/>
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
      <svg className="absolute" style={{ top: '6%', right: '3%', width: 120, height: 120, opacity: 0.1 }} viewBox="0 0 100 100">
        <g transform="translate(50,50)">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
            <rect key={i} x="-4" y="-46" width="8" height="14" rx="2" fill="#7B5E3A" transform={`rotate(${a})`}/>
          ))}
          <circle r="34" fill="none" stroke="#7B5E3A" strokeWidth="3"/>
          <circle r="14" fill="none" stroke="#7B5E3A" strokeWidth="2.5"/>
          <circle r="5" fill="#7B5E3A"/>
        </g>
      </svg>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between pb-1 border-b border-scada-border/60 mb-4">
      <div>
        <h2 className="font-display text-xs font-bold tracking-widest text-scada-text">{title}</h2>
        {subtitle && <p className="font-body text-xs text-scada-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, history, connected } = useTelemetry()
  const [activeTab, setActiveTab] = useState('sensors')
  const [transitioning, setTransitioning] = useState(false)

  function switchTab(newTab) {
    if (newTab === activeTab) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveTab(newTab)
      requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(false)))
    }, 180)
  }

  return (
    <div className="min-h-screen font-body relative" style={{ background: 'linear-gradient(160deg, #0A2A6E 0%, #0E4A9C 30%, #1565C0 55%, #0D47A1 80%, #083170 100%)' }}>
      {/* Sky glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: 'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(100,210,255,0.18) 0%, rgba(30,136,229,0.08) 50%, transparent 80%)' }} />
      {/* Grid floor */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, backgroundImage: 'linear-gradient(rgba(100,210,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(100,210,255,0.07) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      <AutomationBg />

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 border-b border-scada-border shadow-sm" style={{ background: '#B94040' }}>

        {/* Logo + user row */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img src="./bolt-logo.svg" alt="Takamul" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
              style={{ boxShadow: '0 0 15px rgba(211,47,47,0.3)' }} />
            <div>
              <div className="font-display text-sm font-bold tracking-widest leading-none" style={{ color: '#FBF7EF' }}>TAKAMUL</div>
              <div className="font-mono text-[10px] sm:text-xs leading-none mt-0.5" style={{ color: 'rgba(251,247,239,0.75)' }}>SMART SOLUTION</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-300 animate-pulse' : 'bg-white/40'}`} />
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 border border-white/30 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.12)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 flex-shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs max-w-[80px] sm:max-w-none truncate" style={{ color: '#FBF7EF' }}>
                {user?.email?.split('@')[0]}
              </span>
            </div>
            <button onClick={signOut} className="p-1.5 sm:p-2" style={{ color: 'rgba(251,247,239,0.8)' }} title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </header>

      {/* ── Body: Side Nav + Content ── */}
      <div className="relative z-10 flex max-w-screen-2xl mx-auto">

        {/* ── Vertical Side Tabs ── */}
        <nav className="hidden sm:flex flex-col w-52 shrink-0 min-h-[calc(100vh-7rem)] border-r border-scada-border bg-scada-panel/60 backdrop-blur-sm pt-4 pb-8 gap-1 px-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs transition-all duration-200 text-left w-full ${
                activeTab === id
                  ? 'font-bold border border-scada-accent/30'
                  : 'opacity-50 hover:opacity-80 hover:bg-scada-dim/50'
              }`}
              style={activeTab === id ? {
                background: 'rgba(185,64,64,0.12)',
                color: '#B94040',
                boxShadow: 'inset 3px 0 0 #B94040',
              } : { color: 'var(--scada-text)' }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Mobile Bottom Tab Bar (visible on small screens) ── */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-scada-border" style={{ background: '#B94040' }}>
          {TABS.map(({ id, shortLabel, icon: Icon }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 font-mono text-[10px] transition-all ${
                activeTab === id ? 'font-bold' : 'opacity-55'
              }`}
              style={{ color: '#FBF7EF' }}
            >
              <Icon className="w-4 h-4" />
              {shortLabel}
            </button>
          ))}
        </div>

        {/* ── Content with fade transition ── */}
        <main
          className="flex-1 px-4 sm:px-6 py-6 pb-24 sm:pb-6"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
            transition: transitioning
              ? 'opacity 0.18s ease-in, transform 0.18s ease-in'
              : 'opacity 0.28s ease-out, transform 0.28s ease-out',
          }}
        >
        {activeTab === 'sensors' && (
          <div>
            <SectionHeader title="SENSOR OVERVIEW" subtitle="Real-time monitoring · 5s interval" />
            <AlertsPanel latest={latest} />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {SENSOR_ORDER.map(type => (
                <SensorCard key={type} sensorType={type} data={latest[type]} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div>
            <SectionHeader title="TREND ANALYSIS" subtitle="Live time-series data" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LiveChart sensorType="FLOW" data={history.FLOW} title="FLOW RATE" />
              <LiveChart sensorType="PRESSURE" data={history.PRESSURE} title="LINE PRESSURE" />
            </div>
          </div>
        )}

        {activeTab === 'control' && (
          <div className="max-w-2xl mx-auto">
            <ControlPanel />
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="max-w-2xl mx-auto">
            <SectionHeader title="ENERGY TRACKING" subtitle="Pump consumption data" />
            <PowerStats />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto">
            <SectionHeader title="PROFILE" subtitle="Manage your account" />
            <ProfilePage />
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
