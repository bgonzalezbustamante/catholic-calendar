import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const calendar = require('../packages/catholic-calendar')

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

const packageManifest = require('../packages/catholic-calendar/package.json')
const rootManifest = require('../package.json')
assert.equal(packageManifest.name, '@bgonzalezbustamante/catholic-calendar')
assert.equal(packageManifest.version, rootManifest.version)
assert.equal(packageManifest.dependencies, undefined)

console.log('Package smoke check passed.')
