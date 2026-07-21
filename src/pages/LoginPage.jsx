import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Lock, User, AlertCircle, Eye, EyeOff, UserPlus, Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { useThemeContext } from '../ThemeContext'

export default function LoginPage() {
  const { signIn, signUp, loading, error } = useAuth()
  const { t, lang, toggleLang, isRTL } = useI18n()
  const { theme, toggleTheme } = useThemeContext()
  const [mode, setMode] = useState('login')
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
        setLocalError(t('auth.passwordMismatch'))
        return
      }
      if (password.length < 6) {
        setLocalError(t('auth.passwordTooShort'))
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
    <div className="min-h-screen flex flex-col bg-scada-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-scada-panel border-b border-scada-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="./bolt-logo.svg" alt="Tahakum Technology" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-scada-muted hover:text-primary hover:bg-scada-dim transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={toggleLang}
              className="px-3 py-2 rounded-lg text-sm font-medium text-scada-muted hover:text-primary hover:bg-scada-dim transition-colors border border-scada-border"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-scada-panel border border-scada-border rounded-2xl shadow-sm p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src="./bolt-logo.svg" alt="Tahakum Technology" className="h-14 w-auto mx-auto mb-4" />
              <h1 className="font-display font-bold text-xl tracking-widest text-scada-text">
                {t('common.brandName')}
              </h1>
              <p className="font-mono text-xs text-scada-muted mt-1">
                {t('login.subtitle')}
              </p>
            </div>

            {/* Mode switcher */}
            <div className="flex rounded-lg overflow-hidden border border-scada-border mb-6">
              {[
                { id: 'login',  label: t('auth.signIn'),  icon: Lock },
                { id: 'signup', label: t('auth.signUp'), icon: UserPlus },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchMode(id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono text-xs tracking-wider transition-all ${
                    mode === id
                      ? 'text-primary bg-primary-bg border-b-2 border-primary'
                      : 'text-scada-muted bg-transparent border-b-2 border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {signUpDone ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="font-mono text-sm text-green-600 dark:text-green-400 font-bold">{t('auth.accountCreated')}</p>
                <p className="font-mono text-xs text-scada-muted">{t('auth.checkEmail')}</p>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="mt-2 font-mono text-xs text-primary hover:underline"
                >
                  {t('auth.backToSignIn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-scada-muted">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="admin@tahakum.io"
                      className="w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm bg-scada-bg border border-scada-border text-scada-text placeholder-scada-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-scada-muted">
                    {t('auth.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-lg pl-10 pr-10 py-3 font-mono text-sm bg-scada-bg border border-scada-border text-scada-text placeholder-scada-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-scada-muted hover:text-scada-text">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest block mb-2 text-scada-muted">
                      {t('auth.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm bg-scada-bg border border-scada-border text-scada-text placeholder-scada-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                )}

                {(localError || error) && (
                  <div className="flex items-center gap-2 rounded-lg px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span className="font-mono text-xs text-red-600 dark:text-red-400">{localError || error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-display font-bold text-sm tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    loading ? 'opacity-60' : 'hover:opacity-90'
                  }`}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                  }}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'signup' ? t('auth.creating') : t('auth.authenticating')}</>
                  ) : (
                    <>
                      {mode === 'signup' ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {mode === 'signup' ? t('auth.createAccount') : t('auth.authorizeAccess')}
                    </>
                  )}
                </button>

                <p className="text-center font-mono text-xs text-scada-muted">
                  {mode === 'login' ? (
                    <>{t('auth.noAccount')}{' '}
                      <button type="button" onClick={() => switchMode('signup')}
                        className="text-primary hover:underline">
                        {t('auth.registerHere')}
                      </button>
                    </>
                  ) : (
                    <>{t('auth.haveAccount')}{' '}
                      <button type="button" onClick={() => switchMode('login')}
                        className="text-primary hover:underline">
                        {t('auth.signInHere')}
                      </button>
                    </>
                  )}
                </p>
              </form>
            )}
          </div>

          <p className="text-center font-mono text-xs mt-5 text-scada-muted/60">
            {t('login.footer')}
          </p>
        </div>
      </div>
    </div>
  )
}
