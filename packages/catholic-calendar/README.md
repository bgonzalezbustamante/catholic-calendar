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

The package exposes the same engine used by the demonstration application, including computus helpers, selected liturgical observances, customary observances, periods, calendar-state resolution, Year Overview data and compact display summaries.

## Scope

- Supported civil years: **2000–2100**.
- Uses universal Roman dates for Epiphany, Ascension and Corpus Christi.
- Models a curated observance set rather than a complete General Roman Calendar or local proper calendar.
- Exposes Shrove Tuesday as a derived customary observance, with Mardi Gras and Fat Tuesday as aliases, without assigning liturgical rank or precedence.
- Models Christmas Time, Lent, Holy Week, the Sacred Paschal Triduum, Easter Time and Advent.
- Models St Michael’s Lent separately as a devotional period.
- Ordinary Time is intentionally not modelled.
- `commemoration-eligible` means a memorial may be commemorated while the privileged seasonal weekday retains liturgical precedence.

See the repository README and `docs/SOURCES.md` for the full scope, sources and rule limitations.

## Licence

MIT. See `LICENSE`.
