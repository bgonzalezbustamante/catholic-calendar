import type { CatholicCalendarState } from './types'

export function formatCalendarStateSummary(state: CatholicCalendarState): string {
  const parts: string[] = []

  if (state.primaryObservance) {
    parts.push(state.primaryObservance.name)
  }

  for (const period of [...state.liturgicalPeriods, ...state.devotionalPeriods]) {
    parts.push(period.name)
  }

  if (!state.primaryObservance && state.countdown) {
    const unit = state.countdown.daysUntil === 1 ? 'day' : 'days'
    parts.push(
      `${state.countdown.daysUntil} ${unit} until ${state.countdown.observance.name}`
    )
  }

  return parts.length > 0 ? parts.join(' · ') : 'No selected observance or active period'
}
