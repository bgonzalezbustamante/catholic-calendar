import { describe, expect, it } from 'vitest'

import {
  firstSundayOfAdvent,
  formatCalendarStateSummary,
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  getYearOverview,
  gregorianEasterSunday,
} from '@/lib/catholic-calendar'

describe('computus', () => {
  it('calculates known Gregorian Easter dates', () => {
    expect(gregorianEasterSunday(2024)).toBe('2024-03-31')
    expect(gregorianEasterSunday(2025)).toBe('2025-04-20')
    expect(gregorianEasterSunday(2026)).toBe('2026-04-05')
    expect(gregorianEasterSunday(2027)).toBe('2027-03-28')
  })

  it('derives Advent from the Sunday in the 27 November–3 December window', () => {
    expect(firstSundayOfAdvent(2026)).toBe('2026-11-29')
    expect(firstSundayOfAdvent(2027)).toBe('2027-11-28')
    expect(firstSundayOfAdvent(2028)).toBe('2028-12-03')
  })
})

describe('periods and countdown', () => {
  it('retains a Marian feast alongside St Michael’s Lent', () => {
    const state = getCatholicCalendarState('2026-09-08')

    expect(state.primaryObservance?.id).toBe('nativity-of-mary')
    expect(state.devotionalPeriods.map((period) => period.id)).toContain(
      'st-michaels-lent'
    )
    expect(state.countdown).toBeNull()
  })

  it('counts calendar days to the next selected observance when today has none', () => {
    const state = getCatholicCalendarState('2026-10-03')

    expect(state.primaryObservance).toBeNull()
    expect(state.countdown?.observance.id).toBe('our-lady-of-the-rosary')
    expect(state.countdown?.daysUntil).toBe(4)
  })

  it('allows overlapping liturgical periods at date-level boundaries', () => {
    const holyThursday = getCatholicCalendarState('2026-04-02')
    const easter = getCatholicCalendarState('2026-04-05')

    expect(holyThursday.liturgicalPeriods.map((period) => period.id)).toEqual(
      expect.arrayContaining(['lent', 'holy-week', 'paschal-triduum'])
    )
    expect(easter.liturgicalPeriods.map((period) => period.id)).toEqual(
      expect.arrayContaining(['paschal-triduum', 'easter-time'])
    )
  })
})

describe('transfers', () => {
  it('transfers the Annunciation out of Holy Week and the Easter Octave', () => {
    const nominal = getCatholicCalendarState('2024-03-25')
    const observed = getCatholicCalendarState('2024-04-08')

    expect(nominal.nominalObservances.find((event) => event.id === 'annunciation')).toMatchObject({
      status: 'transferred',
      observedDate: '2024-04-08',
    })
    expect(observed.primaryObservance?.id).toBe('annunciation')
  })

  it('transfers the Immaculate Conception when 8 December is an Advent Sunday', () => {
    const state = getCatholicCalendarState('2024-12-09')

    expect(state.primaryObservance).toMatchObject({
      id: 'immaculate-conception',
      nominalDate: '2024-12-08',
      status: 'transferred',
    })
  })

  it('moves Saint Joseph to Monday when 19 March is a Lenten Sunday', () => {
    expect(getCatholicCalendarState('2017-03-20').primaryObservance).toMatchObject({
      id: 'st-joseph',
      nominalDate: '2017-03-19',
      status: 'transferred',
    })
  })

  it('anticipates Saint Joseph when 19 March falls in Holy Week', () => {
    expect(getCatholicCalendarState('2008-03-15').primaryObservance).toMatchObject({
      id: 'st-joseph',
      nominalDate: '2008-03-19',
      status: 'transferred',
    })
  })

  it('resolves the 2022 Sacred Heart and Saint John the Baptist collision', () => {
    expect(getCatholicCalendarState('2022-06-23').primaryObservance).toMatchObject({
      id: 'nativity-john-baptist',
      nominalDate: '2022-06-24',
      status: 'transferred',
    })
    expect(getCatholicCalendarState('2022-06-24').primaryObservance?.id).toBe(
      'sacred-heart'
    )
  })
})

describe('impeded selected observances', () => {
  it('retains an optional Marian memorial as nominal when an Advent Sunday outranks it', () => {
    const state = getCatholicCalendarState('2027-12-12')
    const guadalupe = state.nominalObservances.find(
      (event) => event.id === 'our-lady-of-guadalupe'
    )

    expect(state.primaryObservance).toBeNull()
    expect(guadalupe).toMatchObject({
      status: 'impeded',
      observedDate: null,
    })
    expect(guadalupe?.impededBy).toContain('Sunday')
  })
})

describe('year overview', () => {
  it('sorts transferred celebrations by observed date', () => {
    const june2022 = getYearOverview(2022).filter((entry) =>
      entry.date.startsWith('2022-06')
    )
    const john = june2022.find(
      (entry) => entry.observance.id === 'nativity-john-baptist'
    )

    expect(john?.date).toBe('2022-06-23')
  })
})


describe('display summary', () => {
  it('combines a primary observance with active periods', () => {
    const state = getCatholicCalendarState('2026-09-08')
    expect(formatCalendarStateSummary(state)).toBe(
      "Nativity of the Blessed Virgin Mary · St Michael's Lent"
    )
  })

  it('combines active periods and countdown when no discrete observance is active', () => {
    const state = getCatholicCalendarState('2026-12-03')
    expect(formatCalendarStateSummary(state)).toBe(
      'Advent · 5 days until Immaculate Conception'
    )
  })


  it('caps the composed display at two items', () => {
    const state = getCatholicCalendarState('2026-04-02')
    const display = getCalendarDisplaySummary(state)

    expect(display.items).toHaveLength(2)
    expect(display.items.map((item) => item.label)).toEqual([
      'Holy Thursday',
      'Lent',
    ])
  })

  it('supports a three-item composed display without changing diagnostic state', () => {
    const state = getCatholicCalendarState('2026-04-02')
    const display = getCalendarDisplaySummary(state, {
      maxItems: 3,
    })

    expect(display.items.map((item) => item.label)).toEqual([
      'Holy Thursday',
      'Lent',
      'Holy Week',
    ])
    expect(state.liturgicalPeriods.map((period) => period.name)).toEqual([
      'Lent',
      'Holy Week',
      'Sacred Paschal Triduum',
    ])
  })

  it('uses the engine period order without display-specific prioritisation', () => {
    const holyThursday = getCatholicCalendarState('2026-04-02')
    expect(formatCalendarStateSummary(holyThursday)).toBe(
      'Holy Thursday · Lent'
    )

    const easter = getCatholicCalendarState('2026-04-05')
    expect(formatCalendarStateSummary(easter)).toBe(
      'Easter Sunday of the Resurrection of the Lord · Sacred Paschal Triduum'
    )
    expect(
      formatCalendarStateSummary(easter, { maxItems: 3 })
    ).toBe(
      'Easter Sunday of the Resurrection of the Lord · Sacred Paschal Triduum · Easter Time'
    )

    const michaelState = getCatholicCalendarState('2026-08-15')
    expect(formatCalendarStateSummary(michaelState)).toBe(
      "Assumption of the Blessed Virgin Mary · St Michael's Lent"
    )
  })

  it('exposes only the compact display length as a package option', () => {
    const state = getCatholicCalendarState('2026-04-02')
    expect(
      getCalendarDisplaySummary(state, {
        maxItems: 3,
      }).items.map((item) => item.label)
    ).toEqual(['Holy Thursday', 'Lent', 'Holy Week'])
  })

  it('maps Christicons onto calendar display semantics', () => {
    expect(getCalendarDisplaySummary(getCatholicCalendarState('2026-12-03')).items).toMatchObject([
      { id: 'advent', icon: 'candle' },
      { id: 'countdown:immaculate-conception', icon: null },
    ])

    expect(getCalendarDisplaySummary(getCatholicCalendarState('2026-12-25')).items[0]).toMatchObject({
      id: 'christmas',
      icon: 'star',
    })

    expect(getCalendarDisplaySummary(getCatholicCalendarState('2026-05-24')).items[0]).toMatchObject({
      id: 'pentecost',
      icon: 'fire',
    })

    expect(getCalendarDisplaySummary(getCatholicCalendarState('2026-06-04')).items[0]).toMatchObject({
      id: 'corpus-christi',
      icon: 'chalice',
    })

    expect(getCalendarDisplaySummary(getCatholicCalendarState('2026-06-12')).items[0]).toMatchObject({
      id: 'sacred-heart',
      icon: 'sacred-heart',
    })

    expect(getCalendarDisplaySummary(getCatholicCalendarState('2026-10-07')).items[0]).toMatchObject({
      id: 'our-lady-of-the-rosary',
      icon: 'rosary',
    })
  })

  it('provides Spanish names for every year-overview observance', () => {
    const overview = getYearOverview(2026)
    expect(overview.length).toBeGreaterThan(0)
    expect(overview.every(({ observance }) => observance.nameEs.length > 0)).toBe(true)
    expect(
      overview.find(({ observance }) => observance.id === 'all-souls')?.observance.nameEs
    ).toBe('Conmemoración de todos los fieles difuntos')
  })

  it('uses the final display names for selected celebrations', () => {
    expect(getCatholicCalendarState('2026-04-12').primaryObservance?.name).toBe(
      'Divine Mercy Sunday'
    )
    expect(getCatholicCalendarState('2026-06-04').primaryObservance?.name).toBe(
      'Corpus Christi'
    )
    expect(getCatholicCalendarState('2026-11-02').primaryObservance?.name).toBe(
      'All Souls'
    )
    expect(getCatholicCalendarState('2026-12-08').primaryObservance?.name).toBe(
      'Immaculate Conception'
    )
    expect(getCatholicCalendarState('2026-12-25').primaryObservance?.name).toBe(
      'Christmas'
    )
  })
})
