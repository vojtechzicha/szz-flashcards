import { NextResponse, type NextRequest } from 'next/server'

/**
 * Redirect Payload's `/admin/login` to the unified app sign-in page,
 * carrying `callbackUrl=/admin` so the user lands in the admin after
 * signing in. Skip RSC prefetches so Payload admin's sibling-route
 * prefetching doesn't loop on the redirect.
 */
export const config = {
  matcher: ['/admin/login'],
}

export default function proxy(req: NextRequest) {
  if (
    req.headers.get('RSC') === '1' ||
    req.headers.get('Next-Router-Prefetch') === '1' ||
    req.headers.get('purpose') === 'prefetch'
  ) {
    return NextResponse.next()
  }

  const url = new URL('/sign-in', req.url)
  url.searchParams.set('callbackUrl', '/admin')
  return NextResponse.redirect(url)
}
