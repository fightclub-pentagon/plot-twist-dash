import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only run on pricing page
  if (request.nextUrl.pathname === '/pricing') {
    const response = NextResponse.next()

    // Add headers to ensure proper loading and security
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://apis.google.com https://www.googleapis.com https://*.google.com https://www.gstatic.com",
        "frame-src 'self' https://js.stripe.com https://accounts.google.com",
        "connect-src 'self' https://api.stripe.com https://js.stripe.com",
        "img-src 'self' data: https://*.stripe.com",
        "style-src 'self' 'unsafe-inline' https://js.stripe.com",
      ].join('; ')
    )

    // Add debug headers in development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('X-Debug-Env-Check', JSON.stringify({
        hasPricingTableId: !!process.env.NEXT_PUBLIC_PRICING_TABLE_ID,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        timestamp: new Date().toISOString()
      }))
    }

    return response
  }

  return NextResponse.next()
}
