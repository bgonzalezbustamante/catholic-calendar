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
          'Added the selected Marian observances, including Lourdes, Fatima, Mount Carmel, the Presentation of Mary, Loreto and Guadalupe; added Saints Bernadette Soubirous, Benedict of Nursia and Francis of Assisi; and filled major feast gaps with the Transfiguration and Holy Family.',
          'Modelled St Michael’s Lent as a devotional period from the Assumption through the feast of the Archangels, subordinate to liturgical precedence.',
        ],
      },
      {
        title: 'Precedence and transfers',
        items: [
          'Tracks observed, commemorated, transferred and impeded states separately, keeping eligible memorials visible on privileged weekdays without overriding the seasonal liturgy; impeded diagnostics are surfaced in Year Overview.',
          'Covers the selected transfer cases for Saint Joseph, the Annunciation and the Immaculate Conception.',
          'Resolves same-date selected solemnities, including the Sacred Heart and Nativity of Saint John the Baptist collision.',
        ],
      },
      {
        title: 'Validation surfaces',
        items: [
          'Added an interactive date tester with guarded manual date entry, integrated selected-date/configuration controls, two/three-item composed-display controls, natural engine-order truncation, themeable Christicons including explicit Bernadette, Benedict and Archangels mappings, and simplified diagnostic cards.',
          'Added a bilingual year overview with year pagination, a coral Current year shortcut, English/Spanish celebration names, colour-coded liturgical-rank labels, a Nominal / reason column and a concise rank guide.',
          'Added regression coverage for computus, Advent, overlaps, countdowns, transfers and impediments.',
        ],
      },
    ],
  },
]

export const currentRelease = releases[0]
