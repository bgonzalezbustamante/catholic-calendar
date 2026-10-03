import { describe, expect, it } from 'vitest'

import {
  buildPeriods,
  firstSundayOfAdvent,
  formatCalendarStateSummary,
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  getObservanceDisplayIcon,
  getPeriodDisplayIcon,
  getYearOverview,
  gregorianEasterSunday,
  holyFamily,
} from '@/lib/catholic-calendar'

describe('computus', () => {
  it('calculates known Gregorian Easter dates', () => {
    expect(gregorianEasterSunday(2024)).toBe('2024-03-31')
    expect(gregorianEasterSunday(2025)).toBe('2025-04-20')
    expect(gregorianEasterSunday(2026)).toBe('2026-04-05')
    expect(gregorianEasterSunday(2027)).toBe('2027-03-28')
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

  it('includes Saint Francis of Assisi on 4 October', () => {
    expect(getCatholicCalendarState('2027-10-04').primaryObservance).toMatchObject({
      id: 'st-francis-assisi',
      name: 'Saint Francis of Assisi',
      nameEs: 'San Francisco de Asís',
      rank: 'memorial',
      status: 'observed',
    })

    expect(
      getCatholicCalendarState('2026-10-04').nominalObservances.find(
        (observance) => observance.id === 'st-francis-assisi'
      )
    ).toMatchObject({
      status: 'impeded',
      observedDate: null,
      impededBy: 'Sunday',
    })
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
  it('still impedes memorials on Sundays and Ash Wednesday', () => {
    expect(
      getCatholicCalendarState('2026-10-04').nominalObservances.find(
        (event) => event.id === 'st-francis-assisi'
      )
    ).toMatchObject({
      status: 'impeded',
      observedDate: null,
      impededBy: 'Sunday',
    })
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
  it('keeps impeded Benedict in Year Overview while omitting it from composed display', () => {
    const state = getCatholicCalendarState('2027-07-11')
    const benedict = getYearOverview(2027).find(
      ({ observance }) => observance.id === 'st-benedict-nursia'
    )

    expect(state.primaryObservance).toBeNull()
    expect(
      getCalendarDisplaySummary(state).items.some(
        (item) => item.id === 'st-benedict-nursia'
      )
    ).toBe(false)
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
        getCatholicCalendarState(date),
        { maxItems: 3 }
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
          getCatholicCalendarState(date),
          { maxItems: 3 }
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
