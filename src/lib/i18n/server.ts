import { headers } from 'next/headers'

import { DEFAULT_LOCALE, isLocale, pickLocaleFromHeader, translate, type Dict, type Locale } from './index'
import { getCurrentUser } from '@/lib/auth/session'

export async function getServerLocale(): Promise<Locale> {
  const user = await getCurrentUser()
  if (user && isLocale(user.preferredLanguage)) return user.preferredLanguage
  const h = await headers()
  return pickLocaleFromHeader(h.get('accept-language')) ?? DEFAULT_LOCALE
}

export async function ServerT() {
  const locale = await getServerLocale()
  return (key: keyof Dict, vars?: Record<string, string | number>) => translate(locale, key, vars)
}
