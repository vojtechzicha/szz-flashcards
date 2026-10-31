// Fixed-window rate limit, in memory and per function instance: it resets on cold
// starts and isn't shared between instances, which is enough to blunt a runaway client.

interface Entry {
  count: number
  resetTime: number
}

const store = new Map<string, Entry>()

export function checkRateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now()
  if (Math.random() < 0.01) {
    for (const [k, e] of store) if (now >= e.resetTime) store.delete(k)
  }
  const entry = store.get(key)
  if (!entry || now >= entry.resetTime) {
    const resetTime = now + windowMs
    store.set(key, { count: 1, resetTime })
    return { success: true, resetTime }
  }
  if (entry.count >= limit) return { success: false, resetTime: entry.resetTime }
  entry.count++
  return { success: true, resetTime: entry.resetTime }
}
