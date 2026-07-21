import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider, useI18n } from './I18nContext'

function TestComponent() {
  const { t, lang, toggleLang, isRTL } = useI18n()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="rtl">{String(isRTL)}</span>
      <span data-testid="title">{t('dashboard.title')}</span>
      <span data-testid="nested">{t('auth.signIn')}</span>
      <span data-testid="missing">{t('nonexistent.key')}</span>
      <button data-testid="toggle" onClick={toggleLang}>Toggle</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <I18nProvider>
      <TestComponent />
    </I18nProvider>
  )
}

describe('I18nContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to English', () => {
    renderWithProvider()
    expect(screen.getByTestId('lang').textContent).toBe('en')
    expect(screen.getByTestId('rtl').textContent).toBe('false')
  })

  it('returns English translations', () => {
    renderWithProvider()
    expect(screen.getByTestId('title').textContent).toBe('SCADA Dashboard')
    expect(screen.getByTestId('nested').textContent).toBe('Sign In')
  })

  it('returns the key for missing translations', () => {
    renderWithProvider()
    expect(screen.getByTestId('missing').textContent).toBe('nonexistent.key')
  })

  it('toggles between English and Arabic', () => {
    renderWithProvider()
    expect(screen.getByTestId('lang').textContent).toBe('en')
    expect(screen.getByTestId('rtl').textContent).toBe('false')

    fireEvent.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('lang').textContent).toBe('ar')
    expect(screen.getByTestId('rtl').textContent).toBe('true')
    expect(screen.getByTestId('title').textContent).toBe('لوحة تحكم SCADA')

    fireEvent.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('persists language to localStorage', () => {
    renderWithProvider()
    fireEvent.click(screen.getByTestId('toggle'))
    expect(localStorage.getItem('lang')).toBe('ar')
  })

  it('uses saved language from localStorage', () => {
    localStorage.setItem('lang', 'ar')
    renderWithProvider()
    expect(screen.getByTestId('lang').textContent).toBe('ar')
    expect(screen.getByTestId('title').textContent).toBe('لوحة تحكم SCADA')
  })

  it('throws when useI18n is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent />)).toThrow('useI18n must be used within I18nProvider')
    consoleSpy.mockRestore()
  })
})

describe('Arabic translations coverage', () => {
  it('has all dashboard keys in Arabic', () => {
    const { ar } = require('./ar')
    const { en } = require('./en')
    const missing = Object.keys(en.dashboard).filter(k => !ar.dashboard[k])
    expect(missing).toHaveLength(0)
  })

  it('has all auth keys in Arabic', () => {
    const { ar } = require('./ar')
    const { en } = require('./en')
    const missing = Object.keys(en.auth).filter(k => !ar.auth[k])
    expect(missing).toHaveLength(0)
  })

  it('has all nav keys in Arabic', () => {
    const { ar } = require('./ar')
    const { en } = require('./en')
    const missing = Object.keys(en.nav).filter(k => !ar.nav[k])
    expect(missing).toHaveLength(0)
  })

  it('has all support keys in Arabic', () => {
    const { ar } = require('./ar')
    const { en } = require('./en')
    const missing = Object.keys(en.support).filter(k => !ar.support[k])
    expect(missing).toHaveLength(0)
  })

  it('has all login keys in Arabic', () => {
    const { ar } = require('./ar')
    const { en } = require('./en')
    const missing = Object.keys(en.login).filter(k => !ar.login[k])
    expect(missing).toHaveLength(0)
  })
})
