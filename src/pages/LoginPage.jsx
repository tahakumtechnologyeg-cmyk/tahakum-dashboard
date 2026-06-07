import { useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Lock, User, AlertCircle, Eye, EyeOff, UserPlus, Cpu } from 'lucide-react'

function Particles() {
  const circles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 6,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {circles.map(c => (
        <div
          key={c.id}
          className="absolute rounded-full"
          style={{
            width: c.size,
            height: c.size,
            left: `${c.left}%`,
            bottom: '-10px',
            background: c.id % 3 === 0
              ? 'rgba(0, 180, 255, 0.6)'
              : c.id % 3 === 1
                ? 'rgba(100, 210, 255, 0.4)'
                : 'rgba(185, 64, 64, 0.3)',
            animation: `particleRise ${c.duration}s ease-in-out ${c.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const { signIn, signUp, loading, error } = useAuth()
  const [mode, setMode] = useState('login')   // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [signUpDone, setSignUpDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError(null)

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match')
        return
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters')
        return
      }
      const { error } = await signUp(email, password)
      if (error) { setLocalError(error.message); return }
      setSignUpDone(true)
      return
    }

    const { error } = await signIn(email, password)
    if (error) setLocalError(error.message)
  }

  function switchMode(m) {
    setMode(m)
    setLocalError(null)
    setSignUpDone(false)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden font-body"
      style={{ background: 'linear-gradient(160deg, #0A2A6E 0%, #0E4A9C 30%, #1565C0 55%, #0D47A1 80%, #083170 100%)' }}
    >
      {/* Sky glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(100,210,255,0.25) 0%, rgba(30,136,229,0.12) 50%, transparent 80%)'
      }} />

      {/* Grid floor */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(100,210,255,0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,210,255,0.10) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)'
      }} />

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)'
      }} />

      <Particles />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-5 animate-slideUp">
        <div className="animate-borderGlow" style={{
          border: '1px solid rgba(0,180,255,0.35)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          background: 'rgba(5,20,45,0.82)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 60px rgba(0,140,255,0.15), 0 24px 48px rgba(0,0,0,0.4)'
        }}>

          {/* Logo */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-4">
              <div className="animate-logoPulse" style={{
                width: 64, height: 64, borderRadius: 14,
                background: 'linear-gradient(135deg, #B94040, #8B2020)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(185,64,64,0.5)'
              }}>
                <img src="./bolt-logo.svg" alt="Takamul" style={{ width: 40, height: 40 }} />
              </div>
            </div>
            <div className="font-display font-bold text-xl tracking-widest mb-1" style={{ color: '#E0F4FF', letterSpacing: '0.2em' }}>
              TAKAMUL
            </div>
            <p className="font-mono text-xs tracking-widest" style={{ color: 'rgba(0,200,255,0.7)' }}>
              SMART SOLUTION — WATER TREATMENT
            </p>
          </div>

          {/* Mode switcher */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 mb-6">
            {[
              { id: 'login',  label: 'Sign In',  icon: Lock },
              { id: 'signup', label: 'Register', icon: UserPlus },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchMode(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 font-mono text-xs tracking-wider transition-all"
                style={{
                  background: mode === id ? 'rgba(0,160,255,0.25)' : 'transparent',
                  color: mode === id ? '#E0F4FF' : 'rgba(100,180,255,0.5)',
                  borderBottom: mode === id ? '2px solid rgba(0,200,255,0.7)' : '2px solid transparent',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Sign-up success state */}
          {signUpDone ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <p className="font-mono text-sm text-green-300 font-bold">Account Created!</p>
              <p className="font-mono text-xs" style={{ color: 'rgba(0,200,255,0.7)' }}>
                Check your email to confirm your account, then sign in.
              </p>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="mt-2 font-mono text-xs underline"
                style={{ color: 'rgba(0,200,255,0.7)' }}
              >
                Back to Sign In →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="admin@aquacontrol.io"
                icon={User}
              />

              {/* Password */}
              <div>
                <label className="font-mono text-xs uppercase tracking-widest block mb-2" style={{ color: 'rgba(0,180,255,0.6)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0,180,255,0.5)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg pl-10 pr-10 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-scada-accent/50"
                    style={{ background: 'rgba(0,30,70,0.6)', border: '1px solid rgba(0,150,220,0.3)', color: '#E0F4FF', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,200,255,0.7)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,150,220,0.3)'}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(0,180,255,0.5)' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password (signup only) */}
              {mode === 'signup' && (
                <InputField
                  label="Confirm Password"
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="••••••••"
                  icon={Lock}
                />
              )}

              {/* Error */}
              {(localError || error) && (
                <div className="flex items-center gap-2 rounded-lg px-4 py-3"
                  style={{ background: 'rgba(185,64,64,0.15)', border: '1px solid rgba(185,64,64,0.35)' }}>
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#ff6b6b' }} />
                  <span className="font-mono text-xs" style={{ color: '#ff9999' }}>{localError || error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-display font-bold text-sm tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${!loading ? 'card-hover' : ''}`}
                style={{
                  background: 'linear-gradient(135deg, rgba(0,140,220,0.9), rgba(0,100,180,0.9))',
                  color: '#E0F4FF',
                  border: '1px solid rgba(0,200,255,0.4)',
                  boxShadow: '0 0 24px rgba(0,160,255,0.3)',
                  animation: loading ? 'none' : 'pulseGlow 2.5s ease-in-out infinite',
                }}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'signup' ? 'CREATING...' : 'AUTHENTICATING...'}</>
                ) : (
                  <>
                    {mode === 'signup' ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {mode === 'signup' ? 'CREATE ACCOUNT' : 'AUTHORIZE ACCESS'}
                  </>
                )}
              </button>

              {/* Switch link */}
              <p className="text-center font-mono text-xs" style={{ color: 'rgba(0,150,200,0.6)' }}>
                {mode === 'login' ? (
                  <>No account?{' '}
                    <button type="button" onClick={() => switchMode('signup')}
                      className="underline" style={{ color: 'rgba(0,200,255,0.8)' }}>
                      Register here
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')}
                      className="underline" style={{ color: 'rgba(0,200,255,0.8)' }}>
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </form>
          )}
        </div>

        <p className="text-center font-mono text-xs mt-5" style={{ color: 'rgba(0,150,200,0.4)' }}>
          Takamul Smart Solution v2.4.1
        </p>
      </div>
    </div>
  )
}

function InputField({ label, type, value, onChange, placeholder, icon: Icon }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-widest block mb-2" style={{ color: 'rgba(0,180,255,0.6)' }}>
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0,180,255,0.5)' }} />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className="w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-scada-accent/50"
          style={{ background: 'rgba(0,30,70,0.6)', border: '1px solid rgba(0,150,220,0.3)', color: '#E0F4FF', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,200,255,0.7)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,150,220,0.3)'}
        />
      </div>
    </div>
  )
}
