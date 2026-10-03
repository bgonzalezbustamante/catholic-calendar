# Catholic Calendar

**v0.1.0-alpha.1 “Calm Bridge” — In Development**

A standalone proof of concept for a reusable Roman Catholic calendar engine and presentation component. The project derives selected movable celebrations and periods, applies a curated set of General Roman Calendar precedence and transfer rules, and exposes the result through an interactive tester and year overview.

The visual identity intentionally follows `bgonzalezbustamante/weekly-penguin-timeline`: Oxford blue, coral and aqua accents, Noto Serif body copy, Roboto interface typography, compact cards and explicit visual-QA surfaces.

## What the PoC does

- Computes Gregorian Easter and derives Ash Wednesday, Palm Sunday, Holy Week, the Paschal Triduum, Easter Time, Ascension, Pentecost, Trinity Sunday, Corpus Christi, the Sacred Heart and the Immaculate Heart.
- Computes the First Sunday of Advent from the 27 November–3 December window and derives Christ the King and Advent.
- Resolves three independent layers for a date: primary selected observance, active liturgical/devotional periods, and a countdown to the next observed selected celebration when no discrete observance is active.
- Exposes a composed display API that defaults to two reader-facing items and supports a two- or three-item limit. The display follows the engine’s natural state order—primary observance, liturgical periods, devotional periods, then countdown when space remains—without a separate presentation-precedence layer.
- Tracks `nominalDate` and `observedDate` separately for transferable celebrations.
- Retains selected observances that are impeded by a higher-ranking day as nominal diagnostic entries instead of falsely reporting them as observed.
- Includes Marian celebrations in the curated scope, including Lourdes, Fatima, Mount Carmel and Guadalupe.
- Models St Michael’s Lent as a separate Franciscan devotional period from 15 August through 29 September; it never outranks the liturgical calendar.
- Uses the universal Roman dates for Epiphany, Ascension and Corpus Christi rather than national transfers.
- Includes an interactive date tester and a complete year overview for visual QA.
- Carries Spanish celebration labels in observance metadata and displays them beneath the English names in the Year Overview.
- Keeps the calendar engine free of React, Next.js, network calls and database state so it can later be extracted into a package.

## Calendar scope

The current alpha includes the following selected celebrations and boundaries:

- Christmas cycle: Mary, Mother of God; Epiphany; Baptism of the Lord; First Sunday of Advent; Immaculate Conception; Christmas; Christmas Time.
- Early year: Presentation of the Lord; Our Lady of Lourdes.
- Lent and Holy Week: Ash Wednesday; Saint Joseph; Annunciation; Palm Sunday; Holy Thursday; Good Friday; Holy Saturday; Lent; Holy Week; Sacred Paschal Triduum.
- Easter cycle: Easter Sunday; Second Sunday of Easter / Divine Mercy Sunday; Ascension; Pentecost; Mary, Mother of the Church; Visitation; Trinity Sunday; Corpus Christi; Sacred Heart; Immaculate Heart; Easter Time.
- Summer and autumn: Nativity of Saint John the Baptist; Saints Peter and Paul; Our Lady of Mount Carmel; Assumption; Queenship of Mary; Nativity of Mary; Exaltation of the Holy Cross; Our Lady of Sorrows; Saints Michael, Gabriel and Raphael; Our Lady of the Rosary; All Saints; All Souls; Christ the King.
- Additional Marian observances: Our Lady of Fatima and Our Lady of Guadalupe.
- Devotional layer: St Michael’s Lent, 15 August–29 September inclusive.

## Architecture

The reusable boundary is `lib/catholic-calendar/`:

1. `date-utils.ts` — strict civil-date arithmetic using UTC calendar dates.
2. `computus.ts` — Gregorian Easter, First Sunday of Advent and Baptism of the Lord calculations.
3. `calendar.ts` — supported range, movable-cycle derivation and liturgical/devotional periods.
4. `observances.ts` — curated observance definitions.
5. `rules.ts` — precedence, transfers, solemnity collision handling and impediments.
6. `resolver.ts` — date-state and year-overview APIs.
7. `types.ts` — package-facing data contracts.
8. `index.ts` — public exports.

The proof-of-concept shell is deliberately separate:

- `components/calendar-tester.tsx` — interactive date inspector.
- `components/year-overview.tsx` — chronological QA table.
- `components/release-notes.tsx` and `lib/releases.ts` — reader-facing release documentation.
- `app/page.tsx` — demonstration page only.

The intended package boundary is therefore straightforward:

```text
lib/catholic-calendar/
        │
        ├── PoC app
        ├── Academic Website
        ├── Research Dashboard
        └── other consumers
```

## Core API

```ts
import { getCatholicCalendarState } from '@/lib/catholic-calendar'

const state = getCatholicCalendarState('2026-09-08')
```

Representative output:

```ts
{
  date: '2026-09-08',
  primaryObservance: {
    id: 'nativity-of-mary',
    name: 'Nativity of the Blessed Virgin Mary',
    rank: 'feast',
    nominalDate: '2026-09-08',
    observedDate: '2026-09-08',
    status: 'observed'
  },
  liturgicalPeriods: [],
  devotionalPeriods: [
    { id: 'st-michaels-lent', name: "St Michael's Lent", ... }
  ],
  countdown: null,
  ...
}
```

A date with no selected discrete celebration exposes the countdown independently:

```ts
getCatholicCalendarState('2026-10-03').countdown
// Our Lady of the Rosary — 4 days
```

## Transfer and overlap model

The engine distinguishes three states:

- `observed` — celebrated on its nominal date.
- `transferred` — nominal and observed dates differ; the transfer reason is retained.
- `impeded` — the selected nominal observance is retained for inspection but has no observed date because a higher-ranking day takes precedence.

The alpha includes explicit rules for Saint Joseph, the Annunciation and the Immaculate Conception, plus selected same-date solemnity collisions such as the 2022 coincidence of the Sacred Heart and the Nativity of Saint John the Baptist.

This is intentionally not a full implementation of every local proper calendar. The PoC follows the General Roman Calendar baseline and does not infer diocesan or episcopal-conference transfers. In particular, Epiphany remains 6 January, Ascension remains Easter +39 days, and Corpus Christi remains Easter +60 days.

## Date-level period semantics

The engine resolves civil dates, not hours of the liturgical day. To preserve useful context at day granularity:

- Lent is represented from Ash Wednesday through Holy Thursday inclusive.
- Holy Week is Palm Sunday through Holy Saturday inclusive.
- the Sacred Paschal Triduum is Holy Thursday through Easter Sunday inclusive.
- Easter Time is Easter Sunday through Pentecost inclusive.

This deliberately permits meaningful boundary overlaps on Holy Thursday and Easter Sunday. A future package may expose time-aware boundaries separately if a consumer needs them.

## Historical scope

The supported range is 2000–2100. The purpose is current and forward-looking site use, not a complete historical reconstruction of every revision to the Roman Calendar. Known additions that materially affect this curated set are gated where useful: Divine Mercy Sunday from 2000, Fatima and Guadalupe from 2002, and Mary, Mother of the Church from 2018.

## Local setup

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

or:

```bash
npm run check
```

The repository does not require environment variables, an API connection or a database.

## Sources and rule notes

The PoC is based principally on the Universal Norms on the Liturgical Year and the Calendar, the General Roman Calendar, Holy See guidance on popular piety, and published calendar guidance for exceptional transfers. See [`docs/SOURCES.md`](docs/SOURCES.md) for the source map and the intentional limits of the alpha rules.

## Release documentation

`CHANGELOG.md` contains the technical record. `lib/releases.ts` contains the shorter reader-facing release notes displayed by the demonstration app.

## Licence

Source code and repository documentation are released under the MIT License. See `LICENSE`. Selected third-party assets retain their own licence terms; see `THIRD_PARTY_NOTICES.md`.
