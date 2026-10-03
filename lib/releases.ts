export type ReleaseNoteSection = {
  title: string
  items: string[]
}

export type ReleaseNote = {
  version: string
  codename: string
  status: string
  summary: string
  sections: ReleaseNoteSection[]
}

export const releases: ReleaseNote[] = [
  {
    version: 'v0.1.0-alpha.1',
    codename: 'Calm Bridge',
    status: 'In Development',
    summary:
      'Calm Bridge establishes the first reusable Catholic Calendar proof of concept: deterministic Roman-calendar calculations, a separate Franciscan devotional layer, explicit transfer and impediment states, and interactive validation surfaces.',
    sections: [
      {
        title: 'Calendar engine',
        items: [
          'Added Gregorian Easter computus and derived the Holy Week and Easter cycle from Easter Sunday.',
          'Derived the First Sunday of Advent, Christ the King and the Advent period rather than maintaining year tables.',
          'Kept the engine independent of React, Next.js and external data services for later package extraction.',
        ],
      },
      {
        title: 'Observance model',
        items: [
          'Introduced simultaneous primary-observance, active-period and countdown layers.',
          'Added the selected Marian observances, including Lourdes, Fatima, Mount Carmel and Guadalupe.',
          'Modelled St Michael’s Lent as a devotional period from the Assumption through the feast of the Archangels, subordinate to liturgical precedence.',
        ],
      },
      {
        title: 'Precedence and transfers',
        items: [
          'Tracks nominal and observed dates separately and retains impeded nominal observances for inspection.',
          'Covers the selected transfer cases for Saint Joseph, the Annunciation and the Immaculate Conception.',
          'Resolves same-date selected solemnities, including the Sacred Heart and Nativity of Saint John the Baptist collision.',
        ],
      },
      {
        title: 'Validation surfaces',
        items: [
          'Added an interactive date tester with two/three-item composed-display controls, natural engine-order truncation, rule details and complete diagnostic cards.',
          'Added a bilingual year overview showing English and Spanish celebration names alongside observed, transferred and impeded entries.',
          'Added regression coverage for computus, Advent, overlaps, countdowns, transfers and impediments.',
        ],
      },
    ],
  },
]

export const currentRelease = releases[0]
