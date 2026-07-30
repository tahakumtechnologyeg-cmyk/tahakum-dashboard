import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEMO_MODE } from '../lib/demo'

const AuthContext = createContext(null)

const DEMO_ADMIN = { email: 'admin@aquacontrol.io', password: 'scada2024' }

const SITE_URL = import.meta.env.PROD
  ? 'https://tahakumtechnologyeg-cmyk.github.io/tahakum-dashboard'
  : 'http://localhost:5173'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (DEMO_MODE) {
      const saved = sessionStorage.getItem('aqua_demo_session')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    setError(null)
    setLoading(true)

    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 800))
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        const demoUser = { id: 'demo-admin', email, role: 'admin' }
        setUser(demoUser)
        sessionStorage.setItem('aqua_demo_session', JSON.stringify(demoUser))
        setLoading(false)
        return { error: null }
      } else {
        setLoading(false)
        const err = { message: 'Invalid credentials' }
        setError(err.message)
        return { error: err }
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return { error } }
    } catch (e) {
      const msg = e.message || 'Network error — check your connection or Supabase project status'
      setError(msg)
      setLoading(false)
      return { error: { message: msg } }
    }
    setLoading(false)
    return { error: null }
  }

  async function signUp(email, password) {
    setError(null)
    setLoading(true)
    if (DEMO_MODE) {
      setLoading(false)
      return { error: { message: 'Sign-up is disabled in demo mode' } }
    }

    let data, error
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${SITE_URL}/login` },
      })
      data = res.data
      error = res.error
    } catch (e) {
      const msg = e.message || 'Network error — check your connection or Supabase project status'
      setError(msg)
      setLoading(false)
      return { error: { message: msg } }
    }

    if (error) {
      setError(error.message)
      setLoading(false)
      return { error }
    }

    if (data?.user && data?.session) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
      } catch (e) {
        // Profile upsert failed — non-fatal, DB trigger handles it
      }
    }

    setLoading(false)
    return { error: null, needsConfirmation: !data?.session }
  }

  async function signOut() {
    if (DEMO_MODE) {
      setUser(null)
      sessionStorage.removeItem('aqua_demo_session')
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
