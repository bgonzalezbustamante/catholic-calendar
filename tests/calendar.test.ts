import { describe, expect, it } from 'vitest'

import {
  assertCalendarDate,
  todayInTimeZone,
} from '@/lib/catholic-calendar/date-utils'
import {
  baptismOfTheLord,
  buildPeriods,
  buildYearObservances,
  firstSundayOfAdvent,
  formatCalendarStateSummary,
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  getObservanceDisplayIcon,
  getPeriodDisplayIcon,
  getYearOverview,
  gregorianEasterSunday,
  holyFamily,
  isSupportedCalendarDate,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@/lib/catholic-calendar'

const SUPPORTED_YEARS = Array.from(
  { length: MAX_SUPPORTED_YEAR - MIN_SUPPORTED_YEAR + 1 },
  (_, index) => MIN_SUPPORTED_YEAR + index
)

// Oudin's algorithm, independent of the anonymous Gregorian algorithm in the engine.
function oudinEaster(year: number): string {
  const g = year % 19
  const c = Math.floor(year / 100)
  const h =
    (c - Math.floor(c / 4) - Math.floor((8 * c + 13) / 25) + 19 * g + 15) % 30
  const i =
    h -
    Math.floor(h / 28) *
      (1 - Math.floor(h / 28) * Math.floor(29 / (h + 1)) * Math.floor((21 - g) / 11))
  const j = (year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4)) % 7
  const l = i - j
  const month = 3 + Math.floor((l + 40) / 44)
  const day = l + 28 - 31 * Math.floor(month / 4)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function findObservance(year: number, id: string) {
  return buildYearObservances(year).find((event) => event.id === id)
}

function activePeriodIds(date: string) {
  const state = getCatholicCalendarState(date)
  return [...state.liturgicalPeriods, ...state.devotionalPeriods].map(
    (period) => period.id
  )
}

describe('computus', () => {
  it('calculates known Gregorian Easter dates', () => {
    expect(gregorianEasterSunday(2024)).toBe('2024-03-31')
    expect(gregorianEasterSunday(2025)).toBe('2025-04-20')
    expect(gregorianEasterSunday(2026)).toBe('2026-04-05')
    expect(gregorianEasterSunday(2027)).toBe('2027-03-28')
  })

  it('matches an independent Easter algorithm across the supported range', () => {
    for (const year of SUPPORTED_YEARS) {
      expect(gregorianEasterSunday(year)).toBe(oudinEaster(year))
    }
  })

  it('places the Baptism of the Lord on the Sunday after 6 January', () => {
    expect(baptismOfTheLord(2030)).toBe('2030-01-13')
    expect(baptismOfTheLord(2024)).toBe('2024-01-07')
  })

  it('rejects years outside the Gregorian range in every date helper', () => {
    for (const helper of [
      gregorianEasterSunday,
      firstSundayOfAdvent,
      baptismOfTheLord,
      holyFamily,
    ]) {
      expect(() => helper(1582)).toThrow(RangeError)
      expect(() => helper(99)).toThrow('1583–4099')
      expect(() => helper(4100)).toThrow(RangeError)
    }
  })

  it('calculates the Holy Family within the Christmas Octave', () => {
    expect(holyFamily(2026)).toBe('2026-12-27')
    expect(holyFamily(2027)).toBe('2027-12-26')
    expect(holyFamily(2022)).toBe('2022-12-30')
  })

  it('derives Advent from the Sunday in the 27 November–3 December window', () => {
    expect(firstSundayOfAdvent(2026)).toBe('2026-11-29')
    expect(firstSundayOfAdvent(2027)).toBe('2027-11-28')
    expect(firstSundayOfAdvent(2028)).toBe('2028-12-03')
  })
})

describe('fixed observances', () => {
  it('marks Lourdes as commemoration-eligible on a Lenten weekday without changing display output', () => {
    const state = getCatholicCalendarState('2027-02-11')

    expect(state.primaryObservance).toMatchObject({
      id: 'our-lady-of-lourdes',
      status: 'commemoration-eligible',
      observedDate: '2027-02-11',
    })
    expect(state.liturgicalPeriods.map((period) => period.id)).toContain('lent')
    expect(formatCalendarStateSummary(state)).toBe(
      'Our Lady of Lourdes · Lent'
    )
    expect(getCalendarDisplaySummary(state).items.map((item) => item.label)).toEqual([
      'Our Lady of Lourdes',
      'Lent',
    ])
    expect(state.primaryObservance?.commemorationEligibilityReason).toContain(
      'may be commemorated'
    )
    expect(
      getYearOverview(2027).find(
        ({ observance }) => observance.id === 'our-lady-of-lourdes'
      )?.observance.status
    ).toBe('commemoration-eligible')
  })


  it('shows Our Lady of Lourdes on 11 February', () => {
    const state = getCatholicCalendarState('2026-02-11')

    expect(state.primaryObservance).toMatchObject({
      id: 'our-lady-of-lourdes',
      name: 'Our Lady of Lourdes',
      rank: 'optional-memorial',
      status: 'observed',
    })
    expect(
      getYearOverview(2026).find(
        ({ observance }) => observance.id === 'our-lady-of-lourdes'
      )
    ).toMatchObject({
      date: '2026-02-11',
      observance: {
        status: 'observed',
      },
    })
  })

  it('includes Saint Bernadette and Saint Benedict', () => {
    expect(getCatholicCalendarState('2026-04-16').primaryObservance).toMatchObject({
      id: 'st-bernadette-soubirous',
      name: 'Saint Bernadette Soubirous',
      nameEs: 'Santa Bernardita Soubirous',
      rank: 'optional-memorial',
      status: 'observed',
    })

    expect(getCatholicCalendarState('2026-07-11').primaryObservance).toMatchObject({
      id: 'st-benedict-nursia',
      name: 'Saint Benedict of Nursia',
      nameEs: 'San Benito de Nursia',
      rank: 'memorial',
      status: 'observed',
    })

    expect(
      getCatholicCalendarState('2027-07-11').nominalObservances.find(
        (observance) => observance.id === 'st-benedict-nursia'
      )
    ).toMatchObject({
      status: 'impeded',
      impededBy: 'Sunday',
    })
  })

  it('includes the Transfiguration and Holy Family', () => {
    expect(getCatholicCalendarState('2026-08-06').primaryObservance).toMatchObject({
      id: 'transfiguration',
      name: 'Transfiguration of the Lord',
      nameEs: 'Transfiguración del Señor',
      rank: 'feast',
    })

    expect(getCatholicCalendarState('2026-12-27').primaryObservance).toMatchObject({
      id: 'holy-family',
      name: 'Holy Family of Jesus, Mary and Joseph',
      nameEs: 'Sagrada Familia de Jesús, María y José',
      rank: 'feast',
    })

    expect(getCatholicCalendarState('2022-12-30').primaryObservance).toMatchObject({
      id: 'holy-family',
      rank: 'feast',
    })
  })

  it('includes the Presentation of Mary and Our Lady of Loreto', () => {
    expect(getCatholicCalendarState('2026-11-21').primaryObservance).toMatchObject({
      id: 'presentation-of-mary',
      name: 'Presentation of the Blessed Virgin Mary',
      nameEs: 'Presentación de la Santísima Virgen María',
      rank: 'memorial',
    })

    expect(getCatholicCalendarState('2026-12-10').primaryObservance).toMatchObject({
      id: 'our-lady-of-loreto',
      name: 'Our Lady of Loreto',
      nameEs: 'Nuestra Señora de Loreto',
      rank: 'optional-memorial',
    })

    expect(
      getYearOverview(2018).some(
        ({ observance }) => observance.id === 'our-lady-of-loreto'
      )
    ).toBe(false)
    expect(
      getYearOverview(2019).some(
        ({ observance }) => observance.id === 'our-lady-of-loreto'
      )
    ).toBe(true)

    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-11-21')).items[0]
    ).toMatchObject({ id: 'presentation-of-mary', icon: 'rosary' })
    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-12-10')).items[0]
    ).toMatchObject({ id: 'our-lady-of-loreto', icon: 'rosary' })
  })

  it('includes Saint Francis of Assisi on 4 October with the universal memorial rank', () => {
    expect(getCatholicCalendarState('2027-10-04').primaryObservance).toMatchObject({
      id: 'st-francis-assisi',
      name: 'Saint Francis of Assisi',
      nameEs: 'San Francisco de Asís',
      rank: 'memorial',
      status: 'observed',
    })
    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2027-10-04')).items[0]
    ).toMatchObject({
      id: 'st-francis-assisi',
      icon: 'cross',
    })

    const impededFrancis = getCatholicCalendarState('2026-10-04')

    expect(
      impededFrancis.nominalObservances.find(
        (observance) => observance.id === 'st-francis-assisi'
      )
    ).toMatchObject({
      status: 'impeded',
      observedDate: null,
      impededBy: 'Sunday',
    })
    expect(formatCalendarStateSummary(impededFrancis)).toBe(
      'Saint Francis of Assisi · 3 days until Our Lady of the Rosary'
    )
    expect(getCalendarDisplaySummary(impededFrancis).items).toEqual([
      expect.objectContaining({
        kind: 'nominal-observance',
        id: 'st-francis-assisi',
        label: 'Saint Francis of Assisi',
      }),
      expect.objectContaining({
        kind: 'countdown',
        id: 'countdown:our-lady-of-the-rosary',
        label: '3 days until Our Lady of the Rosary',
      }),
    ])
  })
})

describe('periods and countdown', () => {
  it('carries Christmas Time into the minimum supported year', () => {
    const state = getCatholicCalendarState('2000-01-01')

    expect(state.liturgicalPeriods).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'christmas-time',
          startDate: '1999-12-25',
          endDate: '2000-01-09',
        }),
      ])
    )
    expect(formatCalendarStateSummary(state)).toBe(
      'Mary, the Holy Mother of God · Christmas Time'
    )
  })

  it('keeps the curated period set without Ordinary Time', () => {
    const periods = buildPeriods(2026)

    expect(periods.map((period) => period.id)).toEqual([
      'christmas-time',
      'lent',
      'holy-week',
      'paschal-triduum',
      'easter-time',
      'st-michaels-lent',
      'advent',
    ])
    expect(periods.some((period) => period.id === 'ordinary-time')).toBe(false)
  })


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

  it('moves the Annunciation to Monday when 25 March is a Lenten Sunday', () => {
    for (const year of [2001, 2012]) {
      expect(findObservance(year, 'annunciation')).toMatchObject({
        status: 'transferred',
        observedDate: `${year}-03-26`,
      })
    }
  })

  it('moves the Annunciation after the Easter Octave when 25 March is Easter Sunday', () => {
    expect(findObservance(2035, 'annunciation')).toMatchObject({
      nominalDate: '2035-03-25',
      observedDate: '2035-04-02',
      status: 'transferred',
    })
  })

  it('anticipates Saint Joseph when 19 March is Palm Sunday', () => {
    expect(findObservance(2062, 'st-joseph')).toMatchObject({
      observedDate: '2062-03-18',
      status: 'transferred',
    })
  })

  it('moves Saints Peter and Paul when the Sacred Heart falls on 29 June', () => {
    expect(findObservance(2057, 'sacred-heart')?.observedDate).toBe('2057-06-29')
    expect(findObservance(2057, 'peter-and-paul')).toMatchObject({
      observedDate: '2057-06-28',
      status: 'transferred',
    })
  })

  it('moves Saint John the Baptist when Corpus Christi falls on 24 June', () => {
    expect(findObservance(2038, 'corpus-christi')?.observedDate).toBe('2038-06-24')
    expect(findObservance(2038, 'nativity-john-baptist')).toMatchObject({
      observedDate: '2038-06-23',
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
  it('impedes memorials on Ash Wednesday and names the winning day', () => {
    expect(findObservance(2032, 'our-lady-of-lourdes')).toMatchObject({
      status: 'impeded',
      observedDate: null,
      impededBy: 'Ash Wednesday',
    })
  })

  it('names the selected celebration that outranks an impeded one', () => {
    expect(findObservance(2010, 'our-lady-of-fatima')?.impededBy).toBe(
      'Ascension of the Lord'
    )
    expect(findObservance(2026, 'visitation')?.impededBy).toBe('Most Holy Trinity')
    expect(findObservance(2055, 'presentation-of-mary')?.impededBy).toBe(
      'Our Lord Jesus Christ, King of the Universe'
    )
  })

  it('impedes the Immaculate Heart when a higher-ranking celebration coincides', () => {
    expect(findObservance(2008, 'immaculate-heart')).toMatchObject({
      status: 'impeded',
      impededBy: 'Visitation of the Blessed Virgin Mary',
    })
    expect(findObservance(2028, 'immaculate-heart')?.impededBy).toBe(
      'Nativity of Saint John the Baptist'
    )
    expect(findObservance(2030, 'immaculate-heart')?.impededBy).toBe(
      'Saints Peter and Paul, Apostles'
    )
  })

  it('introduces Mary, Mother of the Church in 2018 and lets the Visitation outrank it', () => {
    expect(findObservance(2017, 'mary-mother-of-church')).toBeUndefined()
    expect(findObservance(2018, 'mary-mother-of-church')).toMatchObject({
      status: 'observed',
      observedDate: '2018-05-21',
    })
    expect(findObservance(2066, 'mary-mother-of-church')).toMatchObject({
      status: 'impeded',
      impededBy: 'Visitation of the Blessed Virgin Mary',
    })
  })

  it('applies the start years of later additions to the calendar', () => {
    expect(findObservance(2001, 'our-lady-of-fatima')).toBeUndefined()
    expect(findObservance(2002, 'our-lady-of-fatima')).toBeDefined()
    expect(findObservance(2001, 'our-lady-of-guadalupe')).toBeUndefined()
    expect(findObservance(2002, 'our-lady-of-guadalupe')).toBeDefined()
    expect(findObservance(2000, 'divine-mercy-sunday')).toBeDefined()
  })


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
  it('keeps impeded Benedict in Year Overview and uses available composed-display space', () => {
    const state = getCatholicCalendarState('2027-07-11')
    const benedict = getYearOverview(2027).find(
      ({ observance }) => observance.id === 'st-benedict-nursia'
    )

    expect(state.primaryObservance).toBeNull()
    expect(
      getCalendarDisplaySummary(state).items.find(
        (item) => item.id === 'st-benedict-nursia'
      )
    ).toMatchObject({
      kind: 'nominal-observance',
      label: 'Saint Benedict of Nursia',
    })
    expect(benedict?.observance).toMatchObject({
      status: 'impeded',
      impededBy: 'Sunday',
    })
    expect(getObservanceDisplayIcon(benedict!.observance)).toBe('cross')
  })

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

  it('keeps active periods ahead of impeded nominal celebrations', () => {
    const state = getCatholicCalendarState('2027-12-12')

    expect(formatCalendarStateSummary(state)).toBe(
      'Advent · Our Lady of Guadalupe'
    )
    expect(getCalendarDisplaySummary(state).items).toEqual([
      expect.objectContaining({
        kind: 'period',
        id: 'advent',
      }),
      expect.objectContaining({
        kind: 'nominal-observance',
        id: 'our-lady-of-guadalupe',
      }),
    ])
  })

  it('uses a free second slot for an impeded celebration alongside a primary observance', () => {
    const state = getCatholicCalendarState('2026-05-31')

    expect(state.primaryObservance?.id).toBe('trinity-sunday')
    expect(
      state.nominalObservances.find(
        (observance) => observance.id === 'visitation'
      )
    ).toMatchObject({
      status: 'impeded',
      observedDate: null,
    })
    expect(formatCalendarStateSummary(state)).toBe(
      'Most Holy Trinity · Visitation of the Blessed Virgin Mary'
    )
    expect(getCalendarDisplaySummary(state).items[1]).toMatchObject({
      kind: 'nominal-observance',
      id: 'visitation',
    })
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

  it('uses the engine period order without display-specific prioritisation', () => {
    const holyThursday = getCatholicCalendarState('2026-04-02')
    expect(formatCalendarStateSummary(holyThursday)).toBe(
      'Holy Thursday · Lent'
    )

    const easter = getCatholicCalendarState('2026-04-05')
    expect(formatCalendarStateSummary(easter)).toBe(
      'Easter Sunday of the Resurrection of the Lord · Sacred Paschal Triduum'
    )
    const michaelState = getCatholicCalendarState('2026-08-15')
    expect(formatCalendarStateSummary(michaelState)).toBe(
      "Assumption of the Blessed Virgin Mary · St Michael's Lent"
    )
  })

  it('uses calvary for Holy Week', () => {
    expect(getPeriodDisplayIcon('holy-week')).toBe('calvary')
  })

  it('uses candle for the First Sunday of Advent and star for Christmas Time', () => {
    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-11-29')).items[0]
    ).toMatchObject({
      id: 'first-sunday-advent',
      icon: 'candle',
    })

    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-12-26')).items.find(
        (item) => item.id === 'christmas-time'
      )
    ).toMatchObject({
      icon: 'star',
    })
  })

  it('maps the complete Christicon set onto calendar display semantics', () => {
    const expectations = [
      ['2026-12-03', 'advent', 'candle'],
      ['2026-03-01', 'lent', 'calvary'],
      ['2026-04-20', 'easter-time', 'easter-egg'],
      ['2026-09-08', 'st-michaels-lent', 'angel'],
      ['2026-01-11', 'baptism-of-the-lord', 'dove'],
      ['2026-02-18', 'ash-wednesday', 'calvary'],
      ['2026-04-02', 'holy-thursday', 'bread'],
      ['2026-04-03', 'good-friday', 'calvary'],
      ['2026-09-29', 'archangels', 'angel'],
      ['2026-06-24', 'nativity-john-baptist', 'dove'],
      ['2026-06-29', 'peter-and-paul', 'st-peter'],
      ['2026-12-25', 'christmas', 'star'],
      ['2026-06-12', 'sacred-heart', 'sacred-heart'],
      ['2026-05-24', 'pentecost', 'fire'],
      ['2026-06-04', 'corpus-christi', 'chalice'],
      ['2026-05-31', 'trinity-sunday', 'trinity'],
      ['2026-10-07', 'our-lady-of-the-rosary', 'rosary'],
      ['2026-11-02', 'all-souls', 'tombstone'],
    ] as const

    for (const [date, id, icon] of expectations) {
      const items = getCalendarDisplaySummary(
        getCatholicCalendarState(date)
      ).items
      expect(items.find((item) => item.id === id)).toMatchObject({ icon })
    }
  })

  it('uses the requested icons for Bernadette and Benedict', () => {
    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-04-16')).items[0]
    ).toMatchObject({
      id: 'st-bernadette-soubirous',
      icon: 'rosary',
    })

    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-07-11')).items[0]
    ).toMatchObject({
      id: 'st-benedict-nursia',
      icon: 'cross',
    })
  })

  it('uses the rosary icon for the Annunciation as a specific override', () => {
    expect(
      getCalendarDisplaySummary(getCatholicCalendarState('2026-03-25')).items[0]
    ).toMatchObject({
      id: 'annunciation',
      icon: 'rosary',
    })

    const countdown = getCalendarDisplaySummary(
      getCatholicCalendarState('2026-03-24')
    ).items.find((item) => item.kind === 'countdown')

    expect(countdown).toMatchObject({
      id: 'countdown:annunciation',
      icon: 'rosary',
    })
  })

  it('uses the rosary icon for Marian observances and countdowns', () => {
    const marianDates = [
      ['2026-01-01', 'mary-mother-of-god'],
      ['2026-02-11', 'our-lady-of-lourdes'],
      ['2026-08-15', 'assumption'],
      ['2026-09-08', 'nativity-of-mary'],
      ['2026-12-08', 'immaculate-conception'],
    ] as const

    for (const [date, id] of marianDates) {
      expect(
        getCalendarDisplaySummary(getCatholicCalendarState(date)).items[0]
      ).toMatchObject({ id, icon: 'rosary' })
    }

    const countdown = getCalendarDisplaySummary(
      getCatholicCalendarState('2026-12-07')
    ).items.find((item) => item.kind === 'countdown')

    expect(countdown).toMatchObject({
      id: 'countdown:immaculate-conception',
      icon: 'rosary',
    })
  })

  it('guarantees an icon for every composed display item', () => {
    const unmappedObservance = getCalendarDisplaySummary(
      getCatholicCalendarState('2026-09-08')
    )
    expect(unmappedObservance.items[0]).toMatchObject({
      id: 'nativity-of-mary',
      icon: 'rosary',
    })

    const christmasTime = getCalendarDisplaySummary(
      getCatholicCalendarState('2026-01-03')
    )
    expect(christmasTime.items).toMatchObject([
      { id: 'christmas-time', icon: 'star' },
      { id: 'countdown:epiphany', icon: 'cross' },
    ])

    const overviewDates = [
      '2026-01-03',
      '2026-03-01',
      '2026-04-05',
      '2026-09-08',
      '2026-12-03',
    ]

    for (const date of overviewDates) {
      expect(
        getCalendarDisplaySummary(
          getCatholicCalendarState(date)
        ).items.every((item) => Boolean(item.icon))
      ).toBe(true)
    }
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

describe('period boundaries', () => {
  it('ends Christmas Time on the Baptism of the Lord', () => {
    expect(activePeriodIds('2030-01-13')).toContain('christmas-time')
    expect(activePeriodIds('2030-01-14')).not.toContain('christmas-time')
  })

  it('moves from Advent to Christmas Time between 24 and 25 December', () => {
    expect(activePeriodIds('2026-12-24')).toEqual(['advent'])
    expect(activePeriodIds('2026-12-25')).toEqual(['christmas-time'])
  })

  it('ends Easter Time on Pentecost', () => {
    expect(activePeriodIds('2026-05-24')).toContain('easter-time')
    expect(activePeriodIds('2026-05-25')).not.toContain('easter-time')
  })
})

describe('supported range', () => {
  it('builds every supported year without duplicate ids or competing observed celebrations', () => {
    for (const year of SUPPORTED_YEARS) {
      const events = buildYearObservances(year)
      const ids = events.map((event) => event.id)
      expect(new Set(ids).size).toBe(ids.length)

      const observedDates = events
        .map((event) => event.observedDate)
        .filter((date): date is string => date !== null)
      expect(new Set(observedDates).size).toBe(observedDates.length)

      // Only selected solemnities have transfer rules, so none may be left impeded.
      expect(
        events.filter(
          (event) => event.rank === 'solemnity' && event.status === 'impeded'
        )
      ).toEqual([])
    }
  })

  it('counts down into the following year from the end of the supported range', () => {
    const state = getCatholicCalendarState('2100-12-31')

    expect(state.countdown).toMatchObject({
      date: '2101-01-01',
      daysUntil: 1,
      observance: expect.objectContaining({ id: 'mary-mother-of-god' }),
    })
    expect(state.observedObservances).toEqual([])
    expect(formatCalendarStateSummary(state)).toBe(
      'Christmas Time · 1 day until Mary, the Holy Mother of God'
    )
  })

  it('accepts only real ISO dates within the supported range', () => {
    expect(isSupportedCalendarDate('2000-01-01')).toBe(true)
    expect(isSupportedCalendarDate('2100-12-31')).toBe(true)

    for (const value of [
      '0002-11-02',
      '1999-12-31',
      '2101-01-01',
      '2026-02-30',
      '2026-1-1',
      '',
    ]) {
      expect(isSupportedCalendarDate(value)).toBe(false)
    }

    expect(() => assertCalendarDate('2026-02-30')).toThrow(RangeError)
    expect(() => assertCalendarDate('2026-1-1')).toThrow('YYYY-MM-DD')
    expect(assertCalendarDate('0050-01-01')).toBe('0050-01-01')
    expect(() => getCatholicCalendarState('1999-12-31')).toThrow('2000–2100')
  })

  it('reads the civil date in the requested time zone', () => {
    const now = new Date('2026-11-01T23:30:00Z')

    expect(todayInTimeZone('Europe/Amsterdam', now)).toBe('2026-11-02')
    expect(todayInTimeZone('America/Santiago', now)).toBe('2026-11-01')
  })
})
