import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../hooks/useAuth'

vi.mock('../lib/demo', () => ({
  DEMO_MODE: true,
}))

function TestComponent() {
  const { user, loading, error, signIn, signOut } = useAuth()
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
    sessionStorage.clear()
  })

  it('auto-logs in with demo user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('user').textContent).toBe('admin@aquacontrol.io')
  })

  it('signs out and clears user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('admin@aquacontrol.io')
    })

    fireEvent.click(screen.getByTestId('signout'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })
})
