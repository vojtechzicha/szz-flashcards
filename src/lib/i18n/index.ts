import cs from './cs.json'
import en from './en.json'

export const dictionaries = { cs, en } as const

export type Locale = keyof typeof dictionaries
export type Dict = typeof cs

export const SUPPORTED_LOCALES: Locale[] = ['cs', 'en']
export const DEFAULT_LOCALE: Locale = 'cs'

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'cs' || value === 'en'
}

export function pickLocaleFromHeader(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const tags = acceptLanguage
    .split(',')
    .map((t) => t.trim().split(';')[0].toLowerCase())
  for (const tag of tags) {
    const code = tag.slice(0, 2)
    if (isLocale(code)) return code
  }
  return DEFAULT_LOCALE
}

export function translate(locale: Locale, key: keyof Dict, vars?: Record<string, string | number>): string {
  const dict = dictionaries[locale] as Record<string, string>
  let value = dict[key as string] ?? (dictionaries.en as Record<string, string>)[key as string] ?? (key as string)
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return value
}
