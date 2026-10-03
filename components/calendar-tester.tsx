'use client'

import { useMemo, useState } from 'react'

import {
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@/lib/catholic-calendar'
import type { CalendarObservance } from '@/lib/catholic-calendar'
import CalendarDisplay from './calendar-display'

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
  if (observance.status === 'observed' || observance.status === 'impeded') return null

  const label =
    observance.status === 'transferred'
      ? 'Transferred'
      : observance.status === 'commemorated'
        ? 'Commemorated'
        : 'Impeded'

  return (
    <div className={`rule-callout is-${observance.status}`}>
      <strong>{label}</strong>
      <span>
        {observance.status === 'commemorated' ? 'Date' : 'Nominal date'}:{' '}
        {formatDate(observance.nominalDate)}
        {observance.status !== 'commemorated' && observance.observedDate
          ? ` · Observed: ${formatDate(observance.observedDate)}`
          : ''}
      </span>
      {observance.transferReason ? <span>{observance.transferReason}</span> : null}
      {observance.commemorationReason ? (
        <span>{observance.commemorationReason}</span>
      ) : null}
      {observance.impededBy ? <span>Impeded by: {observance.impededBy}.</span> : null}
    </div>
  )
}

export default function CalendarTester({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate)
  const [dateInput, setDateInput] = useState(initialDate)
  const [maxDisplayItems, setMaxDisplayItems] = useState<2 | 3>(2)
  const state = useMemo(() => getCatholicCalendarState(date), [date])

  const commitDate = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) return

    const year = Number(match[1])
    if (year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR) return

    const parsed = new Date(`${value}T00:00:00Z`)
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value
    ) {
      return
    }

    setDate(value)
  }

  const setCommittedDate = (value: string) => {
    setDateInput(value)
    setDate(value)
  }

  const visibleNominalExceptions = state.nominalObservances.filter(
    (event) => event.status === 'transferred'
  )
  const displaySummary = useMemo(
    () =>
      getCalendarDisplaySummary(state, {
        maxItems: maxDisplayItems,
      }),
    [maxDisplayItems, state]
  )

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
              onClick={() => setCommittedDate(shiftDate(date, -1))}
            >
              ←
              <span className="sr-only">Previous day</span>
            </button>
            <input
              id="calendar-date"
              type="date"
              min={`${MIN_SUPPORTED_YEAR}-01-01`}
              max={`${MAX_SUPPORTED_YEAR}-12-31`}
              value={dateInput}
              onChange={(event) => {
                const value = event.target.value
                setDateInput(value)
                commitDate(value)
              }}
              onBlur={() => {
                if (dateInput !== date) setDateInput(date)
              }}
            />
            <button
              type="button"
              disabled={date === `${MAX_SUPPORTED_YEAR}-12-31`}
              onClick={() => setCommittedDate(shiftDate(date, 1))}
            >
              →
              <span className="sr-only">Next day</span>
            </button>
          </div>
          <button
            className="today-button"
            type="button"
            onClick={() => setCommittedDate(initialDate)}
          >
            <svg
              aria-hidden="true"
              className="today-button-icon"
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
            <span>Return to today</span>
          </button>
        </div>
      </div>

      <div className="display-config" aria-label="Composed display configuration">
        <div className="display-config-heading">
          <strong>Display configuration</strong>
          <span>Composed display only · cards remain complete</span>
          <span className="display-config-date">
            Selected date <strong>{formatDate(date)}</strong>
          </span>
        </div>

        <label className="display-config-field" htmlFor="display-max-items">
          <span>Maximum items</span>
          <select
            id="display-max-items"
            value={maxDisplayItems}
            onChange={(event) =>
              setMaxDisplayItems(Number(event.target.value) as 2 | 3)
            }
          >
            <option value={2}>2 items</option>
            <option value={3}>3 items</option>
          </select>
        </label>

      </div>

      <blockquote className="state-quotation">
        <footer>Composed calendar display</footer>
        <CalendarDisplay items={displaySummary.items} />
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
              {state.primaryObservance.status === 'commemorated' ? (
                <span className="state-chip commemorated">Commemorated</span>
              ) : null}
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
