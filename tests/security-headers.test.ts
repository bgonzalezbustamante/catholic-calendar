import { describe, expect, it } from 'vitest'

import nextConfig from '@/next.config'

describe('security headers', () => {
  it('does not advertise the framework', () => {
    expect(nextConfig.poweredByHeader).toBe(false)
  })

  it('sends frame, referrer and permissions headers on every route', async () => {
    const rules = (await nextConfig.headers?.()) ?? []
    const allRoutes = rules.find((rule) => rule.source === '/:path*')

    expect(
      Object.fromEntries(allRoutes?.headers.map(({ key, value }) => [key, value]) ?? [])
    ).toEqual({
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "frame-ancestors 'none'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    })
  })
})
