import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../hooks/useAuth'

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

vi.mock('../lib/demo', () => ({
  DEMO_MODE: true,
}))

function TestComponent() {
  const { user, loading, error, signIn, signUp, signOut } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="error">{error || 'null'}</span>
      <button data-testid="signin" onClick={() => signIn('admin@aquacontrol.io', 'scada2024')}>Sign In</button>
      <button data-testid="signin-bad" onClick={() => signIn('bad@test.com', 'wrong')}>Bad Sign In</button>
      <button data-testid="signout" onClick={signOut}>Sign Out</button>
    </div>
  )
}

describe('useAuth (Demo mode)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with loading=true then resolves to no user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('signs in with demo credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    fireEvent.click(screen.getByTestId('signin'))
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('admin@aquacontrol.io')
    })
  })

  it('rejects invalid demo credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    fireEvent.click(screen.getByTestId('signin-bad'))
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).not.toBe('null')
    })
  })

  it('signs out and clears user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    fireEvent.click(screen.getByTestId('signin'))
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('admin@aquacontrol.io')
    })

    fireEvent.click(screen.getByTestId('signout'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })
})
