import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A2A6E 0%, #0E4A9C 30%, #1565C0 55%, #0D47A1 80%, #083170 100%)' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(100,210,255,0.2) 0%, transparent 60%)'
        }} />
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center animate-logoPulse"
            style={{ background: 'linear-gradient(135deg, #B94040, #8B2020)' }}>
            <img src="./bolt-logo.svg" alt="Tahakum Technology" className="w-10 h-10" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="font-mono text-xs text-white/60 tracking-[0.15em] animate-pulse">INITIALIZING SCADA</span>
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
