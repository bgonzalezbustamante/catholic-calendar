# Catholic Calendar

**Current release: v0.1.0-alpha.1 “Calm Bridge” — released 3 October 2026**

**Next release: v0.1.0-beta.1 “Verdant Orchard” — in development**

A reusable Roman Catholic calendar proof of concept built in TypeScript. It derives selected movable celebrations and periods, applies a curated set of General Roman Calendar precedence and transfer rules, and exposes the resulting state through a compact display API, an interactive tester and a Year Overview.

The calendar engine is UI-agnostic and lives under `lib/catholic-calendar/`. The Next.js application in this repository is a demonstration and validation surface rather than a dependency of the engine.

## Overview

- Computes Gregorian Easter and the selected Paschal-cycle dates, including Ash Wednesday, Holy Week, Easter Time, Ascension, Pentecost, Trinity Sunday, Corpus Christi and the Sacred Heart.
- Computes the First Sunday of Advent and derives Christ the King, Advent and Christmas Time.
- Resolves four independent outputs for a civil date: primary selected observance, customary observances, active liturgical/devotional periods, and a countdown to the next observed selected celebration when appropriate.
- Tracks nominal and observed dates separately and distinguishes observed, transferred, commemoration-eligible and impeded observances.
- Derives Shrove Tuesday from Ash Wednesday and exposes it separately from liturgical rank and precedence, with Mardi Gras and Fat Tuesday as aliases.
- Exposes a composed display API with a two- or three-item limit, deterministic engine order and semantic Christicons metadata.
- Uses spare composed-display capacity for an impeded nominal celebration when no primary observance occupies the date, without changing its canonical status or precedence.
- Includes English and Spanish observance names.
- Provides an interactive date tester and Year Overview for inspecting calendar outcomes and period boundaries.

## Calendar scope

The current model is deliberately curated rather than a complete Ordo generator.

It includes the principal Christmas, Lent, Holy Week and Easter boundaries; selected Marian observances; selected saints and feasts; Shrove Tuesday as a customary pre-Lenten observance; transfer handling for Saint Joseph, the Annunciation and the Immaculate Conception; and selected same-date solemnity collisions.

The modelled periods are:

- Christmas Time
- Lent
- Holy Week
- Sacred Paschal Triduum
- Easter Time
- St Michael’s Lent
- Advent

St Michael’s Lent is represented as a Franciscan devotional period from 15 August through 29 September and never outranks the liturgical calendar. **Ordinary Time is intentionally not modelled.**

The project follows universal Roman dates for Epiphany, Ascension and Corpus Christi. It does not infer national, diocesan, parish or religious-order proper calendars.

## Architecture

The reusable engine boundary is `lib/catholic-calendar/`:

1. `date-utils.ts` — strict civil-date arithmetic using UTC dates.
2. `computus.ts` — Gregorian Easter, First Sunday of Advent, Baptism of the Lord and Holy Family calculations.
3. `calendar.ts` — supported range, movable-cycle derivation and liturgical/devotional periods.
4. `observances.ts` — curated ranked observance definitions.
5. `customary.ts` — derived non-ranked customary observances.
6. `rules.ts` — precedence, transfers, solemnity collisions and impediments.
7. `resolver.ts` — date-state and Year Overview APIs.
8. `types.ts` — package-facing data contracts.
9. `presentation.ts` — composed-display and icon semantics.
10. `index.ts` — public exports.

The demonstration shell is separate:

- `components/calendar-tester.tsx` — interactive date inspector.
- `components/year-overview.tsx` — annual validation surface.
- `components/calendar-display.tsx` — reusable visual renderer.
- `components/release-notes.tsx` and `lib/releases.ts` — short reader-facing release notes.
- `app/page.tsx` — demonstration page.

This separation keeps the engine independent of React, Next.js, network calls and database state.

The publishable npm package is defined in `packages/catholic-calendar/`. Its generated `dist/` output is built from the same `lib/catholic-calendar/` source, so the package and demonstration application do not maintain separate calendar implementations.

## npm package

The package is prepared as `@bgonzalezbustamante/catholic-calendar` with zero runtime dependencies. Once published, consumers can install it with:

```bash
npm install @bgonzalezbustamante/catholic-calendar@beta
```

Verdant Orchard is prepared for the `beta` npm channel. Until beta.1 is published, the previously released alpha remains available through `@alpha`. Prerelease consumers should use an explicit channel or exact version rather than relying on `latest`. The package publishes CommonJS JavaScript together with TypeScript declarations. Package contents are restricted to the compiled engine, package README and MIT licence; the Next.js demonstration application is not included.

Validate the package locally with:

```bash
npm run check:package
```

This runs `npm pack --dry-run`; the package’s `prepack` lifecycle automatically rebuilds `dist/` before npm determines the tarball contents, and the compiled public API is then smoke-tested. The same automatic build therefore runs before a real `npm pack` or `npm publish`.

## Core API

```ts
import { getCatholicCalendarState } from '@/lib/catholic-calendar'

const state = getCatholicCalendarState('2026-09-08')
```

Representative state:

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
  customaryObservances: [],
  liturgicalPeriods: [],
  devotionalPeriods: [
    { id: 'st-michaels-lent', name: "St Michael's Lent", ... }
  ],
  countdown: null,
  ...
}
```

A customary date can coexist with the ranked calendar and countdown without taking liturgical precedence:

```ts
getCatholicCalendarState('2026-02-17').customaryObservances
// [{ id: 'shrove-tuesday', name: 'Shrove Tuesday', aliases: ['Mardi Gras', 'Fat Tuesday'], ... }]
```

A date without a selected discrete celebration can expose the countdown independently:

```ts
getCatholicCalendarState('2026-10-03').countdown
// Our Lady of the Rosary — 4 days
```

## Observance states

- `observed` — observed on the nominal date.
- `commemoration-eligible` — may be commemorated on a privileged weekday while the seasonal weekday retains liturgical precedence. The demonstration UI presents this state as **Commemorated**.
- `transferred` — nominal and observed dates differ; the transfer reason is retained.
- `impeded` — retained for inspection but has no observed date because a higher-ranking day has precedence.

## Period and historical semantics

The engine resolves civil dates rather than hours of the liturgical day. This permits intentional date-level overlaps, including Lent with the beginning of the Sacred Paschal Triduum on Holy Thursday and the Triduum with Easter Time on Easter Sunday.

The supported civil-date range is **2000–2100**. Christmas Time beginning on 25 December 1999 is carried into the first supported January without otherwise exposing 1999 as a supported public year.

The project is intended for current and forward-looking application use, not complete historical reconstruction of every revision to the Roman Calendar.

## Local development

Requires Node.js 22 or later.

```bash
npm ci
npm run dev
```

Run the standard validation suite with:

```bash
npm run check
npm run check:package
npm run build
```

For release security checks, the production dependency tree is assessed with:

```bash
npm audit --omit=dev
```

The repository does not require environment variables, an API connection or a database.

## Documentation

- `CHANGELOG.md` is the canonical technical release history.
- `lib/releases.ts` contains the short reader-facing Release Notes displayed by the demonstration app.
- `docs/SOURCES.md` documents liturgical sources, rule choices and intentional limitations.
- `THIRD_PARTY_NOTICES.md` records third-party asset licensing and attribution.

## Licence

Source code and repository documentation are released under the MIT License. See `LICENSE`. Selected third-party assets retain their own licence terms; see `THIRD_PARTY_NOTICES.md`.
