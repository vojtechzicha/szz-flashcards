'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'dark' | 'light'

export const SUPPORTED_THEMES: Theme[] = ['dark', 'light']
export const DEFAULT_THEME: Theme = 'dark'

export function isTheme(value: string | undefined | null): value is Theme {
  return value === 'dark' || value === 'light'
}

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  initialTheme,
  onThemeChange,
}: {
  children: ReactNode
  initialTheme: Theme
  onThemeChange?: (theme: Theme) => void | Promise<void>
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('szz-theme', next)
          document.documentElement.dataset.theme = next
        }
      } catch {}
      void onThemeChange?.(next)
    },
    [onThemeChange],
  )

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    return { theme: DEFAULT_THEME, setTheme: () => {} } satisfies ThemeContextValue
  }
  return ctx
}
