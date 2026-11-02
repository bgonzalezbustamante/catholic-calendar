'use client'

import { useState } from 'react'

import { releases } from '@/lib/releases'

function formatReleaseDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export default function ReleaseNotes() {
  const [pageIndex, setPageIndex] = useState(0)
  const release = releases[pageIndex]

  if (!release) return null

  const isNewest = pageIndex === 0
  const isOldest = pageIndex === releases.length - 1

  return (
    <section className="release-notes" aria-labelledby="release-notes-title">
      <h2 className="eyebrow" id="release-notes-title">
        Release notes
      </h2>
      <div className="release-card" aria-live="polite">
        <div className="release-heading">
          <h3>
            {release.version} “{release.codename}”
          </h3>
          <span
            className={[
              'release-tag',
              release.status === 'In development' ? 'is-in-development' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {release.status}
          </span>
          {release.releasedOn ? (
            <span className="release-tag">
              <span className="sr-only">Released on </span>
              <time dateTime={release.releasedOn}>
                {formatReleaseDate(release.releasedOn)}
              </time>
            </span>
          ) : null}
        </div>

        <p className="release-summary">{release.summary}</p>

        <div className="release-sections">
          {release.sections.map((section) => (
            <div key={section.title}>
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {releases.length > 1 ? (
        <nav
          className="release-pagination"
          aria-label="Release notes pagination"
        >
          <button
            className="release-page-nav"
            type="button"
            onClick={() => {
              if (!isNewest) setPageIndex((index) => index - 1)
            }}
            aria-disabled={isNewest}
          >
            <span aria-hidden="true">← </span>Newer
          </button>

          <div className="release-page-numbers">
            {releases.map((item, index) => (
              <button
                className={[
                  'release-page-number',
                  index === pageIndex ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="button"
                key={item.version}
                onClick={() => setPageIndex(index)}
                aria-current={index === pageIndex ? 'page' : undefined}
              >
                {index + 1}
                <span className="sr-only">
                  : {item.version} {item.codename}
                </span>
              </button>
            ))}
          </div>

          <button
            className="release-page-nav"
            type="button"
            onClick={() => {
              if (!isOldest) setPageIndex((index) => index + 1)
            }}
            aria-disabled={isOldest}
          >
            Older<span aria-hidden="true"> →</span>
          </button>
        </nav>
      ) : null}
    </section>
  )
}
