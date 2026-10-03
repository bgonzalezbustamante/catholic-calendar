import { addDays, dateFromParts } from './date-utils'
import { baptismOfTheLord, firstSundayOfAdvent, gregorianEasterSunday } from './computus'
import type { CalendarPeriod } from './types'

export const MIN_SUPPORTED_YEAR = 2000
export const MAX_SUPPORTED_YEAR = 2100

export function assertSupportedYear(year: number) {
  if (!Number.isInteger(year) || year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) {
    throw new RangeError(
      `Catholic Calendar supports years ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}.`
    )
  }
}

export function seasonDates(year: number) {
  const easter = gregorianEasterSunday(year)
  const ashWednesday = addDays(easter, -46)
  const palmSunday = addDays(easter, -7)
  const holyThursday = addDays(easter, -3)
  const goodFriday = addDays(easter, -2)
  const holySaturday = addDays(easter, -1)
  const divineMercySunday = addDays(easter, 7)
  const ascension = addDays(easter, 39)
  const pentecost = addDays(easter, 49)
  const motherOfChurch = addDays(easter, 50)
  const trinitySunday = addDays(easter, 56)
  const corpusChristi = addDays(easter, 60)
  const sacredHeart = addDays(easter, 68)
  const immaculateHeart = addDays(easter, 69)
  const advent = firstSundayOfAdvent(year)
  const christTheKing = addDays(advent, -7)

  return {
    easter,
    ashWednesday,
    palmSunday,
    holyThursday,
    goodFriday,
    holySaturday,
    divineMercySunday,
    ascension,
    pentecost,
    motherOfChurch,
    trinitySunday,
    corpusChristi,
    sacredHeart,
    immaculateHeart,
    advent,
    christTheKing,
  }
}

function buildPeriodsForYear(year: number): CalendarPeriod[] {
  const dates = seasonDates(year)

  return [
    {
      id: 'christmas-time',
      name: 'Christmas Time',
      kind: 'liturgical',
      startDate: dateFromParts(year, 12, 25),
      endDate: baptismOfTheLord(year + 1),
    },
    {
      id: 'lent',
      name: 'Lent',
      kind: 'liturgical',
      startDate: dates.ashWednesday,
      endDate: dates.holyThursday,
    },
    {
      id: 'holy-week',
      name: 'Holy Week',
      kind: 'liturgical',
      startDate: dates.palmSunday,
      endDate: dates.holySaturday,
    },
    {
      id: 'paschal-triduum',
      name: 'Sacred Paschal Triduum',
      kind: 'liturgical',
      startDate: dates.holyThursday,
      endDate: dates.easter,
    },
    {
      id: 'easter-time',
      name: 'Easter Time',
      kind: 'liturgical',
      startDate: dates.easter,
      endDate: dates.pentecost,
    },
    {
      id: 'st-michaels-lent',
      name: "St Michael's Lent",
      kind: 'devotional',
      startDate: dateFromParts(year, 8, 15),
      endDate: dateFromParts(year, 9, 29),
    },
    {
      id: 'advent',
      name: 'Advent',
      kind: 'liturgical',
      startDate: dates.advent,
      endDate: dateFromParts(year, 12, 24),
    },
  ]
}

export function buildPeriods(year: number): CalendarPeriod[] {
  assertSupportedYear(year)
  return buildPeriodsForYear(year)
}

// Resolver-only context permits the immediately preceding year so a period
// that begins before the supported range can still extend into it.
export function buildPeriodContext(year: number): CalendarPeriod[] {
  if (
    !Number.isInteger(year) ||
    year < MIN_SUPPORTED_YEAR - 1 ||
    year > MAX_SUPPORTED_YEAR
  ) {
    throw new RangeError(
      `Catholic Calendar period context supports years ${MIN_SUPPORTED_YEAR - 1}–${MAX_SUPPORTED_YEAR}.`
    )
  }

  return buildPeriodsForYear(year)
}
