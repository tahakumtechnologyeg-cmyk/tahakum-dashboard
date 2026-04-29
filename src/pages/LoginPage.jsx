import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Droplets, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { signIn, loading, error } = useAuth()
  const [email, setEmail] = useState('admin@aquacontrol.io')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [localError, setLocalError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError(null)
    const { error } = await signIn(email, password)
    if (error) setLocalError(error.message)
  }

  return (
    <div className="min-h-screen bg-scada-bg flex items-center justify-center relative overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      {/* Top color bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-scada-accent via-scada-green to-scada-accent" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="./bolt-logo.svg" alt="Takamul Logo" className="w-20 h-20 rounded-2xl shadow-2xl" style={{ boxShadow: '0 0 30px rgba(211,47,47,0.4)' }} />
          </div>
          <p className="font-body text-scada-text text-sm tracking-wider">SMART SOLUTION — WATER TREATMENT</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px flex-1 bg-scada-border" />
            <span className="font-mono text-xs text-scada-muted">SECURE ACCESS</span>
            <div className="h-px flex-1 bg-scada-border" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}
          className="bg-scada-panel border border-scada-border rounded-xl p-8 space-y-6"
          style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="font-mono text-xs text-scada-muted uppercase tracking-wider block mb-2">
                User / Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-scada-bg border border-scada-border rounded-lg pl-10 pr-4 py-3 font-mono text-sm text-white placeholder-scada-muted focus:outline-none focus:border-scada-accent transition-colors"
                  placeholder="admin@aquacontrol.io"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-xs text-scada-muted uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-scada-bg border border-scada-border rounded-lg pl-10 pr-12 py-3 font-mono text-sm text-white placeholder-scada-muted focus:outline-none focus:border-scada-accent transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-scada-muted hover:text-scada-text transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {(localError || error) && (
            <div className="flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-scada-red shrink-0" />
              <span className="font-mono text-xs text-scada-red">{localError || error}</span>
            </div>
          )}

          {/* Demo hint */}
 

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-scada-accent text-scada-bg font-display font-bold text-sm tracking-widest py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-scada-bg/30 border-t-scada-bg rounded-full animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                AUTHORIZE ACCESS
              </>
            )}
          </button>
        </form>

        <p className="text-center font-mono text-xs text-scada-muted mt-6">
          Takamul Smart Solution v2.4.1 · ESP32-S3 + STM32 Integration
        </p>
      </div>
    </div>
  )
}
