'use client'

import { useMemo, useState } from 'react'

import {
  buildPeriods,
  getCatholicCalendarState,
  getObservanceDisplayIcon,
  getPeriodDisplayIcon,
  getYearOverview,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@/lib/catholic-calendar'
import CalendarIcon from './calendar-icon'

// Fixed month names keep server and browser output identical; ICU versions
// disagree on en-GB short months ("Sep" or "Sept").
const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function formatShortDate(value: string) {
  const [, month, day] = value.split('-')
  return `${day} ${SHORT_MONTHS[Number(month) - 1]}`
}

function formatPeriodDate(value: string) {
  return `${formatShortDate(value)} ${value.slice(0, 4)}`
}

function iconLabel(icon: string) {
  return `${icon.replace(/-\d+$/, '').replaceAll('-', ' ')} icon`
}

function titleCase(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function statusLabel(status: string) {
  return status === 'commemoration-eligible' ? 'Commemorated' : titleCase(status)
}

export default function YearOverview({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear)
  const entries = useMemo(() => getYearOverview(year), [year])
  // Include periods carried over from the previous year, such as the January
  // part of Christmas Time, which buildPeriods(year) lists under their start year.
  const periods = useMemo(() => {
    const yearStart = `${year}-01-01`
    const carriedOver = getCatholicCalendarState(yearStart).liturgicalPeriods.filter(
      (period) => period.startDate < yearStart
    )
    return [...carriedOver, ...buildPeriods(year)].sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    )
  }, [year])
  const isFirstYear = year === MIN_SUPPORTED_YEAR
  const isLastYear = year === MAX_SUPPORTED_YEAR
  const isCurrentYear = year === initialYear

  return (
    <section className="year-overview" aria-labelledby="year-overview-title">
      <div className="section-heading overview-heading">
        <div>
          <p className="eyebrow">Visual QA</p>
          <h2 id="year-overview-title">Year overview</h2>
          <p className="section-intro">
            Review the modelled periods, curated celebrations and liturgical-rank
            semantics for the selected year.
          </p>
        </div>
        <div className="year-control" role="group" aria-label="Year pagination">
          <span>Year</span>
          <div className="year-pagination">
            <button
              type="button"
              aria-disabled={isFirstYear}
              onClick={() => {
                if (!isFirstYear) setYear((value) => value - 1)
              }}
              aria-label="Previous year"
            >
              <span aria-hidden="true">←</span>
            </button>
            <strong aria-live="polite" aria-atomic="true">
              {year}
            </strong>
            <button
              type="button"
              aria-disabled={isLastYear}
              onClick={() => {
                if (!isLastYear) setYear((value) => value + 1)
              }}
              aria-label="Next year"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <button
            className="year-current-button"
            type="button"
            aria-disabled={isCurrentYear}
            onClick={() => {
              if (!isCurrentYear) setYear(initialYear)
            }}
          >
            <svg
              aria-hidden="true"
              className="year-current-icon"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 7v5h5M5.3 11A7 7 0 1 1 7 17.7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            <span>Current year</span>
          </button>
        </div>
      </div>

      <section className="year-subsection" aria-labelledby="period-overview-title">
        <div className="year-subsection-heading">
          <div>
            <p className="eyebrow">Periods</p>
            <h3 id="period-overview-title">Periods in this model</h3>
          </div>
          <p>
            These are the liturgical and devotional periods currently exposed by the
            calendar engine for the selected year. Periods that cross the turn of
            the year appear in both years.
          </p>
        </div>

        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-labelledby="period-overview-title"
        >
          <table className="period-table">
            <caption className="sr-only">Periods in {year}</caption>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Period</th>
                <th>Kind</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={`${period.id}-${period.startDate}`}>
                  <td className="year-icon-cell">
                    <CalendarIcon
                      className="year-overview-icon"
                      icon={getPeriodDisplayIcon(period.id)}
                    />
                    <span className="sr-only">
                      {iconLabel(getPeriodDisplayIcon(period.id))}
                    </span>
                  </td>
                  <td>
                    <strong>{period.name}</strong>
                  </td>
                  <td>
                    <span className={`period-pill is-${period.kind}`}>
                      {titleCase(period.kind)}
                    </span>
                  </td>
                  <td>{formatPeriodDate(period.startDate)}</td>
                  <td>{formatPeriodDate(period.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="year-subsection-note">
          <CalendarIcon
            className="year-subsection-note-icon"
            icon="church-1"
          />
          <span>
            Ordinary Time is intentionally not modelled in this curated implementation.
          </span>
        </p>
      </section>

      <section className="year-subsection" aria-labelledby="celebrations-overview-title">
        <div className="year-subsection-heading">
          <div>
            <p className="eyebrow">Celebrations</p>
            <h3 id="celebrations-overview-title">Celebrations in this model</h3>
          </div>
          <p>
            The curated observances for the selected year, including transferred,
            commemorated and impeded entries.
          </p>
        </div>

        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-labelledby="celebrations-overview-title"
        >
          <table>
          <caption className="sr-only">Celebrations in {year}</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Icon</th>
              <th>Celebration</th>
              <th>Rank</th>
              <th>Status</th>
              <th>Nominal / reason</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(({ date, observance }) => (
              <tr key={`${observance.id}-${date}`}>
                <td>{formatShortDate(date)}</td>
                <td className="year-icon-cell">
                  <CalendarIcon
                    className="year-overview-icon"
                    icon={getObservanceDisplayIcon(observance)}
                  />
                  <span className="sr-only">
                    {iconLabel(getObservanceDisplayIcon(observance))}
                  </span>
                </td>
                <td>
                  <strong>{observance.name}</strong>
                  <span className="celebration-translation" lang="es">
                    {observance.nameEs}
                  </span>
                </td>
                <td>
                  <span className={`rank-pill is-${observance.rank}`}>
                    {titleCase(observance.rank)}
                  </span>
                </td>
                <td>
                  <span className={`status-pill is-${observance.status}`}>
                    {statusLabel(observance.status)}
                  </span>
                </td>
                <td>
                  {observance.status === 'impeded' && observance.impededBy ? (
                    <span className="nominal-reason">
                      Impeded by {observance.impededBy}
                    </span>
                  ) : observance.nominalDate === date ? (
                    '—'
                  ) : (
                    formatShortDate(observance.nominalDate)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </section>

      <aside className="rank-guide year-subsection" aria-labelledby="rank-guide-title">
        <div className="year-subsection-heading">
          <div>
            <p className="eyebrow">Rank</p>
            <h3 id="rank-guide-title">How to read liturgical rank</h3>
          </div>
        </div>
        <p className="rank-guide-copy">
          Rank describes a celebration&apos;s liturgical classification, not its spiritual
          importance. Actual precedence also depends on the season and date, so rank alone
          does not determine what is observed.
        </p>
        <div className="rank-guide-items">
          <div className="rank-guide-item">
            <span className="rank-pill is-principal-day">Principal day</span>
            <span>Highest seasonal days in this curated model.</span>
          </div>
          <div className="rank-guide-item">
            <span className="rank-pill is-solemnity">Solemnity</span>
            <span>Major universal celebration.</span>
          </div>
          <div className="rank-guide-item">
            <span className="rank-pill is-feast">Feast</span>
            <span>Higher-ranked celebration below solemnities.</span>
          </div>
          <div className="rank-guide-item">
            <span className="rank-pill is-memorial">Memorial</span>
            <span>Normally obligatory when the calendar permits.</span>
          </div>
          <div className="rank-guide-item">
            <span className="rank-pill is-optional-memorial">Optional Memorial</span>
            <span>May be chosen when the calendar permits.</span>
          </div>
          <div className="rank-guide-item">
            <span className="rank-pill is-commemoration">Commemoration</span>
            <span>Retained for special cases such as All Souls.</span>
          </div>
        </div>
      </aside>
    </section>
  )
}
