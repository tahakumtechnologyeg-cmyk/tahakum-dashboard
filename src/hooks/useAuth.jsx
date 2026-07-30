import { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_MODE } from '../lib/demo'

const AuthContext = createContext(null)

const DEMO_ADMIN = { email: 'admin@aquacontrol.io', password: 'scada2024' }

export function AuthProvider({ children }) {

  // ─── Auto-login with demo user ───────────────────────────────
  const [user, setUser] = useState(() => {
    if (!DEMO_MODE) return null
    const saved = sessionStorage.getItem('aqua_demo_session')
    if (saved) return JSON.parse(saved)
    return { id: 'demo-admin', email: DEMO_ADMIN.email, role: 'admin' }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!DEMO_MODE) return
    if (!user) {
      const demoUser = { id: 'demo-admin', email: DEMO_ADMIN.email, role: 'admin' }
      setUser(demoUser)
      sessionStorage.setItem('aqua_demo_session', JSON.stringify(demoUser))
    }
    setLoading(false)
  }, [])

  async function signIn(email, password) {
    setError(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const demoUser = { id: 'demo-admin', email, role: 'admin' }
      setUser(demoUser)
      sessionStorage.setItem('aqua_demo_session', JSON.stringify(demoUser))
      setLoading(false)
      return { error: null }
    }
    setLoading(false)
    const err = { message: 'Invalid credentials' }
    setError(err.message)
    return { error: err }
  }

  async function signUp(email, password) {
    setError(null)
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const demoUser = { id: 'demo-admin', email: email || DEMO_ADMIN.email, role: 'admin' }
    setUser(demoUser)
    sessionStorage.setItem('aqua_demo_session', JSON.stringify(demoUser))
    setLoading(false)
    return { error: null }
  }

  async function signOut() {
    setUser(null)
    sessionStorage.removeItem('aqua_demo_session')
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
