# Changelog

All notable changes to this project are documented here. The format follows Keep a Changelog and the project uses Semantic Versioning.

## [Unreleased] — v0.1.0-beta.1 “Crystal Falcon”

### Added

- Added regression and package-smoke coverage for impeded nominal celebrations filling available composed-display slots, including Saint Francis of Assisi on 4 October 2026 and the Visitation on 31 May 2026.
- Added one-release-at-a-time pagination to the reader-facing Release Notes, following the Weekly Penguin Timeline interaction pattern.

### Changed

- Bumped the application and publishable package to `0.1.0-beta.1` and prepared npm publication through the `beta` dist-tag.
- Fixed the composed display at two items and removed the package/UI option for selecting a maximum display length.
- Changed composed-display fallback behaviour so impeded nominal celebrations can fill unused slots after primary observances and active periods, without becoming observed or primary; countdowns use only remaining capacity.
- Removed the Display configuration card and moved the weekday-formatted selected date directly below the composed calendar display, aligned to the right.
- Moved “Periods in this model” above “Celebrations in this model” in Year Overview.
- Right-aligned the Ordinary Time note and added a small semantic icon.
- Removed the redundant “Rank labels used in the celebrations table above.” sentence while retaining the complete liturgical-rank guidance section.
- Made the Saint Francis of Assisi display mapping explicit while retaining the General Roman Calendar memorial rank on 4 October.

## [0.1.0-alpha.1] — Calm Bridge — 2026-10-03

### Added

- Added a UI-agnostic TypeScript Catholic calendar engine under `lib/catholic-calendar/`, with Gregorian Easter computus, Advent calculation and derived movable celebrations.
- Added a curated General Roman Calendar observance model with English and Spanish labels, including selected Marian celebrations, major feasts and saints used by the demonstration application.
- Added separate liturgical and devotional period layers. Modelled periods include Christmas Time, Lent, Holy Week, the Sacred Paschal Triduum, Easter Time, Advent and St Michael’s Lent; Ordinary Time is intentionally outside the current scope.
- Added primary-observance, active-period and countdown state resolution, with nominal and observed dates kept separately.
- Added transfer and impediment handling for the selected rule set, including Saint Joseph, the Annunciation, the Immaculate Conception and selected same-date solemnity collisions.
- Added package-facing display summaries with a two- or three-item limit, deterministic engine order and semantic Christicons metadata.
- Added themeable Christicon rendering with explicit mappings for key celebrations and periods plus guaranteed observance and period fallbacks.
- Added the interactive Calendar state tester and bilingual Year Overview, including celebration icons, modelled-period boundaries, rank/status pills, transfer diagnostics and year navigation.
- Added regression coverage for computus, periods, countdowns, transfers, impediments, collisions, display composition, icon semantics and bilingual observance metadata.
- Added GitHub Actions validation for linting, type-checking, tests and production builds.
- Added a publishable `@bgonzalezbustamante/catholic-calendar` package boundary under `packages/catholic-calendar/`, compiled from the existing UI-agnostic engine with CommonJS output, TypeScript declarations and zero runtime dependencies.
- Added package smoke testing and `npm pack --dry-run` validation to the standard CI workflow.
- Added a package-level `prepack` lifecycle so direct `npm pack` and `npm publish` commands rebuild the compiled engine before npm determines the tarball contents.
- Set the publishable package’s default npm dist-tag to `alpha` and documented explicit `@alpha` installation for prerelease consumers.

### Changed

- Renamed the package-level privileged-weekday state from `commemorated` to `commemoration-eligible`, with `commemorationEligibilityReason` describing why commemoration is permitted. The demonstration UI deliberately retains the reader-facing label “Commemorated” and the composed display remains unchanged.
- Made the composed display follow the engine’s natural order—primary observance, liturgical periods, devotional periods, then countdown—without a separate presentation-priority layer.
- Kept diagnostic cards independent from the composed-display item limit and restricted the display control to two or three items.
- Refined Year Overview into separate celebrations, periods and rank-guidance sections, with consistent headings, responsive rank pills and a dedicated period table.
- Confined impeded-observance diagnostics to Year Overview while retaining transfer and commemoration details in the date tester.
- Added Spanish observance names as package metadata and secondary Year Overview labels.
- Standardised selected celebration names and final semantic icon mappings, including Holy Week → calvary, Baptism of the Lord → dove, Holy Thursday → bread, Saints Peter and Paul → Saint Peter, and All Souls → tombstone.
- Added the npm lockfile, pinned npm 11.21.0, switched CI installs to `npm ci`, and generate Next.js route types before TypeScript validation.
- Stopped tracking generated `next-env.d.ts`.

### Fixed

- Fixed the lower supported-range boundary so Christmas Time beginning on 25 December 1999 remains active in early January 2000 without exposing 1999 as a supported public calendar year.
- Corrected privileged-weekday memorial handling so eligible memorials remain available for commemoration rather than being treated as impeded.
- Fixed Year Overview masked-icon visibility outside flex layouts.
- Hardened manual date entry against incomplete, invalid and out-of-range dates.
- Added regression coverage confirming that Saint Benedict is displayed on 11 July when unimpeded and remains only as an impeded Year Overview entry when a Sunday has precedence.

### Security

- Explicitly deny the currently unnecessary `unrs-resolver` install script and fail installs when future dependency lifecycle scripts have not been reviewed.
- Release audit with `npm audit --omit=dev` reports zero production vulnerabilities.
- A high-severity advisory remains in the development-only ESLint/Next lint dependency chain through `braces` (GHSA-vfj7-8cjw-p6xm). No forced dependency downgrade is applied because the advisory currently has no patched `braces` release in the affected tree.

### Notes

- The alpha follows universal Roman dates and deliberately does not implement national or diocesan transfers of Epiphany, Ascension or Corpus Christi.
- The supported civil-date range is 2000–2100. The engine is intended for current and forward-looking application use rather than complete historical reconstruction.
- Period boundaries are date-level approximations; Holy Thursday and Easter Sunday intentionally expose overlapping contextual periods.
- The selected observance set is curated rather than a complete General Roman Calendar or local proper calendar.
