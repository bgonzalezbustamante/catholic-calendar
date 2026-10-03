import { compareDates, dateFromParts } from './date-utils'
import { baptismOfTheLord, holyFamily } from './computus'
import { assertSupportedYear, seasonDates } from './calendar'
import { applyCalendarRules } from './rules'
import type { CalendarObservance, LiturgicalRank, ObservanceCategory } from './types'

const SPANISH_OBSERVANCE_NAMES: Record<string, string> = {
  'mary-mother-of-god': 'Santa María, Madre de Dios',
  'epiphany': 'Epifanía del Señor',
  'baptism-of-the-lord': 'Bautismo del Señor',
  'presentation': 'Presentación del Señor',
  'our-lady-of-lourdes': 'Nuestra Señora de Lourdes',
  'ash-wednesday': 'Miércoles de Ceniza',
  'st-joseph': 'San José, esposo de la Bienaventurada Virgen María',
  'annunciation': 'Anunciación del Señor',
  'palm-sunday': 'Domingo de Ramos de la Pasión del Señor',
  'holy-thursday': 'Jueves Santo',
  'good-friday': 'Viernes Santo de la Pasión del Señor',
  'holy-saturday': 'Sábado Santo',
  'easter-sunday': 'Domingo de Pascua de la Resurrección del Señor',
  'divine-mercy-sunday': 'Domingo de la Divina Misericordia',
  'our-lady-of-fatima': 'Nuestra Señora de Fátima',
  'ascension': 'Ascensión del Señor',
  'pentecost': 'Domingo de Pentecostés',
  'mary-mother-of-church': 'Bienaventurada Virgen María, Madre de la Iglesia',
  'visitation': 'Visitación de la Bienaventurada Virgen María',
  'trinity-sunday': 'Santísima Trinidad',
  'corpus-christi': 'Santísimo Cuerpo y Sangre de Cristo',
  'sacred-heart': 'Sagrado Corazón de Jesús',
  'immaculate-heart': 'Inmaculado Corazón de la Bienaventurada Virgen María',
  'nativity-john-baptist': 'Natividad de San Juan Bautista',
  'peter-and-paul': 'Santos Pedro y Pablo, apóstoles',
  'our-lady-of-mount-carmel': 'Nuestra Señora del Carmen',
  'transfiguration': 'Transfiguración del Señor',
  'assumption': 'Asunción de la Bienaventurada Virgen María',
  'queenship-of-mary': 'Bienaventurada Virgen María Reina',
  'nativity-of-mary': 'Natividad de la Santísima Virgen María',
  'exaltation-holy-cross': 'Exaltación de la Santa Cruz',
  'our-lady-of-sorrows': 'Nuestra Señora de los Dolores',
  'archangels': 'Santos Miguel, Gabriel y Rafael, arcángeles',
  'st-francis-assisi': 'San Francisco de Asís',
  'our-lady-of-the-rosary': 'Nuestra Señora del Rosario',
  'presentation-of-mary': 'Presentación de la Santísima Virgen María',
  'all-saints': 'Todos los Santos',
  'all-souls': 'Conmemoración de todos los fieles difuntos',
  'christ-the-king': 'Nuestro Señor Jesucristo, Rey del Universo',
  'first-sunday-advent': 'Primer Domingo de Adviento',
  'immaculate-conception': 'Inmaculada Concepción',
  'our-lady-of-loreto': 'Nuestra Señora de Loreto',
  'our-lady-of-guadalupe': 'Nuestra Señora de Guadalupe',
  'christmas': 'Navidad',
  'holy-family': 'Sagrada Familia de Jesús, María y José',
}

function observance(input: {
  id: string
  name: string
  category: ObservanceCategory
  rank: LiturgicalRank
  precedence: number
  nominalDate: string
  effectiveFrom?: number
}): CalendarObservance {
  const nameEs = SPANISH_OBSERVANCE_NAMES[input.id]
  if (!nameEs) {
    throw new Error(`Missing Spanish observance name for ${input.id}.`)
  }

  return {
    ...input,
    nameEs,
    observedDate: input.nominalDate,
    status: 'observed',
    transferred: false,
    transferReason: null,
    commemorationReason: null,
    impededBy: null,
  }
}

function fixed(
  year: number,
  month: number,
  day: number,
  input: Omit<Parameters<typeof observance>[0], 'nominalDate'>
) {
  return observance({ ...input, nominalDate: dateFromParts(year, month, day) })
}

export function buildYearObservances(year: number): CalendarObservance[] {
  assertSupportedYear(year)
  const dates = seasonDates(year)

  let events: CalendarObservance[] = [
    fixed(year, 1, 1, {
      id: 'mary-mother-of-god',
      name: 'Mary, the Holy Mother of God',
      category: 'marian',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 1, 6, {
      id: 'epiphany',
      name: 'Epiphany of the Lord',
      category: 'lord',
      rank: 'principal-day',
      precedence: 2,
    }),
    observance({
      id: 'baptism-of-the-lord',
      name: 'Baptism of the Lord',
      category: 'lord',
      rank: 'feast',
      precedence: 5,
      nominalDate: baptismOfTheLord(year),
    }),
    fixed(year, 2, 2, {
      id: 'presentation',
      name: 'Presentation of the Lord',
      category: 'lord',
      rank: 'feast',
      precedence: 5,
    }),
    fixed(year, 2, 11, {
      id: 'our-lady-of-lourdes',
      name: 'Our Lady of Lourdes',
      category: 'marian',
      rank: 'optional-memorial',
      precedence: 12,
    }),
    observance({
      id: 'ash-wednesday',
      name: 'Ash Wednesday',
      category: 'seasonal',
      rank: 'principal-day',
      precedence: 2,
      nominalDate: dates.ashWednesday,
    }),
    fixed(year, 3, 19, {
      id: 'st-joseph',
      name: 'Saint Joseph, Spouse of the Blessed Virgin Mary',
      category: 'saint',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 3, 25, {
      id: 'annunciation',
      name: 'Annunciation of the Lord',
      category: 'lord',
      rank: 'solemnity',
      precedence: 3,
    }),
    observance({
      id: 'palm-sunday',
      name: 'Palm Sunday of the Passion of the Lord',
      category: 'lord',
      rank: 'principal-day',
      precedence: 2,
      nominalDate: dates.palmSunday,
    }),
    observance({
      id: 'holy-thursday',
      name: 'Holy Thursday',
      category: 'lord',
      rank: 'principal-day',
      precedence: 1,
      nominalDate: dates.holyThursday,
    }),
    observance({
      id: 'good-friday',
      name: 'Good Friday of the Passion of the Lord',
      category: 'lord',
      rank: 'principal-day',
      precedence: 1,
      nominalDate: dates.goodFriday,
    }),
    observance({
      id: 'holy-saturday',
      name: 'Holy Saturday',
      category: 'lord',
      rank: 'principal-day',
      precedence: 1,
      nominalDate: dates.holySaturday,
    }),
    observance({
      id: 'easter-sunday',
      name: 'Easter Sunday of the Resurrection of the Lord',
      category: 'lord',
      rank: 'principal-day',
      precedence: 1,
      nominalDate: dates.easter,
    }),
    observance({
      id: 'divine-mercy-sunday',
      name: 'Divine Mercy Sunday',
      category: 'lord',
      rank: 'principal-day',
      precedence: 2,
      nominalDate: dates.divineMercySunday,
      effectiveFrom: 2000,
    }),
    fixed(year, 5, 13, {
      id: 'our-lady-of-fatima',
      name: 'Our Lady of Fatima',
      category: 'marian',
      rank: 'optional-memorial',
      precedence: 12,
      effectiveFrom: 2002,
    }),
    observance({
      id: 'ascension',
      name: 'Ascension of the Lord',
      category: 'lord',
      rank: 'principal-day',
      precedence: 2,
      nominalDate: dates.ascension,
    }),
    observance({
      id: 'pentecost',
      name: 'Pentecost Sunday',
      category: 'lord',
      rank: 'principal-day',
      precedence: 2,
      nominalDate: dates.pentecost,
    }),
    observance({
      id: 'mary-mother-of-church',
      name: 'Blessed Virgin Mary, Mother of the Church',
      category: 'marian',
      rank: 'memorial',
      precedence: 10,
      nominalDate: dates.motherOfChurch,
      effectiveFrom: 2018,
    }),
    fixed(year, 5, 31, {
      id: 'visitation',
      name: 'Visitation of the Blessed Virgin Mary',
      category: 'marian',
      rank: 'feast',
      precedence: 7,
    }),
    observance({
      id: 'trinity-sunday',
      name: 'Most Holy Trinity',
      category: 'lord',
      rank: 'solemnity',
      precedence: 3,
      nominalDate: dates.trinitySunday,
    }),
    observance({
      id: 'corpus-christi',
      name: 'Corpus Christi',
      category: 'lord',
      rank: 'solemnity',
      precedence: 3,
      nominalDate: dates.corpusChristi,
    }),
    observance({
      id: 'sacred-heart',
      name: 'Most Sacred Heart of Jesus',
      category: 'lord',
      rank: 'solemnity',
      precedence: 3,
      nominalDate: dates.sacredHeart,
    }),
    observance({
      id: 'immaculate-heart',
      name: 'Immaculate Heart of the Blessed Virgin Mary',
      category: 'marian',
      rank: 'memorial',
      precedence: 10,
      nominalDate: dates.immaculateHeart,
    }),
    fixed(year, 6, 24, {
      id: 'nativity-john-baptist',
      name: 'Nativity of Saint John the Baptist',
      category: 'saint',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 6, 29, {
      id: 'peter-and-paul',
      name: 'Saints Peter and Paul, Apostles',
      category: 'saint',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 7, 16, {
      id: 'our-lady-of-mount-carmel',
      name: 'Our Lady of Mount Carmel',
      category: 'marian',
      rank: 'optional-memorial',
      precedence: 12,
    }),
    fixed(year, 8, 6, {
      id: 'transfiguration',
      name: 'Transfiguration of the Lord',
      category: 'lord',
      rank: 'feast',
      precedence: 5,
    }),
    fixed(year, 8, 15, {
      id: 'assumption',
      name: 'Assumption of the Blessed Virgin Mary',
      category: 'marian',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 8, 22, {
      id: 'queenship-of-mary',
      name: 'Queenship of the Blessed Virgin Mary',
      category: 'marian',
      rank: 'memorial',
      precedence: 10,
    }),
    fixed(year, 9, 8, {
      id: 'nativity-of-mary',
      name: 'Nativity of the Blessed Virgin Mary',
      category: 'marian',
      rank: 'feast',
      precedence: 7,
    }),
    fixed(year, 9, 14, {
      id: 'exaltation-holy-cross',
      name: 'Exaltation of the Holy Cross',
      category: 'lord',
      rank: 'feast',
      precedence: 5,
    }),
    fixed(year, 9, 15, {
      id: 'our-lady-of-sorrows',
      name: 'Our Lady of Sorrows',
      category: 'marian',
      rank: 'memorial',
     precedence: 10,
    }),
    fixed(year, 9, 29, {
      id: 'archangels',
      name: 'Saints Michael, Gabriel and Raphael, Archangels',
      category: 'saint',
      rank: 'feast',
      precedence: 7,
    }),
    fixed(year, 10, 4, {
      id: 'st-francis-assisi',
      name: 'Saint Francis of Assisi',
      category: 'saint',
      rank: 'memorial',
      precedence: 10,
    }),
    fixed(year, 10, 7, {
      id: 'our-lady-of-the-rosary',
      name: 'Our Lady of the Rosary',
      category: 'marian',
      rank: 'memorial',
      precedence: 10,
    }),
    fixed(year, 11, 1, {
      id: 'all-saints',
      name: 'All Saints',
      category: 'saint',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 11, 2, {
      id: 'all-souls',
      name: 'All Souls',
      category: 'faithful-departed',
      rank: 'commemoration',
      precedence: 3,
    }),
    fixed(year, 11, 21, {
      id: 'presentation-of-mary',
      name: 'Presentation of the Blessed Virgin Mary',
      category: 'marian',
      rank: 'memorial',
      precedence: 10,
    }),
    observance({
      id: 'christ-the-king',
      name: 'Our Lord Jesus Christ, King of the Universe',
      category: 'lord',
      rank: 'solemnity',
      precedence: 3,
      nominalDate: dates.christTheKing,
    }),
    observance({
      id: 'first-sunday-advent',
      name: 'First Sunday of Advent',
      category: 'seasonal',
      rank: 'principal-day',
      precedence: 2,
      nominalDate: dates.advent,
    }),
    fixed(year, 12, 8, {
      id: 'immaculate-conception',
      name: 'Immaculate Conception',
      category: 'marian',
      rank: 'solemnity',
      precedence: 3,
    }),
    fixed(year, 12, 10, {
      id: 'our-lady-of-loreto',
      name: 'Our Lady of Loreto',
      category: 'marian',
      rank: 'optional-memorial',
      precedence: 12,
      effectiveFrom: 2019,
    }),
    fixed(year, 12, 12, {
      id: 'our-lady-of-guadalupe',
      name: 'Our Lady of Guadalupe',
      category: 'marian',
      rank: 'optional-memorial',
      precedence: 12,
      effectiveFrom: 2002,
    }),
    fixed(year, 12, 25, {
      id: 'christmas',
      name: 'Christmas',
      category: 'lord',
      rank: 'principal-day',
      precedence: 2,
    }),
    observance({
      id: 'holy-family',
      name: 'Holy Family of Jesus, Mary and Joseph',
      category: 'lord',
      rank: 'feast',
      precedence: 5,
      nominalDate: holyFamily(year),
    }),
  ]

  events = events.filter((event) => !event.effectiveFrom || year >= event.effectiveFrom)
  events = applyCalendarRules(events, year)

  return events.sort((a, b) => {
    const aDate = a.observedDate ?? a.nominalDate
    const bDate = b.observedDate ?? b.nominalDate
    if (aDate !== bDate) return compareDates(aDate, bDate)
    return a.precedence - b.precedence
  })
}
