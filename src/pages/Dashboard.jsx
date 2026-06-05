import { useState } from 'react'
import { LogOut, LayoutDashboard, LineChart, Settings, Zap, User, Cpu, Bell, HeadphonesIcon, Upload } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTelemetry } from '../hooks/useTelemetry'
import SensorCard from '../components/SensorCard'
import LiveChart from '../components/LiveChart'
import ControlPanel from '../components/ControlPanel'
import PowerStats from '../components/PowerStats'
import AlertsPanel from '../components/AlertsPanel'
import ProfilePage from '../components/ProfilePage'
import DevicesPage from '../components/DevicesPage'
import NotificationsPage, { getNotifCount } from '../components/NotificationsPage'
import SupportPage from '../components/SupportPage'
import OtaPage from '../components/OtaPage'

const SENSOR_ORDER = ['LY485_TEMP', 'LY485_HUM', 'NPK_NITROGEN', 'NPK_PHOSPHORUS', 'NPK_POTASSIUM']

const TABS = [
  { id: 'sensors',       label: 'Sensor Overview',    shortLabel: 'Sensors',       icon: LayoutDashboard },
  { id: 'charts',        label: 'Trend Analysis',      shortLabel: 'Trends',        icon: LineChart },
  { id: 'control',       label: 'VFD Control Panel',   shortLabel: 'Control',       icon: Settings },
  { id: 'energy',        label: 'Energy Tracking',     shortLabel: 'Energy',        icon: Zap },
  { id: 'devices',       label: 'My Devices',          shortLabel: 'Devices',       icon: Cpu },
  { id: 'ota',           label: 'Firmware Update',     shortLabel: 'OTA',           icon: Upload },
  { id: 'notifications', label: 'Notifications',       shortLabel: 'Alerts',        icon: Bell },
  { id: 'support',       label: 'Support',             shortLabel: 'Support',       icon: HeadphonesIcon },
  { id: 'profile',       label: 'Profile',             shortLabel: 'Profile',       icon: User },
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
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between pb-1 border-b border-white/20 mb-4">
      <div>
        <h2 className="font-display text-xs font-bold tracking-widest text-white">{title}</h2>
        {subtitle && <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{subtitle}</p>}
      </div>
    </div>
  )
}


function NoDevicesBanner({ onGoToDevices }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
      background: 'rgba(255,255,255,0.06)', borderRadius: 16,
      border: '1px dashed rgba(255,255,255,0.2)', marginTop: 16,
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔌</div>
      <h3 className="font-mono font-bold text-sm tracking-widest" style={{ color: '#FBF7EF', marginBottom: 8 }}>
        NO DEVICE LINKED
      </h3>
      <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 280, marginBottom: 20 }}>
        Link your ESP32 device first to start seeing live data here.
      </p>
      <button
        onClick={onGoToDevices}
        style={{
          padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
          background: '#B94040', color: '#FBF7EF', border: 'none',
          fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.08em', transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        + ADD DEVICE
      </button>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, history, connected, hasDevices } = useTelemetry()
  const [activeTab, setActiveTab] = useState('sensors')
  const [transitioning, setTransitioning] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const notifCount = getNotifCount(latest)

  function switchTab(newTab) {
    if (newTab === activeTab) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveTab(newTab)
      requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(false)))
    }, 180)
  }

  function handleTabClick(id) {
    switchTab(id)
    setDrawerOpen(false)
  }

  return (
    <div className="min-h-screen font-body relative" style={{ background: 'linear-gradient(160deg, #0A2A6E 0%, #0E4A9C 30%, #1565C0 55%, #0D47A1 80%, #083170 100%)' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: 'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(100,210,255,0.18) 0%, rgba(30,136,229,0.08) 50%, transparent 80%)' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, backgroundImage: 'linear-gradient(rgba(100,210,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(100,210,255,0.07) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      <AutomationBg />

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 border-b border-scada-border shadow-sm" style={{ background: '#B94040' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Hamburger */}
            <button
              onClick={() => setDrawerOpen(o => !o)}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10 mr-1"
              style={{ color: '#FBF7EF' }}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[5px]">
                <span className="block w-5 h-0.5 bg-current rounded"
                  style={{ transition: 'transform 0.3s', transform: drawerOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
                <span className="block w-5 h-0.5 bg-current rounded"
                  style={{ transition: 'opacity 0.3s', opacity: drawerOpen ? 0 : 1 }} />
                <span className="block w-5 h-0.5 bg-current rounded"
                  style={{ transition: 'transform 0.3s', transform: drawerOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
              </div>
            </button>

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

      {/* ── Drawer Overlay ── */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 45,
          background: 'rgba(0,0,0,0.5)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ── Drawer ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 248,
        background: 'linear-gradient(180deg, #0d1b3e 0%, #0f2755 40%, #0a1f4a 100%)',
        borderRight: '1px solid rgba(185,64,64,0.35)',
        boxShadow: drawerOpen ? '8px 0 40px rgba(0,0,0,0.6)' : 'none',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drawer top accent bar */}
        <div style={{
          height: 48, background: '#B94040',
          display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 10, flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div className="flex flex-col gap-[5px]" onClick={() => setDrawerOpen(false)} style={{ cursor: 'pointer' }}>
            <span className="block w-5 h-0.5 rounded" style={{ background: '#FBF7EF', transform: 'rotate(45deg) translateY(6px)', transition: 'transform 0.3s' }} />
            <span className="block w-5 h-0.5 rounded" style={{ background: '#FBF7EF', opacity: 0, transition: 'opacity 0.3s' }} />
            <span className="block w-5 h-0.5 rounded" style={{ background: '#FBF7EF', transform: 'rotate(-45deg) translateY(-6px)', transition: 'transform 0.3s' }} />
          </div>
          <span className="font-mono text-xs font-bold tracking-widest" style={{ color: '#FBF7EF' }}>MENU</span>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          <div style={{ padding: '4px 8px 10px', marginBottom: 4 }}>
            <span className="font-mono text-[10px] tracking-widest" style={{ color: 'rgba(185,64,64,0.7)' }}>NAVIGATION</span>
          </div>

          {TABS.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', textAlign: 'left',
                padding: '11px 14px', borderRadius: 10, marginBottom: 4,
                fontFamily: 'monospace', fontSize: 12,
                fontWeight: activeTab === id ? 700 : 400,
                border: activeTab === id ? '1px solid rgba(185,64,64,0.4)' : '1px solid transparent',
                background: activeTab === id ? 'rgba(185,64,64,0.18)' : 'transparent',
                color: activeTab === id ? '#ff8a80' : 'rgba(255,255,255,0.72)',
                boxShadow: activeTab === id ? 'inset 3px 0 0 #B94040' : 'none',
                cursor: 'pointer',
                transform: drawerOpen ? 'translateX(0)' : 'translateX(-16px)',
                opacity: drawerOpen ? 1 : 0,
                transition: `transform 0.3s cubic-bezier(0.4,0,0.2,1) ${index * 35}ms, opacity 0.3s ease ${index * 35}ms, background 0.15s, color 0.15s`,
                position: 'relative',
              }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {/* Notification badge */}
              {id === 'notifications' && notifCount > 0 && (
                <span style={{
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: '#B94040', color: '#FBF7EF',
                  fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 5px', flexShrink: 0,
                  animation: 'pulse 2s infinite',
                }}>
                  {notifCount}
                </span>
              )}
              {activeTab === id && notifCount === 0 && id !== 'notifications' && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B94040', flexShrink: 0 }} />
              )}
              {activeTab === id && id === 'notifications' && notifCount === 0 && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B94040', flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>

        {/* Sign out at bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(185,64,64,0.2)' }}>
          <button
            onClick={signOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 14px', borderRadius: 10,
              fontFamily: 'monospace', fontSize: 12,
              color: 'rgba(255,255,255,0.45)', background: 'transparent',
              border: '1px solid transparent', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff8a80'; e.currentTarget.style.background = 'rgba(185,64,64,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut style={{ width: 15, height: 15 }} />
            Sign Out
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="relative z-10 flex max-w-screen-2xl mx-auto">

        {/* ── Content ── */}
        <main
          className="flex-1 px-4 sm:px-6 py-6 pb-6"
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
              {!hasDevices ? (
                <NoDevicesBanner onGoToDevices={() => switchTab('devices')} />
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {SENSOR_ORDER.map(type => (
                    <SensorCard key={type} sensorType={type} data={latest[type]} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'charts' && (
            <div>
              <SectionHeader title="TREND ANALYSIS" subtitle="Live time-series data" />
              {!hasDevices ? (
                <NoDevicesBanner onGoToDevices={() => switchTab('devices')} />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <LiveChart sensorType="LY485_TEMP" data={history.LY485_TEMP} title="TEMPERATURE" />
                  <LiveChart sensorType="LY485_HUM" data={history.LY485_HUM} title="HUMIDITY" />
                </div>
              )}
            </div>
          )}

          {activeTab === 'control' && (
            <div className="max-w-2xl mx-auto">
              {!hasDevices ? (
                <NoDevicesBanner onGoToDevices={() => switchTab('devices')} />
              ) : (
                <ControlPanel />
              )}
            </div>
          )}

          {activeTab === 'energy' && (
            <div className="max-w-2xl mx-auto">
              <SectionHeader title="ENERGY TRACKING" subtitle="Pump consumption data" />
              {!hasDevices ? (
                <NoDevicesBanner onGoToDevices={() => switchTab('devices')} />
              ) : (
                <PowerStats />
              )}
            </div>
          )}

          {activeTab === 'devices' && (
            <div>
              <SectionHeader title="MY DEVICES" subtitle="Link and manage your Takamul boards" />
              <DevicesPage />
            </div>
          )}

          {activeTab === 'ota' && (
            <div>
              <SectionHeader title="FIRMWARE UPDATE" subtitle="OTA · Over-The-Air · ESP32 & STM32" />
              <OtaPage />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto">
              <SectionHeader title="PROFILE" subtitle="Manage your account" />
              <ProfilePage />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl mx-auto">
              <SectionHeader title="NOTIFICATIONS" subtitle="Sensor alerts & motor events" />
              <NotificationsPage latest={latest} />
            </div>
          )}

          {activeTab === 'support' && (
            <div className="max-w-xl mx-auto">
              <SectionHeader title="SUPPORT" subtitle="Get help from the Takamul team" />
              <SupportPage />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
