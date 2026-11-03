import assert from 'node:assert/strict'
import { execSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const calendar = require('../packages/catholic-calendar')

assert.equal(calendar.CALENDAR_DISPLAY_MAX_ITEMS, 2)
assert.equal(calendar.isSupportedCalendarDate('2100-12-31'), true)
assert.equal(calendar.isSupportedCalendarDate('0002-11-02'), false)

const state = calendar.getCatholicCalendarState('2026-09-08')
assert.equal(state.primaryObservance?.id, 'nativity-of-mary')
assert.equal(
  calendar.getCalendarDisplaySummary(state).text,
  "Nativity of the Blessed Virgin Mary · St Michael's Lent"
)

const saintFrancisSunday = calendar.getCatholicCalendarState('2026-10-04')
assert.equal(saintFrancisSunday.primaryObservance, null)
assert.equal(
  calendar.getCalendarDisplaySummary(saintFrancisSunday).text,
  'Saint Francis of Assisi · 3 days until Our Lady of the Rosary'
)

const trinitySunday = calendar.getCatholicCalendarState('2026-05-31')
assert.equal(trinitySunday.primaryObservance?.id, 'trinity-sunday')
assert.equal(
  calendar.getCalendarDisplaySummary(trinitySunday).text,
  'Most Holy Trinity · Visitation of the Blessed Virgin Mary'
)

const boundary = calendar.getCatholicCalendarState('2000-01-01')
assert.ok(
  boundary.liturgicalPeriods.some(
    (period) =>
      period.id === 'christmas-time' &&
      period.startDate === '1999-12-25' &&
      period.endDate === '2000-01-09'
  )
)

const finalCountdown = calendar.getCatholicCalendarState('2100-12-31').countdown
assert.equal(finalCountdown?.date, '2101-01-01')
assert.equal(finalCountdown?.observance.id, 'mary-mother-of-god')

// Resolve through the package's own exports map, as a consumer would.
const selfRequire = createRequire(
  new URL('../packages/catholic-calendar/package.json', import.meta.url)
)

// Node can import the CommonJS build with named exports from ESM projects.
const esm = await import(
  pathToFileURL(selfRequire.resolve('@bgonzalezbustamante/catholic-calendar')).href
)
assert.equal(typeof esm.getCatholicCalendarState, 'function')
assert.equal(esm.CALENDAR_DISPLAY_MAX_ITEMS, 2)

const packageManifest = require('../packages/catholic-calendar/package.json')
const rootManifest = require('../package.json')
assert.equal(packageManifest.name, '@bgonzalezbustamante/catholic-calendar')
assert.equal(packageManifest.version, rootManifest.version)
assert.equal(packageManifest.dependencies, undefined)
assert.equal(
  selfRequire('@bgonzalezbustamante/catholic-calendar/package.json').version,
  packageManifest.version
)

// The tarball holds only the compiled engine, its README, licence and manifest.
const [packed] = JSON.parse(
  execSync('npm pack --dry-run --json --ignore-scripts ./packages/catholic-calendar', {
    encoding: 'utf-8',
  })
)
const engineModules = readdirSync(new URL('../lib/catholic-calendar', import.meta.url))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.slice(0, -3))
assert.deepEqual(
  packed.files.map((file) => file.path).sort(),
  [
    'LICENSE',
    'README.md',
    'package.json',
    ...engineModules.flatMap((name) => [`dist/${name}.d.ts`, `dist/${name}.js`]),
  ].sort()
)

console.log('Package smoke check passed.')
