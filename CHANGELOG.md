# Changelog

## [Unreleased]

### Changed

- Marian observances and Marian countdown targets now use the rosary Christicon before the generic cross fallback.
- Added guaranteed icon fallback coverage to the composed display: unmapped observances/countdowns use the Christicons cross, while unmapped periods use church-1.
- Added semantic Christicons to the composed calendar display, normalised the curated SVG assets for themeable rendering, and exposed icon identifiers in package display items.
- Removed compact-display period prioritisation. The composed display now follows the engine's natural state order and only applies the selected two- or three-item truncation.
- Kept all three diagnostic cards independent from the composed-display limit and changed the tester limit choices to two or three items.
- Added Spanish celebration names to the calendar observance metadata and display them as lighter secondary labels in Year Overview.
- Added visible tester controls for the core composed-display length.
- Realigned the in-app Release Notes card with the Weekly Penguin Timeline pattern: eyebrow outside the card, version/codename heading and status pill inside, full-width summary, and two-column detail sections.
- Added a prominent composed calendar display preview above the three diagnostic cards and reduced the diagnostic card footprint.
- Simplified selected celebration labels to Divine Mercy Sunday, Corpus Christi, All Souls, Immaculate Conception, and Christmas.
- Marked Calm Bridge release notes as `In Development` without a release date.
- Added the npm lockfile, switched CI to `npm ci`, pinned npm 11.21.0 as the package manager, and generate Next.js route types before TypeScript checks.
- Stopped tracking generated `next-env.d.ts`; Next.js recreates it during type generation and builds.

### Security

- Explicitly deny the currently unnecessary `unrs-resolver` install script and fail installs when future dependency lifecycle scripts have not been reviewed.


All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and the project uses Semantic Versioning for its release line.

## [0.1.0-alpha.1] — Calm Bridge — In Development

### Added

- Standalone Next.js 16.3.8 proof-of-concept application using the visual identity established by Weekly Penguin Timeline.
- UI-agnostic TypeScript Catholic calendar engine under `lib/catholic-calendar/`.
- Gregorian Easter computus and derived Paschal-cycle dates.
- Derived First Sunday of Advent, Advent period and Christ the King date.
- Curated Roman Catholic observance set with Marian celebrations including Lourdes, Fatima, Mount Carmel and Guadalupe.
- Separate liturgical-period and Franciscan devotional-period layers, including St Michael’s Lent from 15 August through 29 September.
- Three-layer date state: primary observance, active periods and countdown to the next observed celebration when appropriate.
- Explicit nominal versus observed dates, transfer reasons and impediment metadata.
- Transfer handling for Saint Joseph, the Annunciation and the Immaculate Conception.
- Selected same-date solemnity collision resolution, including the Sacred Heart / Nativity of Saint John the Baptist pattern.
- Interactive date tester with computus and Advent diagnostics.
- Year overview for visual inspection of observed, transferred and impeded entries.
- Regression tests for known Easter dates, Advent, period overlaps, countdowns, transfers, impediments and the 2022 Sacred Heart collision.
- GitHub Actions CI for linting, type-checking, tests and production build.
- Source and rule documentation in `docs/SOURCES.md`.

### Notes

- The alpha follows universal Roman dates and deliberately does not implement national or diocesan transfers of Epiphany, Ascension or Corpus Christi.
- The engine supports civil dates from 2000 through 2100 and is intended for current/future application use rather than full historical calendar reconstruction.
- Period boundaries are date-level approximations; Holy Thursday and Easter Sunday intentionally expose overlapping contextual periods.
