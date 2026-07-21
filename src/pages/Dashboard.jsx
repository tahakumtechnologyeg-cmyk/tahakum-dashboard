import { useState } from 'react'
import { LogOut, LayoutDashboard, LineChart, Settings, Zap, User, Cpu, Bell, HeadphonesIcon, Upload, Moon, Sun, Plus, Power, ChevronUp, ChevronDown, RotateCcw, GaugeIcon, Activity, BarChart3 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTelemetry } from '../hooks/useTelemetry'
import { useDashboardConfig } from '../hooks/useDashboardConfig'
import { useI18n } from '../i18n/I18nContext'
import { useThemeContext } from '../ThemeContext'
import SensorCard from '../components/SensorCard'
import AddSensorModal from '../components/AddSensorModal'
import AddOutputModal from '../components/AddOutputModal'
import LiveChart from '../components/LiveChart'
import PowerStats from '../components/PowerStats'
import AlertsPanel from '../components/AlertsPanel'
import ProfilePage from '../components/ProfilePage'
import DevicesPage from '../components/DevicesPage'
import NotificationsPage, { getNotifCount } from '../components/NotificationsPage'
import SupportPage from '../components/SupportPage'
import OtaPage from '../components/OtaPage'
import OutputCard from '../components/OutputCard'
import { SENSORS } from '../lib/thresholds'

const TABS = [
  { id: 'sensors',       icon: LayoutDashboard },
  { id: 'charts',        icon: LineChart },
  { id: 'control',       icon: Settings },
  { id: 'energy',        icon: Zap },
  { id: 'devices',       icon: Cpu },
  { id: 'ota',           icon: Upload },
  { id: 'notifications', icon: Bell },
  { id: 'support',       icon: HeadphonesIcon },
  { id: 'profile',       icon: User },
]

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between pb-1 border-b border-scada-border mb-4 animate-slideDown">
      <div>
        <h2 className="font-display text-xs font-bold tracking-widest text-scada-text">{title}</h2>
        {subtitle && <p className="font-body text-xs mt-0.5 text-scada-muted">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

function NoDevicesBanner({ onGoToDevices }) {
  const { t } = useI18n()
  return (
    <div className="animate-scaleIn flex flex-col items-center justify-center text-center mt-4 p-12 bg-scada-panel border border-dashed border-scada-border rounded-2xl">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-scada-border">
        <Cpu className="w-6 h-6 text-scada-muted" />
      </div>
      <h3 className="font-mono font-bold text-sm tracking-widest text-scada-text mb-2">{t('dashboard.noDevice')}</h3>
      <p className="font-mono text-xs text-scada-muted max-w-[280px] mb-5">{t('dashboard.noDeviceDesc')}</p>
      <button onClick={onGoToDevices} className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold tracking-widest text-white transition-all hover:opacity-90"
        style={{ background: 'var(--color-primary)' }}>{t('dashboard.addDevice')}</button>
    </div>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { latest, history, connected, hasDevices } = useTelemetry()
  const { t, lang, toggleLang, isRTL } = useI18n()
  const { theme, toggleTheme } = useThemeContext()
  const { sensors: activeSensors, outputs: activeOutputs, addSensor, deleteSensor, addOutput, deleteOutput } = useDashboardConfig()
  const [activeTab, setActiveTab] = useState('sensors')
  const [transitioning, setTransitioning] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const notifCount = getNotifCount(latest)

  const [showAddSensor, setShowAddSensor] = useState(false)
  const [showAddOutput, setShowAddOutput] = useState(false)

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
    <div className="min-h-screen font-body bg-scada-bg">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 bg-scada-panel border-b border-scada-border shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 h-12 sm:h-14">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button onClick={() => setDrawerOpen(o => !o)} className="p-1.5 rounded-lg transition-colors hover:bg-scada-dim mr-1 text-scada-text" aria-label={t('common.menu')}>
              <div className="flex flex-col gap-[5px]">
                <span className="block w-5 h-0.5 bg-current rounded" style={{ transition: 'transform 0.3s', transform: drawerOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
                <span className="block w-5 h-0.5 bg-current rounded" style={{ transition: 'opacity 0.3s', opacity: drawerOpen ? 0 : 1 }} />
                <span className="block w-5 h-0.5 bg-current rounded" style={{ transition: 'transform 0.3s', transform: drawerOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
              </div>
            </button>
            <img src="./bolt-logo.svg" alt="Tahakum Technology" className="w-7 h-7 sm:w-8 sm:h-8" />
            <div className="hidden sm:block">
              <div className="font-display text-sm font-bold tracking-widest leading-none text-scada-text">TAHAKUM TECHNOLOGY</div>
              <div className="font-mono text-[10px] sm:text-xs leading-none mt-0.5 text-scada-muted">تحكم تكنولوجي</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-scada-muted hover:text-primary hover:bg-scada-dim transition-colors">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={toggleLang} className="px-3 py-1.5 rounded-lg text-xs font-medium text-scada-muted hover:text-primary hover:bg-scada-dim transition-colors border border-scada-border">
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-scada-border'}`} />
            <div className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 border border-scada-border rounded-lg bg-scada-dim/50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs text-scada-text max-w-[80px] sm:max-w-none truncate">{user?.email?.split('@')[0]}</span>
            </div>
            <button onClick={signOut} className="p-1.5 sm:p-2 text-scada-muted hover:text-scada-text transition-colors" title={t('nav.signOut')}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Drawer Overlay ── */}
      <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-45 bg-black/50 transition-opacity duration-300"
        style={{ opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? 'all' : 'none' }} />

      {/* ── Drawer ── */}
      <nav className="fixed top-0 bottom-0 z-50 w-60 bg-scada-panel border-r border-scada-border shadow-xl flex flex-col transition-transform duration-300"
        style={{
          left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto',
          transform: drawerOpen ? 'translateX(0)' : isRTL ? 'translateX(100%)' : 'translateX(-100%)',
        }}>
        <div className="h-12 bg-scada-bg border-b border-scada-border flex items-center px-4 gap-2 shrink-0">
          <button onClick={() => setDrawerOpen(false)} className="p-1 text-scada-text">
            <div className="flex flex-col gap-[5px]">
              <span className="block w-5 h-0.5 bg-current rounded" style={{ transform: 'rotate(45deg) translateY(6px)' }} />
              <span className="block w-5 h-0.5 bg-current rounded" style={{ opacity: 0 }} />
              <span className="block w-5 h-0.5 bg-current rounded" style={{ transform: 'rotate(-45deg) translateY(-6px)' }} />
            </div>
          </button>
          <span className="font-mono text-xs font-bold tracking-widest text-scada-text">{t('nav.menu')}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {TABS.map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => handleTabClick(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono mb-1 transition-all ${
                activeTab === id ? 'text-primary bg-primary-bg' : 'text-scada-muted hover:text-scada-text hover:bg-scada-dim'
              }`}>
              <Icon size={16} className="shrink-0" />
              <span className="flex-1 text-left">{t(`nav.${id}`)}</span>
              {id === 'notifications' && notifCount > 0 && (
                <span className="min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 text-white shrink-0"
                  style={{ background: 'var(--color-primary)' }}>{notifCount}</span>
              )}
              {activeTab === id && notifCount === 0 && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-primary)' }} />}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-scada-border">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-mono text-scada-muted hover:text-scada-text hover:bg-scada-dim transition-all">
            <LogOut size={16} /> {t('nav.signOut')}
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="relative z-10 flex max-w-screen-2xl mx-auto">
        <main className="flex-1 px-4 sm:px-6 py-6 pb-6" style={{
          opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
          transition: transitioning ? 'opacity 0.18s ease-in, transform 0.18s ease-in' : 'opacity 0.28s ease-out, transform 0.28s ease-out',
        }}>
          <div key={activeTab} className="animate-fadeIn">

          {/* ═══════════════ SENSOR OVERVIEW ═══════════════ */}
          {activeTab === 'sensors' && (
            <div>
              <SectionHeader title={t('dashboard.sensors')} subtitle={t('dashboard.sensorsSub')}
                action={
                  <button onClick={() => setShowAddSensor(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-widest text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--color-primary)' }}>
                    <Plus size={14} /> {t('dashboard.addSensor')}
                  </button>
                }
              />
              {showAddSensor && <AddSensorModal onClose={() => setShowAddSensor(false)} onAdd={addSensor} existingIds={activeSensors.map(s => s.id)} />}
              {activeSensors.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center text-center p-8 bg-scada-panel border border-dashed border-scada-border rounded-2xl">
                  <Plus className="w-8 h-8 text-scada-muted mb-3" />
                  <p className="font-mono text-xs text-scada-muted">{t('dashboard.noCustomSensors')}</p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {activeSensors.map((s, i) => (
                    <div key={s.id} className={`animate-slideUp stagger-${(i % 10) + 1} relative group`}>
                      {s.builtIn ? (
                        <SensorCard sensorType={s.id} data={latest[s.id]} />
                      ) : (
                        <div className="card-hover relative bg-scada-panel border border-scada-border rounded-xl p-5 shadow-sm">
                          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 bg-primary" style={{ transform: 'translate(50%, -50%)' }} />
                          </div>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg border border-primary/40 bg-primary/10"><GaugeIcon className="w-4 h-4 text-primary" /></div>
                              <div>
                                <div className="font-display text-xs font-bold tracking-widest text-scada-text">{s.name}</div>
                                <div className="font-body text-xs text-scada-muted mt-0.5">{t('dashboard.customSensor')}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-3xl font-bold text-primary">—</span>
                              <span className="font-mono text-sm text-scada-muted">{s.unit}</span>
                            </div>
                            <div className="font-body text-xs text-scada-muted mt-1">{s.rangeMin || s.min} – {s.rangeMax || s.max} {s.unit}</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="relative h-2 rounded-full bg-scada-bg overflow-hidden">
                              <div className="absolute h-full rounded-full bg-primary/30" style={{ width: '50%' }} />
                            </div>
                            <div className="flex justify-between font-mono text-xs text-scada-muted">
                              <span>{s.rangeMin || s.min}</span><span>{s.unit}</span><span>{s.rangeMax || s.max}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Delete button overlay */}
                       <button onClick={() => deleteSensor(s.id)}
                        className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-scada-panel border border-scada-border shadow-md flex items-center justify-center text-scada-muted opacity-0 group-hover:opacity-100 hover:text-scada-red transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ TREND ANALYSIS ═══════════════ */}
          {activeTab === 'charts' && (
            <div>
              <SectionHeader title={t('dashboard.trends')} subtitle={t('dashboard.trendsSub')} />
              {!hasDevices ? (
                <NoDevicesBanner onGoToDevices={() => switchTab('devices')} />
              ) : activeSensors.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-4 p-12 bg-scada-panel border border-dashed border-scada-border rounded-2xl">
                  <BarChart3 className="w-8 h-8 text-scada-muted mb-3" />
                  <p className="font-mono text-xs text-scada-muted">{t('dashboard.noCustomSensors')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeSensors.map((s, i) => {
                    const cfg = SENSORS[s.id]
                    const title = cfg ? `${cfg.label} (${cfg.unit})` : `${s.name} (${s.unit})`
                    return (
                      <div key={s.id} className={`animate-slideUp stagger-${(i % 10) + 1} relative group`}>
                        {cfg && history[s.id] ? (
                          <LiveChart sensorType={s.id} data={history[s.id]} title={title} />
                        ) : (
                          <div className="card-hover bg-scada-panel border border-scada-border rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-display text-sm font-bold tracking-widest text-scada-text">{title}</h3>
                                <p className="font-body text-xs text-scada-muted mt-0.5">{t('dashboard.noTrendData')}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-scada-muted" />
                                <span className="font-mono text-xs text-scada-muted">—</span>
                              </div>
                            </div>
                            <div className="h-[180px] flex items-center justify-center border border-dashed border-scada-border rounded-xl">
                              <div className="text-center">
                                <Activity className="w-8 h-8 text-scada-muted/40 mx-auto mb-2" />
                                <p className="font-mono text-xs text-scada-muted">{s.rangeMin || s.min} – {s.rangeMax || s.max} {s.unit}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ OUTPUT CONTROL PANEL ═══════════════ */}
          {activeTab === 'control' && (
            <div className="animate-slideUp">
              {showAddOutput && <AddOutputModal onClose={() => setShowAddOutput(false)} onAdd={addOutput} />}
              <SectionHeader title={t('dashboard.control')} subtitle="VFD · Relays · Contactors · Motors"
                action={
                  <button onClick={() => setShowAddOutput(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-widest text-white transition-all hover:opacity-90"
                    style={{ background: 'var(--color-primary)' }}>
                    <Plus size={14} /> {t('dashboard.addOutput')}
                  </button>
                }
              />
              {activeOutputs.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-4 p-12 bg-scada-panel border border-dashed border-scada-border rounded-2xl">
                  <Plus className="w-8 h-8 text-scada-muted mb-3" />
                  <p className="font-mono text-xs text-scada-muted">{t('dashboard.noCustomOutputs')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeOutputs.map((o, i) => (
                    <div key={o.id} className={`animate-slideUp stagger-${(i % 10) + 1}`}>
                      <OutputCard output={o} onDelete={(id) => deleteOutput(id)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ OTHER TABS ═══════════════ */}
          {activeTab === 'energy' && (
            <div className="max-w-2xl mx-auto animate-slideUp">
              <SectionHeader title={t('dashboard.energy')} subtitle={t('dashboard.energySub')} />
              {!hasDevices ? <NoDevicesBanner onGoToDevices={() => switchTab('devices')} /> : <PowerStats outputs={activeOutputs} />}
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="animate-slideUp">
              <SectionHeader title={t('dashboard.devices')} subtitle={t('dashboard.devicesSub')} />
              <DevicesPage />
            </div>
          )}

          {activeTab === 'ota' && (
            <div className="animate-slideUp">
              <SectionHeader title={t('dashboard.ota')} subtitle={t('dashboard.otaSub')} />
              <OtaPage />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto animate-slideUp">
              <SectionHeader title={t('dashboard.profile')} subtitle={t('dashboard.profileSub')} />
              <ProfilePage />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl mx-auto animate-slideUp">
              <SectionHeader title={t('dashboard.notifications')} subtitle={t('dashboard.notificationsSub')} />
              <NotificationsPage latest={latest} />
            </div>
          )}

          {activeTab === 'support' && (
            <div className="max-w-xl mx-auto animate-slideUp">
              <SectionHeader title={t('dashboard.support')} subtitle={t('dashboard.supportSub')} />
              <SupportPage />
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}
