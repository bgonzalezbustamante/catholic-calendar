const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function dateFromParts(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day))
  const value = date.toISOString().slice(0, 10)
  const expected = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  if (value !== expected) {
    throw new RangeError(`Invalid calendar date: ${expected}`)
  }

  return value
}

export function assertCalendarDate(value: string): string {
  const match = ISO_DATE.exec(value)
  if (!match) {
    throw new RangeError(`Expected an ISO calendar date (YYYY-MM-DD), received: ${value}`)
  }

  return dateFromParts(Number(match[1]), Number(match[2]), Number(match[3]))
}

export function toUtcDate(value: string): Date {
  assertCalendarDate(value)
  return new Date(`${value}T00:00:00.000Z`)
}

export function addDays(value: string, days: number): string {
  const date = toUtcDate(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function dayOfWeek(value: string): number {
  return toUtcDate(value).getUTCDay()
}

export function yearOf(value: string): number {
  return Number(assertCalendarDate(value).slice(0, 4))
}

export function compareDates(a: string, b: string): number {
  return a.localeCompare(b)
}

export function daysBetween(from: string, to: string): number {
  const milliseconds = toUtcDate(to).getTime() - toUtcDate(from).getTime()
  return Math.round(milliseconds / 86_400_000)
}

export function isBetweenInclusive(value: string, start: string, end: string): boolean {
  return compareDates(value, start) >= 0 && compareDates(value, end) <= 0
}

export function nextSundayAfter(value: string): string {
  let cursor = addDays(value, 1)
  while (dayOfWeek(cursor) !== 0) {
    cursor = addDays(cursor, 1)
  }
  return cursor
}

export function todayInTimeZone(timeZone: string, now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value

  return assertCalendarDate(`${get('year')}-${get('month')}-${get('day')}`)
}
