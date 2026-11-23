import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
}

// Root 404 for unmatched URLs. The layout follows the owner's other sites; the
// penguin is the owner's artwork (CC BY-NC 4.0), see THIRD_PARTY_NOTICES.md.
export default function NotFound() {
  return (
    <main className="not-found-section">
      <div className="shell not-found-layout">
        <div className="not-found-copy">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="not-found-lead">
            The requested page does not exist or is no longer available.
          </p>
          <Link className="button" href="/">
            Back to the calendar
          </Link>
        </div>

        <div className="not-found-illustration">
          <Image
            src="/errors/404_penguin.webp"
            alt="Penguin with a magnifying glass next to a pile of books"
            width={960}
            height={960}
            sizes="(max-width: 760px) 72vw, 44vw"
            priority
            unoptimized
          />
        </div>
      </div>
    </main>
  )
}
