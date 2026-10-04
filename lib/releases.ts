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
    codename: 'Verdant Orchard',
    status: 'In development',
    summary:
      'Verdant Orchard extends the curated calendar with a non-ranked customary-observance layer and refines the demonstration interface while preserving Roman-calendar precedence semantics.',
    sections: [
      {
        title: 'Calendar model',
        items: [
          'Adds Shrove Tuesday as a derived customary observance, with Mardi Gras and Fat Tuesday aliases, without assigning liturgical rank or precedence.',
          'Carries Saint Francis of Assisi on 4 October forward with its General Roman Calendar memorial rank and an explicit display mapping.',
        ],
      },
      {
        title: 'Interface',
        items: [
          'Shows the weekday in Display configuration and exposes customary observances as a distinct tester layer.',
          'Uses spare composed-display capacity for impeded nominal celebrations, while keeping active periods ahead of them and preserving canonical precedence.',
          'Places periods above celebrations in Year Overview, adds a customary-observance table and streamlines the liturgical-rank guide.',
        ],
      },
      {
        title: 'Package',
        items: [
          'Bumps the engine and package to v0.1.0-beta.1 and prepares the npm beta distribution channel.',
          'Adds package-facing customary-observance types, builders, state output and display composition with regression coverage.',
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
