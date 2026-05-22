'use client'

import { useFormFields, useTranslation } from '@payloadcms/ui'

import { FlashcardFace } from '@/components/Flashcard'
import type { LexicalContent } from '@/lexical/render'

export default function CardSidebarPreview() {
  const front = useFormFields<LexicalContent>(
    ([fields]) => (fields?.front?.value as LexicalContent) ?? null,
  )
  const back = useFormFields<LexicalContent>(
    ([fields]) => (fields?.back?.value as LexicalContent) ?? null,
  )
  const { i18n } = useTranslation()
  const cs = i18n.language === 'cs'

  return (
    <div className="flashcard-sidebar-preview">
      <div className="flashcard-sidebar-preview__section">
        <span className="flashcard-sidebar-preview__label">
          {cs ? 'Přední strana' : 'Front'}
        </span>
        <FlashcardFace
          content={front}
          side="front"
          className="card-face-static--mini"
          emptyFallback={
            <span className="flashcard-preview__empty">
              {cs ? '— prázdné —' : '— empty —'}
            </span>
          }
        />
      </div>
      <div className="flashcard-sidebar-preview__section">
        <span className="flashcard-sidebar-preview__label">
          {cs ? 'Zadní strana' : 'Back'}
        </span>
        <FlashcardFace
          content={back}
          side="back"
          className="card-face-static--mini"
          emptyFallback={
            <span className="flashcard-preview__empty">
              {cs ? '— prázdné —' : '— empty —'}
            </span>
          }
        />
      </div>
    </div>
  )
}
