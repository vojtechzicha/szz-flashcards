'use client'

import Link from 'next/link'
import { useTranslation } from '@payloadcms/ui'

export default function BackToApp() {
  const { i18n } = useTranslation()
  const label = i18n.language === 'en' ? 'Back to app' : 'Zpět do aplikace'

  return (
    <Link
      href="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </Link>
  )
}
