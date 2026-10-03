import { addDays, dateFromParts, dayOfWeek, isBetweenInclusive } from './date-utils'
import { MAX_SUPPORTED_YEAR, MIN_SUPPORTED_YEAR, seasonDates } from './calendar'
import type { CalendarObservance, ObservanceCategory } from './types'

function transfer(
  event: CalendarObservance,
  observedDate: string,
  transferReason: string
): CalendarObservance {
  return {
    ...event,
    observedDate,
    status: 'transferred',
    transferred: observedDate !== event.nominalDate,
    transferReason,
    commemorationReason: null,
    impededBy: null,
  }
}

function commemorate(
  event: CalendarObservance,
  commemorationReason: string
): CalendarObservance {
  return {
    ...event,
    observedDate: event.nominalDate,
    status: 'commemorated',
    transferred: false,
    transferReason: null,
    commemorationReason,
    impededBy: null,
  }
}

function impede(event: CalendarObservance, impededBy: string): CalendarObservance {
  return {
    ...event,
    observedDate: null,
    status: 'impeded',
    transferred: false,
    transferReason: null,
    commemorationReason: null,
    impededBy,
  }
}

function isSundayInRange(value: string, start: string, end: string) {
  return dayOfWeek(value) === 0 && isBetweenInclusive(value, start, end)
}

function baselinePrecedence(value: string, year: number): { precedence: number; label: string } {
  const dates = seasonDates(year)
  const christmas = dateFromParts(year, 12, 25)
  const epiphany = dateFromParts(year, 1, 6)

  if (isBetweenInclusive(value, dates.holyThursday, dates.easter)) {
    return { precedence: 1, label: 'Sacred Paschal Triduum' }
  }

  if (
    value === christmas ||
    value === epiphany ||
    value === dates.ascension ||
    value === dates.pentecost ||
    value === dates.ashWednesday
  ) {
    return { precedence: 2, label: 'principal liturgical day' }
  }

  if (
    isSundayInRange(value, dates.advent, dateFromParts(year, 12, 24)) ||
    isSundayInRange(value, dates.ashWednesday, dates.palmSunday) ||
    isSundayInRange(value, dates.easter, dates.pentecost)
  ) {
    return { precedence: 2, label: 'Sunday of a privileged liturgical season' }
  }

  if (isBetweenInclusive(value, addDays(dates.palmSunday, 1), dates.holyThursday)) {
    return { precedence: 2, label: 'weekday of Holy Week' }
  }

  if (isBetweenInclusive(value, addDays(dates.easter, 1), dates.divineMercySunday)) {
    return { precedence: 2, label: 'day within the Octave of Easter' }
  }

  if (dayOfWeek(value) === 0) {
    return { precedence: 6, label: 'Sunday' }
  }

  if (
    isBetweenInclusive(value, dateFromParts(year, 12, 17), dateFromParts(year, 12, 24)) ||
    isBetweenInclusive(value, addDays(christmas, 1), dateFromParts(year, 12, 31)) ||
    isBetweenInclusive(value, addDays(dates.ashWednesday, 1), addDays(dates.palmSunday, -1))
  ) {
    return { precedence: 9, label: 'privileged weekday' }
  }

  return { precedence: 13, label: 'weekday' }
}

function applySpecialTransfers(events: CalendarObservance[], year: number) {
  const dates = seasonDates(year)

  return events.map((event) => {
    if (event.id === 'st-joseph') {
      if (isBetweenInclusive(event.nominalDate, dates.palmSunday, dates.holySaturday)) {
        return transfer(
          event,
          addDays(dates.palmSunday, -1),
          'Saint Joseph is anticipated to the nearest available day before Palm Sunday when 19 March falls on Palm Sunday or in Holy Week.'
        )
      }

      if (
        dayOfWeek(event.nominalDate) === 0 &&
        isBetweenInclusive(event.nominalDate, dates.ashWednesday, addDays(dates.palmSunday, -1))
      ) {
        return transfer(
          event,
          addDays(event.nominalDate, 1),
          'Saint Joseph is transferred to Monday when 19 March falls on a Sunday of Lent.'
        )
      }
    }

    if (event.id === 'annunciation') {
      if (
        isBetweenInclusive(event.nominalDate, dates.palmSunday, dates.divineMercySunday)
      ) {
        return transfer(
          event,
          addDays(dates.divineMercySunday, 1),
          'The Annunciation is transferred to the Monday after the Second Sunday of Easter when 25 March is impeded by Holy Week or the Easter Octave.'
        )
      }

      if (
        dayOfWeek(event.nominalDate) === 0 &&
        isBetweenInclusive(event.nominalDate, dates.ashWednesday, addDays(dates.palmSunday, -1))
      ) {
        return transfer(
          event,
          addDays(event.nominalDate, 1),
          'The Annunciation is transferred to Monday when 25 March falls on a Sunday of Lent.'
        )
      }
    }

    if (
      event.id === 'immaculate-conception' &&
      dayOfWeek(event.nominalDate) === 0 &&
      isBetweenInclusive(event.nominalDate, dates.advent, dateFromParts(year, 12, 24))
    ) {
      return transfer(
        event,
        addDays(event.nominalDate, 1),
        'The Immaculate Conception is transferred to Monday when 8 December falls on a Sunday of Advent.'
      )
    }

    return event
  })
}

function categoryTieBreak(category: ObservanceCategory): number {
  switch (category) {
    case 'lord':
      return 0
    case 'marian':
      return 1
    case 'saint':
      return 2
    case 'faithful-departed':
      return 3
    case 'seasonal':
      return 0
  }
}

function findTransferDate(
  event: CalendarObservance,
  events: CalendarObservance[],
  year: number
): string {
  for (let distance = 1; distance <= 14; distance += 1) {
    for (const direction of [-1, 1]) {
      const candidate = addDays(event.observedDate ?? event.nominalDate, distance * direction)
      const candidateYear = Number(candidate.slice(0, 4))
      if (candidateYear < MIN_SUPPORTED_YEAR || candidateYear > MAX_SUPPORTED_YEAR) {
        continue
      }

      const baseline = baselinePrecedence(candidate, candidateYear)
      if (baseline.precedence <= 8) {
        continue
      }

      const blocked = events.some(
        (other) =>
          other.id !== event.id &&
          other.observedDate === candidate &&
          other.precedence <= 8
      )

      if (!blocked) {
        return candidate
      }
    }
  }

  throw new Error(`Unable to find a transfer date for ${event.name} in ${year}.`)
}

function resolveSolemnityCollisions(events: CalendarObservance[], year: number) {
  const resolved = events.map((event) => ({ ...event }))

  for (let pass = 0; pass < 8; pass += 1) {
    const byDate = new Map<string, CalendarObservance[]>()
    for (const event of resolved) {
      if (!event.observedDate || event.precedence !== 3) continue
      const bucket = byDate.get(event.observedDate) ?? []
      bucket.push(event)
      byDate.set(event.observedDate, bucket)
    }

    const collision = [...byDate.entries()].find(([, bucket]) => bucket.length > 1)
    if (!collision) return resolved

    const [, bucket] = collision
    bucket.sort((a, b) => categoryTieBreak(a.category) - categoryTieBreak(b.category))
    const loser = bucket[1]
    const index = resolved.findIndex((event) => event.id === loser.id)
    const newDate = findTransferDate(loser, resolved, year)
    resolved[index] = transfer(
      loser,
      newDate,
      `Transferred because ${bucket[0].name} has precedence when the selected solemnities coincide.`
    )
  }

  throw new Error(`Unable to resolve solemnity collisions for ${year}.`)
}

function resolveImpediments(events: CalendarObservance[]) {
  const resolved = events.map((event) => ({ ...event }))

  for (let index = 0; index < resolved.length; index += 1) {
    const event = resolved[index]
    if (!event.observedDate) continue

    const eventYear = Number(event.observedDate.slice(0, 4))
    const baseline = baselinePrecedence(event.observedDate, eventYear)

    if (event.precedence > baseline.precedence) {
      const canBeCommemorated =
        baseline.precedence === 9 &&
        (event.rank === 'memorial' || event.rank === 'optional-memorial')

      resolved[index] = canBeCommemorated
        ? commemorate(
            event,
            `The ${baseline.label} retains liturgical precedence; the memorial may be commemorated according to GIRM 355.`
          )
        : impede(event, baseline.label)
      continue
    }

    const competitors = resolved
      .filter(
        (other) =>
          other.id !== event.id &&
          other.observedDate === event.observedDate &&
          other.precedence <= event.precedence
      )
      .sort((a, b) => {
        if (a.precedence !== b.precedence) return a.precedence - b.precedence
        return categoryTieBreak(a.category) - categoryTieBreak(b.category)
      })

    if (competitors.length > 0) {
      resolved[index] = impede(event, competitors[0].name)
    }
  }

  return resolved
}

export function applyCalendarRules(
  events: CalendarObservance[],
  year: number
): CalendarObservance[] {
  let resolved = applySpecialTransfers(events, year)
  resolved = resolveSolemnityCollisions(resolved, year)
  return resolveImpediments(resolved)
}
