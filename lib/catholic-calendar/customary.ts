import { seasonDates, assertSupportedYear } from './calendar'
import { addDays } from './date-utils'
import type { CalendarCustomaryObservance } from './types'

export function buildYearCustomaryObservances(
  year: number
): CalendarCustomaryObservance[] {
  assertSupportedYear(year)
  const dates = seasonDates(year)

  return [
    {
      id: 'shrove-tuesday',
      name: 'Shrove Tuesday',
      nameEs: 'Martes de Carnaval',
      aliases: ['Mardi Gras', 'Fat Tuesday'],
      kind: 'customary',
      date: addDays(dates.ashWednesday, -1),
    },
  ]
}
