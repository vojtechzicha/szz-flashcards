'use client'

import { useEffect, useRef } from 'react'
import {
  NumberField,
  useDocumentInfo,
  useField,
  useFieldPath,
  useFormFields,
} from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'

function extractId(v: unknown): string | number | null {
  if (v == null) return null
  if (typeof v === 'object') {
    const id = (v as { id?: string | number }).id
    return id ?? null
  }
  return v as string | number
}

const OrderField: FieldClientComponent = (props) => {
  const { id: docId } = useDocumentInfo()
  const subjectValue = useFormFields(([fields]) => fields?.subject?.value)
  const topicValue = useFormFields(([fields]) => fields?.topic?.value)
  const subjectId = extractId(subjectValue)
  const topicId = extractId(topicValue)

  const path = useFieldPath()
  const { value, setValue } = useField<number | null | undefined>({ path })

  const lastAutoFilled = useRef<number | null>(null)

  useEffect(() => {
    if (docId) return
    if (!subjectId) return

    const userTouched =
      value !== undefined &&
      value !== null &&
      value !== 0 &&
      value !== lastAutoFilled.current
    if (userTouched) return

    const params = new URLSearchParams()
    params.set('where[subject][equals]', String(subjectId))
    if (topicId) {
      params.set('where[topic][equals]', String(topicId))
    } else {
      params.set('where[topic][exists]', 'false')
    }
    params.set('sort', '-order')
    params.set('limit', '1')
    params.set('depth', '0')

    const controller = new AbortController()
    fetch(`/api/cards?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const last = data?.docs?.[0]
        const lastOrder = typeof last?.order === 'number' ? last.order : 0
        const next = lastOrder + 1
        lastAutoFilled.current = next
        setValue(next)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [docId, subjectId, topicId, value, setValue])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <NumberField {...(props as any)} />
}

export default OrderField
