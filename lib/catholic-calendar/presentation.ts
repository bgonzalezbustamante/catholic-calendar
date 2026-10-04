import type {
  CalendarDisplayIcon,
  CalendarDisplayItem,
  CalendarDisplayOptions,
  CalendarDisplaySummary,
  CalendarCustomaryObservance,
  CalendarObservance,
  CatholicCalendarState,
} from './types'

export const DEFAULT_CALENDAR_DISPLAY_MAX_ITEMS = 2 as const

const PERIOD_ICONS: Partial<Record<string, CalendarDisplayIcon>> = {
  'christmas-time': 'star',
  advent: 'candle',
  lent: 'calvary',
  'holy-week': 'calvary',
  'easter-time': 'easter-egg',
  'st-michaels-lent': 'angel',
}

const OBSERVANCE_ICONS: Partial<Record<string, CalendarDisplayIcon>> = {
  annunciation: 'rosary',
  'baptism-of-the-lord': 'dove',
  'ash-wednesday': 'calvary',
  'holy-thursday': 'bread',
  'good-friday': 'calvary',
  'st-bernadette-soubirous': 'rosary',
  'st-benedict-nursia': 'cross',
  'st-francis-assisi': 'cross',
  archangels: 'angel',
  'nativity-john-baptist': 'dove',
  'peter-and-paul': 'st-peter',
  'first-sunday-advent': 'candle',
  christmas: 'star',
  'sacred-heart': 'sacred-heart',
  pentecost: 'fire',
  'corpus-christi': 'chalice',
  'trinity-sunday': 'trinity',
  'our-lady-of-the-rosary': 'rosary',
  'all-souls': 'tombstone',
}

export function getPeriodDisplayIcon(periodId: string): CalendarDisplayIcon {
  return PERIOD_ICONS[periodId] ?? 'church-1'
}

export function getObservanceDisplayIcon(
  observance: Pick<CalendarObservance, 'id' | 'category'>
): CalendarDisplayIcon {
  return (
    OBSERVANCE_ICONS[observance.id] ??
    (observance.category === 'marian' ? 'rosary' : 'cross')
  )
}

export function getCustomaryObservanceDisplayIcon(
  observance: Pick<CalendarCustomaryObservance, 'id'>
): CalendarDisplayIcon {
  if (observance.id === 'shrove-tuesday') return 'church-1'
  return 'church-1'
}

function countdownItem(state: CatholicCalendarState): CalendarDisplayItem | null {
  if (!state.countdown) return null

  const unit = state.countdown.daysUntil === 1 ? 'day' : 'days'

  return {
    kind: 'countdown',
    id: `countdown:${state.countdown.observance.id}`,
    label: `${state.countdown.daysUntil} ${unit} until ${state.countdown.observance.name}`,
    icon: getObservanceDisplayIcon(state.countdown.observance),
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
      icon: getObservanceDisplayIcon(state.primaryObservance),
    })
  }

  for (const customary of state.customaryObservances) {
    if (items.length >= maxItems) break

    items.push({
      kind: 'customary',
      id: customary.id,
      label: customary.name,
      icon: getCustomaryObservanceDisplayIcon(customary),
    })
  }

  for (const period of [...state.liturgicalPeriods, ...state.devotionalPeriods]) {
    if (items.length >= maxItems) break

    items.push({
      kind: 'period',
      id: period.id,
      label: period.name,
      icon: getPeriodDisplayIcon(period.id),
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
        : 'No selected observance, customary observance or active period',
  }
}

export function formatCalendarStateSummary(
  state: CatholicCalendarState,
  options: CalendarDisplayOptions = {}
): string {
  return getCalendarDisplaySummary(state, options).text
}
