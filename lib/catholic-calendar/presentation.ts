import type {
  CalendarDisplayIcon,
  CalendarDisplayItem,
  CalendarDisplayOptions,
  CalendarDisplaySummary,
  CatholicCalendarState,
} from './types'

export const DEFAULT_CALENDAR_DISPLAY_MAX_ITEMS = 2 as const

const PERIOD_ICONS: Partial<Record<string, CalendarDisplayIcon>> = {
  advent: 'candle',
  lent: 'calvary',
  'easter-time': 'easter-egg',
  'st-michaels-lent': 'angel',
}

const OBSERVANCE_ICONS: Partial<Record<string, CalendarDisplayIcon>> = {
  christmas: 'star',
  'sacred-heart': 'sacred-heart',
  pentecost: 'fire',
  'corpus-christi': 'chalice',
  'trinity-sunday': 'trinity',
  'our-lady-of-the-rosary': 'rosary',
}

function iconForPeriod(periodId: string): CalendarDisplayIcon | null {
  return PERIOD_ICONS[periodId] ?? null
}

function iconForObservance(observanceId: string): CalendarDisplayIcon | null {
  return OBSERVANCE_ICONS[observanceId] ?? null
}

function countdownItem(state: CatholicCalendarState): CalendarDisplayItem | null {
  if (!state.countdown) return null

  const unit = state.countdown.daysUntil === 1 ? 'day' : 'days'

  return {
    kind: 'countdown',
    id: `countdown:${state.countdown.observance.id}`,
    label: `${state.countdown.daysUntil} ${unit} until ${state.countdown.observance.name}`,
    icon: iconForObservance(state.countdown.observance.id),
  }
}

export function getCalendarDisplaySummary(
  state: CatholicCalendarState,
  options: CalendarDisplayOptions = {}
): CalendarDisplaySummary {
  const maxItems = options.maxItems ?? DEFAULT_CALENDAR_DISPLAY_MAX_ITEMS
  const items: CalendarDisplayItem[] = []

  if (state.primaryObservance) {
    items.push({
      kind: 'observance',
      id: state.primaryObservance.id,
      label: state.primaryObservance.name,
      icon: iconForObservance(state.primaryObservance.id),
    })
  }

  for (const period of [...state.liturgicalPeriods, ...state.devotionalPeriods]) {
    if (items.length >= maxItems) break

    items.push({
      kind: 'period',
      id: period.id,
      label: period.name,
      icon: iconForPeriod(period.id),
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
