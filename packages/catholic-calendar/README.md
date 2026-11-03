# @bgonzalezbustamante/catholic-calendar

A small, UI-agnostic TypeScript engine for the curated Roman Catholic calendar model used by the Catholic Calendar project.

## Install

```bash
npm install @bgonzalezbustamante/catholic-calendar@beta
```

## Usage

```ts
import {
  getCatholicCalendarState,
  getCalendarDisplaySummary,
} from '@bgonzalezbustamante/catholic-calendar'

const state = getCatholicCalendarState('2026-09-08')
const display = getCalendarDisplaySummary(state)

console.log(display.text)
// Nativity of the Blessed Virgin Mary · St Michael's Lent
```

The package exposes the same engine used by the demonstration application, including computus helpers, selected liturgical observances, periods, calendar-state resolution, Year Overview data and compact display summaries.

It is published as CommonJS with TypeScript declarations. ESM projects can use the named imports shown above in Node.

## API

| Export | Purpose |
| --- | --- |
| `getCatholicCalendarState(date)` | Primary observance, observed and nominal observances, active periods, countdown and calculation details for an ISO date (`YYYY-MM-DD`). |
| `getCalendarDisplaySummary(state)` | Fixed two-item composed display with icon metadata. |
| `formatCalendarStateSummary(state)` | The composed display as plain text. |
| `getYearOverview(year)` | Every selected observance for a year, sorted by observed date. |
| `buildYearObservances(year)` | The same observances in engine order. |
| `buildPeriods(year)` | Liturgical and devotional periods that start in a year. |
| `isSupportedCalendarDate(value)` | Whether a value is a real ISO date within 2000–2100. |
| `todayInTimeZone(timeZone)` | Today's civil date in an IANA time zone. |
| `gregorianEasterSunday`, `firstSundayOfAdvent`, `baptismOfTheLord`, `holyFamily` | Computus helpers for Gregorian years 1583–4099. |
| `getObservanceDisplayIcon`, `getPeriodDisplayIcon` | Semantic Christicons ids for observances and periods. |
| `CALENDAR_DISPLAY_MAX_ITEMS`, `MIN_SUPPORTED_YEAR`, `MAX_SUPPORTED_YEAR` | Constants: 2, 2000 and 2100. |

Dates outside 2000–2100, and values that are not real ISO dates, throw a `RangeError`.

## Observance statuses

- `observed` — observed on its nominal date.
- `commemoration-eligible` — may be commemorated on a privileged weekday while the seasonal weekday retains precedence.
- `transferred` — observed on another date; `transferReason` explains why.
- `impeded` — not observed this year; `impededBy` names the day or celebration that takes precedence.

## Scope

- Supported civil years: **2000–2100**.
- Uses universal Roman dates for Epiphany, Ascension and Corpus Christi.
- Models a curated observance set rather than a complete General Roman Calendar or local proper calendar.
- Models Christmas Time, Lent, Holy Week, the Sacred Paschal Triduum, Easter Time and Advent.
- Models St Michael’s Lent separately as a devotional period.
- Ordinary Time is intentionally not modelled.
- `commemoration-eligible` means a memorial may be commemorated while the privileged seasonal weekday retains liturgical precedence.
- The composed display is fixed at two items. Impeded nominal celebrations may use an available slot after primary observances and active periods; this is presentation-only and does not make them primary or observed.

See the repository README and `docs/SOURCES.md` for the full scope, sources and rule limitations.

## Licence

MIT. See `LICENSE`.
