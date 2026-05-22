'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  RelationshipField,
  useField,
  useFieldPath,
  useFormFields,
} from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'

type Mode = 'flat' | 'topical' | null

const TopicField: FieldClientComponent = (props) => {
  const subjectValue = useFormFields(
    ([fields]) => fields?.subject?.value as string | number | null | undefined,
  )
  const subjectId =
    subjectValue && typeof subjectValue === 'object'
      ? (subjectValue as { id?: string | number }).id
      : subjectValue

  const [mode, setMode] = useState<Mode>(null)
  const path = useFieldPath()
  const { value, setValue } = useField<unknown>({ path })

  useEffect(() => {
    if (!subjectId) {
      setMode(null)
      return
    }
    const controller = new AbortController()
    fetch(`/api/subjects/${subjectId}?depth=0`, { signal: controller.signal })
      .then((r) => r.json())
      .then((s) => {
        const next = (s?.mode as Mode) ?? null
        setMode(next)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [subjectId])

  useEffect(() => {
    if (mode === 'flat' && value != null && value !== '') {
      setValue(null)
    }
  }, [mode, value, setValue])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requiredProps = useMemo<any>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const original = (props as any).field ?? {}
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(props as any),
      field: { ...original, required: true },
    }
  }, [props])

  if (!subjectId) return null
  if (mode !== 'topical') return null

  return <RelationshipField {...requiredProps} />
}

export default TopicField
