export type ReleaseNoteSection = {
  title: string
  items: string[]
}

export type ReleaseStatus = 'Released' | 'In development'

export type ReleaseNote = {
  version: string
  codename: string
  status: ReleaseStatus
  // ISO date (YYYY-MM-DD); set only once the release is published.
  releasedOn?: string
  summary: string
  sections: ReleaseNoteSection[]
}

export const releases: ReleaseNote[] = [
  {
    version: 'v0.1.0-beta.2',
    codename: 'Ivory Delta',
    status: 'In development',
    summary:
      'Ivory Delta follows a full audit of the calendar engine, the demonstration app and the release process. It fixes a date-entry crash, makes the interface more accessible and dates the release history.',
    sections: [
      {
        title: 'Calendar engine',
        items: [
          'Names the celebration that takes precedence when another is impeded, such as Ash Wednesday or Most Holy Trinity.',
          'Keeps the countdown running through the last days of 2100 and adds a check for supported dates.',
        ],
      },
      {
        title: 'Interface',
        items: [
          'Prevents the page from failing when a partial or unsupported date is typed, and adds an error page.',
          'Improves contrast, focus and screen-reader support, and shows release dates beside earlier versions.',
        ],
      },
      {
        title: 'Security and checks',
        items: [
          'Updates Next.js to resolve published security advisories.',
          'Tests every Easter date from 2000 to 2100 and runs CI on Node 22 and 24.',
        ],
      },
    ],
  },
  {
    version: 'v0.1.0-beta.1',
    codename: 'Crystal Falcon',
    status: 'Released',
    releasedOn: '2026-10-05',
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
          'Keeps the calendar control at the upper right, removes redundant date labels and shows the selected value directly in weekday format.',
          'Places periods above celebrations, right-aligns the Ordinary Time note with an icon, clarifies the calendar model scope and paginates Release Notes one release at a time.',
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
    releasedOn: '2026-10-03',
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

export const latestPublishedRelease = releases.find(
  (release) => release.status === 'Released'
)
