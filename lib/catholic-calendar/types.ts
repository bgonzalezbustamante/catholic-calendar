export type ObservanceCategory =
  | 'lord'
  | 'marian'
  | 'saint'
  | 'faithful-departed'
  | 'seasonal'

export type LiturgicalRank =
  | 'principal-day'
  | 'solemnity'
  | 'feast'
  | 'memorial'
  | 'optional-memorial'
  | 'commemoration'

export type ObservanceStatus =
  | 'observed'
  | 'commemoration-eligible'
  | 'transferred'
  | 'impeded'

export type PeriodKind = 'liturgical' | 'devotional'

export interface CalendarObservance {
  id: string
  name: string
  nameEs: string
  category: ObservanceCategory
  rank: LiturgicalRank
  precedence: number
  nominalDate: string
  observedDate: string | null
  status: ObservanceStatus
  transferred: boolean
  transferReason: string | null
  commemorationEligibilityReason: string | null
  impededBy: string | null
  effectiveFrom?: number
}

export interface CalendarPeriod {
  id: string
  name: string
  kind: PeriodKind
  startDate: string
  endDate: string
}


export interface NextObservance {
  observance: CalendarObservance
  date: string
  daysUntil: number
}

export type CalendarDisplayItemKind =
  | 'observance'
  | 'nominal-observance'
  | 'period'
  | 'countdown'

export type CalendarDisplayIcon =
  | 'angel'
  | 'bread'
  | 'calvary'
  | 'candle'
  | 'chalice'
  | 'church-1'
  | 'cross'
  | 'dove'
  | 'easter-egg'
  | 'fire'
  | 'rosary'
  | 'sacred-heart'
  | 'st-peter'
  | 'star'
  | 'tombstone'
  | 'trinity'

export interface CalendarDisplayItem {
  kind: CalendarDisplayItemKind
  id: string
  label: string
  icon: CalendarDisplayIcon
}


export interface CalendarDisplaySummary {
  items: CalendarDisplayItem[]
  text: string
}

export interface CatholicCalendarState {
  date: string
  primaryObservance: CalendarObservance | null
  observedObservances: CalendarObservance[]
  nominalObservances: CalendarObservance[]
  liturgicalPeriods: CalendarPeriod[]
  devotionalPeriods: CalendarPeriod[]
  nextObservance: NextObservance | null
  countdown: NextObservance | null
  calculations: {
    easterSunday: string
    firstSundayOfAdvent: string
  }
}

export interface YearOverviewEntry {
  date: string
  observance: CalendarObservance
}
