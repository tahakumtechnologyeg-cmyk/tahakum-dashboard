import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { useI18n } from './i18n/I18nContext'

function AppContent() {
  const { user, loading } = useAuth()
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-scada-bg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
            <img src="./bolt-logo.svg" alt="Tahakum Technology" className="w-10 h-10 brightness-0 invert" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-scada-border border-t-scada-accent rounded-full animate-spin" />
            <span className="font-mono text-xs text-scada-muted tracking-[0.15em] animate-pulse">{t('dashboard.title')}</span>
          </div>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
