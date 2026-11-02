import { describe, expect, it } from 'vitest'

import { currentRelease, releases } from '../lib/releases'

describe('release notes', () => {
  it('keeps the upcoming beta explicitly in development without a release date', () => {
    expect(currentRelease).toMatchObject({
      version: 'v0.1.0-beta.2',
      codename: 'Ivory Delta',
      status: 'In development',
    })
    expect(currentRelease.releasedOn).toBeUndefined()
  })

  it('keeps the dates of already published releases', () => {
    expect(
      releases.map(({ version, status, releasedOn }) => ({
        version,
        status,
        releasedOn,
      }))
    ).toEqual([
      {
        version: 'v0.1.0-beta.2',
        status: 'In development',
        releasedOn: undefined,
      },
      {
        version: 'v0.1.0-beta.1',
        status: 'Released',
        releasedOn: '5 October 2026',
      },
      {
        version: 'v0.1.0-alpha.1',
        status: 'Released',
        releasedOn: '3 October 2026',
      },
    ])
  })
})
