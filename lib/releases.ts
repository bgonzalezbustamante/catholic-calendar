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
    version: 'v0.1.0-beta.1',
    codename: 'Crystal Falcon',
    status: 'In development',
    summary:
      'Crystal Falcon refines the fixed two-item calendar display, preserves impeded same-day celebrations when space is available and streamlines the demonstration interface.',
    sections: [
      {
        title: 'Calendar display',
        items: [
          'Uses available composed-display space for impeded nominal celebrations without changing their canonical status or liturgical precedence.',
          'Keeps the display fixed at two items, ordered by primary observance, active periods, impeded nominal celebration and then countdown.',
        ],
      },
      {
        title: 'Interface',
        items: [
          'Moves the weekday-formatted selected date below the composed display and removes the display-configuration card.',
          'Places periods above celebrations, right-aligns the Ordinary Time note with an icon, and paginates Release Notes one release at a time.',
        ],
      },
      {
        title: 'Release preparation',
        items: [
          'Carries Saint Francis of Assisi on 4 October with its General Roman Calendar memorial rank and an explicit display mapping.',
          'Bumps the application and package to v0.1.0-beta.1 and prepares the npm beta distribution channel.',
        ],
      },
    ],
  },
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
