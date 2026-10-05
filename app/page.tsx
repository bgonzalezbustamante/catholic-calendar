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
          <div className="rule-note" aria-label="Calendar model scope">
            <span>Model scope</span>
            <strong>Curated Roman calendar, with selected Marian observances and St Michael’s Lent</strong>
          </div>
        </div>
      </section>

      <div className="shell">
        <CalendarTester initialDate={today} />
        <YearOverview initialYear={year} />

        <section className="notes-grid" aria-label="Proof-of-concept notes">
          <article>
            <p className="eyebrow">Three layers</p>
            <h2>Independent outputs</h2>
            <p>
              Primary celebration, active periods and countdown state are computed
              separately so Advent, Lent or St Michael’s Lent never hides a feast.
            </p>
          </article>
          <article>
            <p className="eyebrow">Transfers</p>
            <h2>Nominal ≠ observed</h2>
            <p>
              Transfer and impediment metadata stay explicit. The tester can therefore show
              what normally belongs to a date without mislabelling it as the observed liturgy.
            </p>
          </article>
          <article>
            <p className="eyebrow">Integration</p>
            <h2>Prepared for packaging</h2>
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
