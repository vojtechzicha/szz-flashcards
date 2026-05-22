'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_LOCALE, dictionaries, type Dict, type Locale, translate } from './index'

type I18nContextValue = {
  locale: Locale
  t: (key: keyof Dict, vars?: Record<string, string | number>) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  initialLocale,
  onLocaleChange,
}: {
  children: ReactNode
  initialLocale: Locale
  onLocaleChange?: (locale: Locale) => void | Promise<void>
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next)
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('szz-locale', next)
          document.documentElement.lang = next
        }
      } catch {}
      void onLocaleChange?.(next)
    },
    [onLocaleChange],
  )

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      t: (key: keyof Dict, vars?: Record<string, string | number>) => translate(DEFAULT_LOCALE, key, vars),
      setLocale: () => {},
    } satisfies I18nContextValue
  }
  return ctx
}

export const _allDictionaries = dictionaries
