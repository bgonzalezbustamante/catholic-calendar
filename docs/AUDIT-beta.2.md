# Audit for v0.1.0-beta.2 “Ivory Delta”

- **Date:** 2 November 2026
- **Base:** `main` at `be16076` (v0.1.0-beta.1 “Crystal Falcon”) and PR #38 as it stood before the audit
- **Scope:** the calendar engine, its tests, the demonstration app, packaging, CI, dependencies and documentation

## Method

- **Engine.** Every engine file was read against `docs/SOURCES.md` and the README. The engine was then run directly:
  - Easter for 2000–2100 against an independent algorithm;
  - every year built without errors, duplicate ids or two observed celebrations on one date;
  - all 36,890 supported dates resolved, with no Advent–Christmas or Lent–Easter overlap and no display longer than two items;
  - spot checks of every transfer and collision rule, including 2008, 2016, 2024, 2035, 2038, 2057 and 2062.
- **Engine changes.** The old and new engines were compared year by year. Only `impededBy` (53 entries) and the Spanish name of Christmas changed; no date or status changed. The display changed only on 27–31 December 2100, which now has a countdown.
- **Demonstration app.** Components and CSS were read for crashes, hydration differences, accessibility and layout. Contrast ratios were calculated against WCAG 2.2.
- **Release setup.**
  - `npm audit` (with and without `--omit=dev`) and `npm outdated`;
  - `npm pack --dry-run` of the package;
  - npm dist-tags, git tags and GitHub releases;
  - a review of the workflow file and the package manifest.

## How findings were resolved

| Label | Commit or pull request |
| --- | --- |
| H | PR #39, `fix: update Next.js to 16.4.4 for security advisories` |
| C1 | `fix: guard date helpers and export supported-date check` |
| C2 | `fix: count down past 2100 and name winning celebrations` |
| C3 | `test: cover full range, transfers, impediments and boundaries` |
| C4 | `fix: guard manual date entry and add an error page` |
| C5 | `fix: improve contrast, focus handling and table semantics` |
| C6 | `fix: credit the favicon and add social metadata` |
| C7 | `feat: store ISO release dates and clarify release navigation` |
| C8 | `chore: update React, Vitest and audited lockfile` |
| C9 | `ci: pin actions, test Node 22 and 24, audit production deps` |
| C10 | `chore: extend package smoke checks and expose manifest` |
| C11 | `docs: document the package API and clarify transfer rules` |
| C12 | `docs: record Ivory Delta changes and add release checklist` |

## Engine

| ID | Severity | Location | Finding | Resolution |
| --- | --- | --- | --- | --- |
| E1 | Medium | `resolver.ts` | No countdown from 27 to 31 December 2100: the resolver never built observances for 2101, although Christmas Time already ran into it. | Fixed (C2): a resolver-only context for 2101 supplies countdown targets only. |
| E2 | Low | `rules.ts` | `impededBy` gave a generic label (“principal liturgical day”, “Sunday”) when a selected celebration actually took the day, e.g. Lourdes 2032 (Ash Wednesday), Visitation 2026 (Most Holy Trinity). | Fixed (C2): names the winning selected celebration and falls back to the label otherwise. |
| E3 | Low (latent) | `rules.ts` | Two equal-rank non-solemnities on one date were resolved by list order. No current date triggers it. | Fixed (C2): explicit order by precedence, category tie-break, then id. |
| E4 | Low–medium (latent) | `docs/SOURCES.md`, `rules.ts` | SOURCES described a general Universal Norms no. 60 transfer; the code transfers only three solemnities by rule plus solemnity collisions. A new movable solemnity would be impeded silently. | Fixed (C3, C11): SOURCES describes the implemented rule; a full-range test fails if any solemnity is left impeded. |
| E5 | Low | `computus.ts`, `date-utils.ts` | Exported helpers other than Easter accepted any year, and `Date.UTC` treated years 0–99 as 1900–1999, giving misleading errors. | Fixed (C1): one Gregorian guard (1583–4099) for all helpers; `setUTCFullYear` keeps years literal. |
| E6 | Low | `observances.ts` | Spanish name of Christmas was “Navidad”, while SOURCES cites “Natividad del Señor”. | Fixed (C2). |
| E7 | Low | `computus.ts`, `index.ts` | `baptismOfTheLord` was described in the README but not exported. | Fixed (C1). |
| E8 | Low | `date-utils.ts`, `rules.ts` | `compareDates` used `localeCompare`; season dates were recomputed for every celebration (about 6 ms per state). | Fixed (C1, C2): plain comparison and a per-year cache. |
| E9 | Info | `observances.ts` | Stray indentation. | Fixed (C2). |
| E10 | Info | `docs/SOURCES.md` | Collision cases beyond the 2022 precedent (John the Baptist 2033, 2038, 2044; Peter and Paul 2057, 2068) follow the working rule but have no precedent of their own. | Documented as unverified (C11). |

## Tests

| ID | Severity | Location | Finding | Resolution |
| --- | --- | --- | --- | --- |
| T1 | Medium | `tests/calendar.test.ts` | Easter tested only for 2024–2027; no full-range checks. | Fixed (C3): 2000–2100 against Oudin’s algorithm, plus a sweep of every year. |
| T2 | Low | `tests/calendar.test.ts` | A test named “…and Ash Wednesday” never checked Ash Wednesday and repeated the Saint Francis check. | Fixed (C3): now checks Lourdes on Ash Wednesday 2032. |
| T3 | Low | `tests/calendar.test.ts` | No tests for Baptism of the Lord on a Sunday or Saturday Epiphany, or for the Christmas, Advent and Easter Time boundaries. | Fixed (C3). |
| T4 | Low | `tests/calendar.test.ts` | Transfers not covered: Annunciation on a Lenten Sunday (2001, 2012) and Easter Sunday (2035), Saint Joseph on Palm Sunday (2062), Peter and Paul 2057, John the Baptist 2038. | Fixed (C3). |
| T5 | Low | `tests/calendar.test.ts` | No tests for Mary, Mother of the Church (2018 start, 2066 impediment), Immaculate Heart impediments, start years, invalid input, `todayInTimeZone` or the end of the range. | Fixed (C3). |
| T6 | Medium | `tests/releases.test.ts` (PR #38) | Tests pinned the temporary in-development state, so they would fail at release. | Fixed (C7): tests now check rules: first entry matches `package.json`, published dates match CHANGELOG headings, unreleased entries are undated. |

## Demonstration app

| ID | Severity | Location | Finding | Resolution |
| --- | --- | --- | --- | --- |
| A1 | **High** | `components/calendar-tester.tsx` | Typing into the date field crashed the page: partial years such as `0002-11-02` and years outside 2000–2100 reached the engine, which throws. Regression from commit `844e200` in beta.1; no error page existed. | Fixed (C4): the input keeps a draft and commits only supported dates; `app/error.tsx` added. |
| A2 | **High** | `app/globals.css` | Coral and aqua text (eyebrows, Return to today, Current year, layer numbers) and grey Spanish names were below 4.5:1. | Fixed (C5): text tokens `--coral-text` (5.4:1) and `--teal-text` (5.6:1), and `--ash` for Spanish names. |
| A3 | Medium | `app/globals.css` | Aqua focus rings were below 3:1, and Release Notes buttons removed the outline. | Fixed (C5): blue focus rings on every control. |
| A4 | Medium | tester, Year Overview, Release Notes | Buttons that disabled themselves dropped keyboard focus to the page. | Fixed (C4, C5, C7): `aria-disabled` with guarded handlers. |
| A5 | Medium | `components/release-notes.tsx` | “Previous” moved to a newer release; page buttons’ accessible names did not contain their visible numbers; page changes were silent. | Fixed (C7): “Newer” and “Older”, numbers kept in names, `aria-live` card, stable section heading. |
| A6 | Medium | `app/page.tsx` | “Today” is Amsterdam’s date, with no indication. | Fixed (C4): the control reads “Return to today (Europe/Amsterdam)” and is inactive on today. |
| A7 | Medium | `components/year-overview.tsx` | en-GB short months differ between ICU versions (“Sep” or “Sept”), a possible hydration mismatch. | Fixed (C5): fixed month list. |
| A8 | Medium | `components/site-footer.tsx` | The Flaticon favicon credit required by `THIRD_PARTY_NOTICES.md` was not shown. | Fixed (C6). |
| A9 | Medium | `app/globals.css` | The date control overflowed by about 34 px at 320 px width. | Fixed (C5). |
| A10 | Low | `components/release-notes.tsx` | Status and date tags looked identical; dates were free text. | Fixed (C7): ISO dates in `<time>`, “Released on” for screen readers, distinct in-development tag. |
| A11 | Low | page, tester, Year Overview | `aria-label` on plain `div`s, unnamed scrolling tables, silent year changes, arrow glyphs read aloud, empty icon cells, quotation markup for non-quotes, heading levels out of order, period chips without names. | Fixed (C4, C5, C7). |
| A12 | Low | `components/site-footer.tsx` | Link name differed from its text; a Creative Commons glyph on an MIT project; “Dr.” with a full stop; year from the server clock. | Fixed (C6). |
| A13 | Low | `app/layout.tsx` | No `metadataBase`, Open Graph or Twitter metadata; `lang="en"` for British copy. | Fixed (C6). |
| A14 | Low | `app/globals.css` | No colour-scheme declaration. | Fixed (C5): `color-scheme: light`. |
| A15 | Info | `components/year-overview.tsx` | The January part of Christmas Time carried over from the previous year was not listed. | Fixed (C5). |
| A16 | Low | `app/icon.png` (uncommitted) | A local re-export is 104 KB against 23.5 KB committed and carries Fireworks metadata. | Deferred: not part of this release; optimise before committing if it is kept. |

## Release setup

| ID | Severity | Location | Finding | Resolution |
| --- | --- | --- | --- | --- |
| R1 | **Critical** | `package.json` | `next@16.3.8` affected by GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr (critical) and GHSA-p3m5-59mp-jv5r (high). The app uses none of the affected features, but production ran this version. | Fixed (H): 16.4.4, shipped ahead of beta.2. |
| R2 | High | PR #38 title | GitHub uses the PR title in the merge commit; `[skip netlify]` there would skip the production deploy. | Release checklist step (C12); must be removed before merging. |
| R3 | High | npm dist-tags | `latest` still points to `0.1.0-alpha.1`. | Release checklist step (C12); the maintainer moves it with `npm dist-tag`. |
| R4 | Medium | `.github/workflows/ci.yml` | No dependency audit in CI; no Dependabot. | Fixed (C9): production audit step; Dependabot for npm and Actions. |
| R5 | Medium | `.github/workflows/ci.yml` | No `permissions` block; actions pinned by tag and on retiring majors. | Fixed (C9): `contents: read`; v7 actions pinned by SHA. |
| R6 | Low | `.github/workflows/ci.yml` | Node 22 only; no cache, concurrency or timeout. | Fixed (C9): Node 22 and 24. |
| R7 | Moderate | development dependencies | `vite` and `@vitest/mocker` (moderate), `zod` (high) via lint tooling. | Fixed (C8). |
| R8 | Moderate | development dependencies | Sixteen moderate `minimatch` advisories in ESLint 9 and its plugins. | Deferred: needs ESLint 10, a major upgrade. Development tooling only. |
| R9 | Low | `package.json` | `fsevents` install script not reviewed under `strict-allow-scripts`. | Fixed (C8). |
| R10 | Low | `scripts/check-package.mjs` | Smoke test did not cover ESM import, the display constant or the tarball contents. | Fixed (C10). |
| R11 | Low | `scripts/clean-package.mjs` | Path relative to the working directory. | Fixed (C10). |
| R12 | Low | package `exports` | No `./package.json` subpath. | Fixed (C10). |
| R13 | Low | npm | No provenance attestations. | Deferred: optional step in `docs/RELEASING.md`. |
| R14 | Low | `tsconfig.package.json` | `moduleResolution: "Node"` is deprecated from TypeScript 6. | Deferred: change with the TypeScript major upgrade. |
| R15 | Low | repository | No `netlify.toml`; build settings live only in the Netlify UI. | Deferred: kept in the UI by the maintainer’s choice. |
| R16 | Info | PR #38 branch | `feat/release-notes-dates` does not follow `release/<codename>-<version>`. | Deferred: renaming would require a new pull request. |

## Documentation

| ID | Severity | Location | Finding | Resolution |
| --- | --- | --- | --- | --- |
| D1 | Medium | `docs/SOURCES.md` | Stale codename “Verdant Orchard” and a “v0.1.0-beta.1” limits heading. | Fixed (C11). |
| D2 | Medium | `CHANGELOG.md` | Non-standard Unreleased heading; no compare links. | Fixed (C12). |
| D3 | Low | `README.md` | “Once published” wording; a countdown example that was not the real return value. | Fixed (C11). |
| D4 | Low | package README | Undocumented exports, statuses, errors and ESM use. | Fixed (C11). |
| D5 | Low | `docs/SOURCES.md` | Commemoration described for optional memorials only; GIRM 355 and the code also cover obligatory ones. | Fixed (C11). |
| D6 | Low | PR #38 CHANGELOG | “Each entry” when unreleased entries carry no date; process-only bullet. | Fixed (C12). |

## Checked and fine

- Liturgical outcomes for every supported year:
  - Easter, Advent and Christ the King;
  - Baptism of the Lord and Holy Family;
  - the Saint Joseph, Annunciation and Immaculate Conception transfers;
  - Immaculate Heart and Mary, Mother of the Church impediments;
  - precedence values against the Table of Liturgical Days;
  - period boundaries.
- Input validation: invalid days, months and formats are rejected.
- Returned objects are fresh copies, ids are unique within each year and sorting is stable.
- Packaging and repository:
  - package `main`, `types` and `exports`, CommonJS output and `sideEffects: false`;
  - tarball limited to the engine, README, licence and manifest;
  - all seventeen Christicons are used and credited;
  - both LICENSE files are correct;
  - the alpha and beta.1 tags match their GitHub pre-releases and npm `gitHead`.
- Demonstration app: stable React keys, correct server and client boundaries, and year controls clamped to the supported range.
