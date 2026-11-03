'use client'

export default function CalendarError({ reset }: { reset: () => void }) {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-inner">
          <p className="eyebrow">Something went wrong</p>
          <h1>Catholic Calendar</h1>
          <p className="hero-copy">
            The calendar could not be displayed for the selected date. Supported dates run
            from 1 January 2000 to 31 December 2100.
          </p>
          <button className="today-button" type="button" onClick={() => reset()}>
            Return to today
          </button>
        </div>
      </section>
    </main>
  )
}
