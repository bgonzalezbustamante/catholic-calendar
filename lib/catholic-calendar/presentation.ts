import type {
  CalendarDisplayItem,
  CalendarDisplayOptions,
  CalendarDisplaySummary,
  CalendarPeriod,
  CatholicCalendarState,
} from './types'

export const DEFAULT_CALENDAR_DISPLAY_MAX_ITEMS = 2 as const

function countdownItem(state: CatholicCalendarState): CalendarDisplayItem | null {
  if (!state.countdown) return null

  const unit = state.countdown.daysUntil === 1 ? 'day' : 'days'

  return {
    kind: 'countdown',
    id: `countdown:${state.countdown.observance.id}`,
    label: `${state.countdown.daysUntil} ${unit} until ${state.countdown.observance.name}`,
  }
}

function orderedPeriods(
  state: CatholicCalendarState,
  preferredPeriodIds: readonly string[]
): CalendarPeriod[] {
  const periods = [...state.liturgicalPeriods, ...state.devotionalPeriods]
  const preferred = new Map(
    preferredPeriodIds.map((periodId, index) => [periodId, index])
  )

  return periods
    .map((period, sourceIndex) => ({
      period,
      sourceIndex,
      preferenceIndex: preferred.get(period.id),
    }))
    .sort((a, b) => {
      const aPreferred = a.preferenceIndex !== undefined
      const bPreferred = b.preferenceIndex !== undefined

      if (aPreferred && bPreferred) {
        return a.preferenceIndex! - b.preferenceIndex!
      }

      if (aPreferred) return -1
      if (bPreferred) return 1
      return a.sourceIndex - b.sourceIndex
    })
    .map(({ period }) => period)
}

export function getCalendarDisplaySummary(
  state: CatholicCalendarState,
  options: CalendarDisplayOptions = {}
): CalendarDisplaySummary {
  const maxItems = options.maxItems ?? DEFAULT_CALENDAR_DISPLAY_MAX_ITEMS
  const preferredPeriodIds = options.preferredPeriodIds ?? []
  const items: CalendarDisplayItem[] = []

  if (state.primaryObservance) {
    items.push({
      kind: 'observance',
      id: state.primaryObservance.id,
      label: state.primaryObservance.name,
    })
  }

  for (const period of orderedPeriods(state, preferredPeriodIds)) {
    if (items.length >= maxItems) break

    items.push({
      kind: 'period',
      id: period.id,
      label: period.name,
    })
  }

  if (!state.primaryObservance && items.length < maxItems) {
    const countdown = countdownItem(state)
    if (countdown) items.push(countdown)
  }

  return {
    items,
    text:
      items.length > 0
        ? items.map((item) => item.label).join(' · ')
        : 'No selected observance or active period',
  }
}

export function formatCalendarStateSummary(
  state: CatholicCalendarState,
  options: CalendarDisplayOptions = {}
): string {
  return getCalendarDisplaySummary(state, options).text
}
