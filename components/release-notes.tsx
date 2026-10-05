'use client'

import { useState } from 'react'

import { releases } from '@/lib/releases'

export default function ReleaseNotes() {
  const [pageIndex, setPageIndex] = useState(0)
  const release = releases[pageIndex]

  if (!release) return null

  return (
    <section className="release-notes" aria-labelledby="release-notes-title">
      <p className="eyebrow">Release notes</p>
      <div className="release-card">
        <div className="release-heading">
          <h2 id="release-notes-title">
            {release.version} “{release.codename}”
          </h2>
          <span className="release-tag">{release.status}</span>
        </div>

        <p className="release-summary">{release.summary}</p>

        <div className="release-sections">
          {release.sections.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
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
            onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
            disabled={pageIndex === 0}
          >
            Previous
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
                aria-label={`Show release ${item.version} ${item.codename}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="release-page-nav"
            type="button"
            onClick={() =>
              setPageIndex((index) =>
                Math.min(releases.length - 1, index + 1)
              )
            }
            disabled={pageIndex === releases.length - 1}
          >
            Next
          </button>
        </nav>
      ) : null}
    </section>
  )
}
