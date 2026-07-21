import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { DEMO_MODE } from '../lib/demo'

const AuthContext = createContext(null)

// Demo credentials (replace with Supabase Auth in production)
const DEMO_ADMIN = { email: 'admin@aquacontrol.io', password: 'scada2024' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Clear old localStorage auth so tab-close = sign-out
  useEffect(() => {
    // Remove any lingering Supabase auth tokens from localStorage
    Object.keys(localStorage).forEach(k => { if (k.startsWith('sb-') || k.startsWith('supabase.')) localStorage.removeItem(k) })
    localStorage.removeItem('aqua_demo_session')
  }, [])

  useEffect(() => {
    if (DEMO_MODE) {
      // Check local session
      const saved = sessionStorage.getItem('aqua_demo_session')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
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
      await new Promise(r => setTimeout(r, 800)) // simulate latency
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

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
    return { error }
  }

  async function signUp(email, password) {
    setError(null)
    setLoading(true)
    if (DEMO_MODE) {
      setLoading(false)
      return { error: { message: 'Sign-up is disabled in demo mode' } }
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return { error }
    }

    // Safety-net: if auto-confirm is ON the session is live immediately,
    // so we upsert the profile row here too (the DB trigger handles it
    // when confirmation is required).
    if (data?.user && data?.session) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
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
