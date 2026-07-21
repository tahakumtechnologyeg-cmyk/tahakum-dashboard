import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ar } from './ar'
import { en } from './en'

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang')
      if (stored === 'ar' || stored === 'en') return stored
    }
    return 'en'
  })

  const isRTL = lang === 'ar'
  const translations = { en, ar }

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }, [lang, isRTL])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = translations[lang]
    for (const k of keys) {
      if (val == null || typeof val !== 'object') return key
      val = val[k]
    }
    if (typeof val === 'string') return val
    return key
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'ar' : 'en')
  }, [])

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, isRTL }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
