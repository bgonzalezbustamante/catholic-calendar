'use client'

import { useMemo, useState } from 'react'

import {
  getYearOverview,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@/lib/catholic-calendar'

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function titleCase(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function YearOverview({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear)
  const entries = useMemo(() => getYearOverview(year), [year])

  return (
    <section className="year-overview" aria-labelledby="year-overview-title">
      <div className="section-heading overview-heading">
        <div>
          <p className="eyebrow">Visual QA</p>
          <h2 id="year-overview-title">Year overview</h2>
          <p className="section-intro">
            Browse the curated observance set chronologically. Transfers use their observed date;
            impeded entries remain visible on their nominal date, while eligible memorials in privileged weekdays are marked as commemorated.
          </p>
        </div>
        <div className="year-control" aria-label="Year pagination">
          <span>Year</span>
          <div className="year-pagination">
            <button
              type="button"
              disabled={year === MIN_SUPPORTED_YEAR}
              onClick={() => setYear((value) => Math.max(MIN_SUPPORTED_YEAR, value - 1))}
              aria-label="Previous year"
            >
              ←
            </button>
            <strong>{year}</strong>
            <button
              type="button"
              disabled={year === MAX_SUPPORTED_YEAR}
              onClick={() => setYear((value) => Math.min(MAX_SUPPORTED_YEAR, value + 1))}
              aria-label="Next year"
            >
              →
            </button>
          </div>
          <button
            className="year-current-button"
            type="button"
            disabled={year === initialYear}
            onClick={() => setYear(initialYear)}
          >
            Current year
          </button>
        </div>
      </div>

      <div className="table-scroll" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
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
                    {titleCase(observance.status)}
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

      <aside className="rank-guide" aria-labelledby="rank-guide-title">
        <div>
          <p className="eyebrow">Rank</p>
          <h3 id="rank-guide-title">How to read liturgical rank</h3>
        </div>
        <p>
          Rank describes a celebration&apos;s liturgical classification, not its spiritual
          importance. In this curated model,{' '}
          <span className="rank-pill is-principal-day">Principal day</span> marks the highest
          seasonal days; <span className="rank-pill is-solemnity">Solemnity</span> and{' '}
          <span className="rank-pill is-feast">Feast</span> are higher celebrations;{' '}
          <span className="rank-pill is-memorial">Memorial</span> is normally obligatory; and{' '}
          <span className="rank-pill is-optional-memorial">Optional Memorial</span> may be
          chosen when the calendar permits.{' '}
          <span className="rank-pill is-commemoration">Commemoration</span> is retained for
          special cases such as All Souls. Actual precedence also depends on the season and
          the date, so rank alone does not determine what is observed.
        </p>
      </aside>
    </section>
  )
}
