import { addDays, dateFromParts, dayOfWeek, nextSundayAfter } from './date-utils'

function assertGregorianYear(year: number, calculation: string) {
  if (!Number.isInteger(year) || year < 1583 || year > 4099) {
    throw new RangeError(`${calculation} calculation supports years 1583–4099.`)
  }
}

export function gregorianEasterSunday(year: number): string {
  assertGregorianYear(year, 'Gregorian Easter')

  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return dateFromParts(year, month, day)
}

export function firstSundayOfAdvent(year: number): string {
  assertGregorianYear(year, 'First Sunday of Advent')
  let cursor = dateFromParts(year, 11, 27)
  while (dayOfWeek(cursor) !== 0) {
    cursor = addDays(cursor, 1)
  }
  return cursor
}

export function baptismOfTheLord(year: number): string {
  assertGregorianYear(year, 'Baptism of the Lord')
  return nextSundayAfter(dateFromParts(year, 1, 6))
}

export function holyFamily(year: number): string {
  assertGregorianYear(year, 'Holy Family')
  let cursor = dateFromParts(year, 12, 26)
  const end = dateFromParts(year, 12, 31)

  while (cursor <= end) {
    if (dayOfWeek(cursor) === 0) return cursor
    cursor = addDays(cursor, 1)
  }

  return dateFromParts(year, 12, 30)
}
