'use client'

import { useFormFields, useFormProcessing, useTranslation } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Re-renders the admin shell after the user saves their `preferredLanguage`.
 *
 * The save itself sets the `<cookiePrefix>-lng` cookie (via the afterChange
 * hook), but the currently mounted React tree was rendered with the *old*
 * cookie/locale. Without `router.refresh()`, the language picker, sidebar,
 * and field labels stay in the old language until the next navigation.
 *
 * We watch `useFormProcessing` for the `true → false` transition (save just
 * completed) — `useFormSubmitted` doesn't flip on Payload v3 form saves.
 */
export default function LanguageRefresher() {
  const router = useRouter()
  const processing = useFormProcessing()
  const langValue = useFormFields(
    ([fields]) => fields?.preferredLanguage?.value as string | undefined,
  )
  const { i18n } = useTranslation()
  const wasProcessing = useRef(false)
  const refreshedFor = useRef<string | null>(null)

  useEffect(() => {
    const justFinishedSaving = wasProcessing.current && !processing
    wasProcessing.current = processing
    if (!justFinishedSaving) return
    if (!langValue || langValue === i18n.language) return
    if (refreshedFor.current === langValue) return
    refreshedFor.current = langValue
    router.refresh()
  }, [processing, langValue, i18n.language, router])

  return null
}
