import {
  assertCalendarDate,
  compareDates,
  daysBetween,
  isBetweenInclusive,
  yearOf,
} from './date-utils'
import { firstSundayOfAdvent, gregorianEasterSunday } from './computus'
import { buildPeriods, MAX_SUPPORTED_YEAR, MIN_SUPPORTED_YEAR } from './calendar'
import { buildYearObservances } from './observances'
import type {
  CalendarObservance,
  CatholicCalendarState,
  YearOverviewEntry,
} from './types'

function yearsAround(year: number) {
  return [year - 1, year, year + 1].filter(
    (value) => value >= MIN_SUPPORTED_YEAR && value <= MAX_SUPPORTED_YEAR
  )
}

function sortObserved(events: CalendarObservance[]) {
  return [...events].sort((a, b) => {
    if (a.precedence !== b.precedence) return a.precedence - b.precedence
    return a.name.localeCompare(b.name)
  })
}

export function getCatholicCalendarState(value: string): CatholicCalendarState {
  const date = assertCalendarDate(value)
  const year = yearOf(date)
  if (year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) {
    throw new RangeError(
      `Catholic Calendar supports years ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}.`
    )
  }

  const years = yearsAround(year)
  const observances = years.flatMap(buildYearObservances)
  const periods = years.flatMap(buildPeriods)

  const observedObservances = sortObserved(
    observances.filter((event) => event.observedDate === date)
  )
  const nominalObservances = observances
    .filter((event) => event.nominalDate === date)
    .sort((a, b) => a.precedence - b.precedence)

  const activePeriods = periods.filter((period) =>
    isBetweenInclusive(date, period.startDate, period.endDate)
  )

  const nextEvent = observances
    .filter(
      (event) =>
        event.observedDate !== null && compareDates(event.observedDate, date) > 0
    )
    .sort((a, b) => compareDates(a.observedDate!, b.observedDate!))[0]

  const nextObservance = nextEvent?.observedDate
    ? {
        observance: nextEvent,
        date: nextEvent.observedDate,
        daysUntil: daysBetween(date, nextEvent.observedDate),
      }
    : null

  const primaryObservance = observedObservances[0] ?? null

  return {
    date,
    primaryObservance,
    observedObservances,
    nominalObservances,
    liturgicalPeriods: activePeriods.filter((period) => period.kind === 'liturgical'),
    devotionalPeriods: activePeriods.filter((period) => period.kind === 'devotional'),
    nextObservance,
    countdown: primaryObservance ? null : nextObservance,
    calculations: {
      easterSunday: gregorianEasterSunday(year),
      firstSundayOfAdvent: firstSundayOfAdvent(year),
    },
  }
}

export function getYearOverview(year: number): YearOverviewEntry[] {
  return buildYearObservances(year)
    .map((observance) => ({
      date: observance.observedDate ?? observance.nominalDate,
      observance,
    }))
    .sort((a, b) => {
      if (a.date !== b.date) return compareDates(a.date, b.date)
      return a.observance.precedence - b.observance.precedence
    })
}
