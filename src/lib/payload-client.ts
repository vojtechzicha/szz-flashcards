import { getPayload } from 'payload'

import config from '@/payload.config'

let cached: Promise<Awaited<ReturnType<typeof getPayload>>> | null = null

export async function payloadClient() {
  if (!cached) cached = getPayload({ config })
  return cached
}
