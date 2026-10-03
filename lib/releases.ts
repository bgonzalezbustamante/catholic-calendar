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
    status: 'Released',
    summary:
      'Calm Bridge is the first reusable Catholic Calendar alpha: a deterministic calendar engine with a compact composed display, interactive validation tools and a curated Roman-calendar scope.',
    sections: [
      {
        title: 'Core release',
        items: [
          'Computes the selected movable calendar, precedence and transfer rules for supported dates from 2000 through 2100.',
          'Separates liturgical periods from the St Michael’s Lent devotional layer and keeps Ordinary Time outside this curated model.',
        ],
      },
      {
        title: 'Reusable display',
        items: [
          'Exposes a compact two- or three-item display API with semantic, themeable Christicons.',
          'Includes bilingual observance metadata plus clear observed, transferred, commemoration-eligible and impeded states.',
        ],
      },
      {
        title: 'Validation',
        items: [
          'Provides an interactive date tester and Year Overview for inspecting celebrations, periods and calendar-rule outcomes.',
          'Ships with regression tests and CI checks for linting, types, tests and production builds.',
        ],
      },
    ],
  },
]

export const currentRelease = releases[0]
