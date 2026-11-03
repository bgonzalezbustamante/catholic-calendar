import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { latestPublishedRelease, releases } from '../lib/releases'

const rootDir = path.resolve(__dirname, '..')
const changelog = readFileSync(path.join(rootDir, 'CHANGELOG.md'), 'utf-8')
const rootManifest = JSON.parse(
  readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
) as { version: string }

describe('release notes', () => {
  it('lists the version in package.json first', () => {
    expect(releases[0].version).toBe(`v${rootManifest.version}`)
  })

  it('dates every published release from its CHANGELOG heading', () => {
    for (const release of releases.filter((item) => item.status === 'Released')) {
      expect(release.releasedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(changelog).toContain(
        `## [${release.version.slice(1)}] — ${release.codename} — ${release.releasedOn}`
      )
    }
  })

  it('keeps unreleased versions undated', () => {
    for (const release of releases.filter((item) => item.status !== 'Released')) {
      expect(release.releasedOn).toBeUndefined()
    }
  })

  it('exposes the newest published release', () => {
    expect(latestPublishedRelease).toBe(
      releases.find((release) => release.status === 'Released')
    )
    expect(latestPublishedRelease?.releasedOn).toBeDefined()
  })
})
