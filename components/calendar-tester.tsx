'use client'

import { useMemo, useState } from 'react'

import {
  formatCalendarStateSummary,
  getCatholicCalendarState,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@/lib/catholic-calendar'
import type { CalendarObservance } from '@/lib/catholic-calendar'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function titleCase(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function TransferDetails({ observance }: { observance: CalendarObservance }) {
  if (observance.status === 'observed') return null

  return (
    <div className={`rule-callout is-${observance.status}`}>
      <strong>{observance.status === 'transferred' ? 'Transferred' : 'Impeded'}</strong>
      <span>
        Nominal date: {formatDate(observance.nominalDate)}
        {observance.observedDate
          ? ` · Observed: ${formatDate(observance.observedDate)}`
          : ''}
      </span>
      {observance.transferReason ? <span>{observance.transferReason}</span> : null}
      {observance.impededBy ? <span>Impeded by: {observance.impededBy}.</span> : null}
    </div>
  )
}

export default function CalendarTester({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate)
  const state = useMemo(() => getCatholicCalendarState(date), [date])

  const visibleNominalExceptions = state.nominalObservances.filter(
    (event) => event.status !== 'observed'
  )
  const displaySummary = formatCalendarStateSummary(state, {
    maxItems: 2,
    preferredPeriodIds: ['lent', 'st-michaels-lent'],
  })

  return (
    <section className="tester" aria-labelledby="tester-title">
      <div className="section-heading tester-heading">
        <div>
          <p className="eyebrow">Interactive test</p>
          <h2 id="tester-title">Calendar state tester</h2>
          <p className="section-intro">
            Select any supported civil date to inspect the three output layers,
            transfer decisions and the underlying movable-date calculations.
          </p>
        </div>
        <div className="date-control">
          <label htmlFor="calendar-date">Date</label>
          <div className="date-control-row">
            <button
              type="button"
              disabled={date === `${MIN_SUPPORTED_YEAR}-01-01`}
              onClick={() => setDate(shiftDate(date, -1))}
            >
              ←
              <span className="sr-only">Previous day</span>
            </button>
            <input
              id="calendar-date"
              type="date"
              min={`${MIN_SUPPORTED_YEAR}-01-01`}
              max={`${MAX_SUPPORTED_YEAR}-12-31`}
              value={date}
              onChange={(event) => {
                if (event.target.value) setDate(event.target.value)
              }}
            />
            <button
              type="button"
              disabled={date === `${MAX_SUPPORTED_YEAR}-12-31`}
              onClick={() => setDate(shiftDate(date, 1))}
            >
              →
              <span className="sr-only">Next day</span>
            </button>
          </div>
          <button className="today-button" type="button" onClick={() => setDate(initialDate)}>
            Return to today
          </button>
        </div>
      </div>

      <div className="selected-date-bar">
        <span>Selected date</span>
        <strong>{formatDate(date)}</strong>
      </div>

      <blockquote className="state-quotation">
        <p>{displaySummary}</p>
        <footer>Composed calendar display</footer>
      </blockquote>

      <div className="layer-grid">
        <article className="layer-card">
          <span className="layer-number">01</span>
          <p className="eyebrow">Primary observance</p>
          <h3>{state.primaryObservance?.name ?? 'No selected discrete observance'}</h3>
          {state.primaryObservance ? (
            <div className="chip-row">
              <span className="state-chip">{titleCase(state.primaryObservance.rank)}</span>
              <span className="state-chip muted">Precedence {state.primaryObservance.precedence}</span>
            </div>
          ) : (
            <p className="card-copy">The period and countdown layers remain active independently.</p>
          )}
        </article>

        <article className="layer-card">
          <span className="layer-number">02</span>
          <p className="eyebrow">Active periods</p>
          <h3>
            {[...state.liturgicalPeriods, ...state.devotionalPeriods].length > 0
              ? [...state.liturgicalPeriods, ...state.devotionalPeriods]
                  .map((period) => period.name)
                  .join(' · ')
              : 'No selected period'}
          </h3>
          <div className="chip-row">
            {state.liturgicalPeriods.map((period) => (
              <span className="state-chip" key={period.id}>
                Liturgical
              </span>
            ))}
            {state.devotionalPeriods.map((period) => (
              <span className="state-chip devotional" key={period.id}>
                Devotional
              </span>
            ))}
          </div>
        </article>

        <article className="layer-card">
          <span className="layer-number">03</span>
          <p className="eyebrow">Countdown</p>
          {state.countdown ? (
            <>
              <h3>{state.countdown.daysUntil} day{state.countdown.daysUntil === 1 ? '' : 's'} until {state.countdown.observance.name}</h3>
              <p className="card-copy">Observed on {formatDate(state.countdown.date)}.</p>
            </>
          ) : (
            <>
              <h3>Suppressed today</h3>
              <p className="card-copy">
                A selected discrete observance is active. The engine still computes the next one for diagnostics.
              </p>
            </>
          )}
        </article>
      </div>

      {visibleNominalExceptions.length > 0 ? (
        <div className="exceptions" aria-label="Nominal observance exceptions">
          {visibleNominalExceptions.map((event) => (
            <TransferDetails observance={event} key={event.id} />
          ))}
        </div>
      ) : null}

      <details className="calculation-details">
        <summary>Calculation details</summary>
        <div className="details-grid">
          <div>
            <span>Easter Sunday</span>
            <strong>{formatDate(state.calculations.easterSunday)}</strong>
          </div>
          <div>
            <span>First Sunday of Advent</span>
            <strong>{formatDate(state.calculations.firstSundayOfAdvent)}</strong>
          </div>
          <div>
            <span>Next observed celebration</span>
            <strong>
              {state.nextObservance
                ? `${state.nextObservance.observance.name} · ${formatDate(state.nextObservance.date)}`
                : 'None within supported range'}
            </strong>
          </div>
          <div>
            <span>Nominal selections today</span>
            <strong>{state.nominalObservances.length}</strong>
          </div>
        </div>

        {state.observedObservances.map((event) => (
          <TransferDetails observance={event} key={`observed-${event.id}`} />
        ))}
      </details>
    </section>
  )
}
