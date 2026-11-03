import CalendarTester from '@/components/calendar-tester'
import ReleaseNotes from '@/components/release-notes'
import YearOverview from '@/components/year-overview'
import { todayInTimeZone } from '@/lib/catholic-calendar'

const TIME_ZONE = 'Europe/Amsterdam'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const today = todayInTimeZone(TIME_ZONE)
  const year = Number(today.slice(0, 4))

  return (
    <main>
      <section className="hero">
        <div className="shell hero-inner">
          <p className="eyebrow">Proof of concept</p>
          <h1>Catholic Calendar</h1>
          <p className="hero-copy">
            A deterministic, package-ready calendar engine for a curated Roman Catholic
            observance set. It resolves movable dates, liturgical and devotional periods,
            transfers, impediments and countdowns without an external API.
          </p>
          <div className="rule-note" role="group" aria-label="Calendar model scope">
            <span>Model scope</span>
            <strong>Curated Roman calendar, with selected Marian observances and St Michael’s Lent</strong>
          </div>
        </div>
      </section>

      <div className="shell">
        <CalendarTester initialDate={today} timeZone={TIME_ZONE} />
        <YearOverview initialYear={year} />

        <section className="notes-grid" aria-labelledby="notes-title">
          <h2 className="sr-only" id="notes-title">
            Proof-of-concept notes
          </h2>
          <article>
            <p className="eyebrow">Three layers</p>
            <h3>Independent outputs</h3>
            <p>
              Primary celebration, active periods and countdown state are computed
              separately so Advent, Lent or St Michael’s Lent never hides a feast.
            </p>
          </article>
          <article>
            <p className="eyebrow">Transfers</p>
            <h3>Nominal ≠ observed</h3>
            <p>
              Transfer and impediment metadata stay explicit. The tester can therefore show
              what normally belongs to a date without mislabelling it as the observed liturgy.
            </p>
          </article>
          <article>
            <p className="eyebrow">Integration</p>
            <h3>Prepared for packaging</h3>
            <p>
              Everything under <code>lib/catholic-calendar</code> is UI-agnostic TypeScript,
              ready to extract later for the Academic Website, Research Dashboard or other apps.
            </p>
          </article>
        </section>

        <ReleaseNotes />
      </div>
    </main>
  )
}
