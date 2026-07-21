import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useThemeContext } from './ThemeContext'

function TestComponent() {
  const { theme, toggleTheme } = useThemeContext()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to light theme when no preference', () => {
    renderWithProvider()
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('uses dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    renderWithProvider()
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles between light and dark', () => {
    renderWithProvider()
    expect(screen.getByTestId('theme').textContent).toBe('light')

    fireEvent.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)

    fireEvent.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists theme to localStorage', () => {
    renderWithProvider()
    fireEvent.click(screen.getByTestId('toggle'))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('throws when useThemeContext is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent />)).toThrow('useThemeContext must be used within ThemeProvider')
    consoleSpy.mockRestore()
  })
})
