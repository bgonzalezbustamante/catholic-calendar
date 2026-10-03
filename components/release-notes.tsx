import { currentRelease } from '@/lib/releases'

export default function ReleaseNotes() {
  return (
    <section className="release-notes" aria-labelledby="release-notes-title">
      <div className="section-heading">
        <p className="eyebrow">Release notes</p>
        <h2 id="release-notes-title">{currentRelease.codename}</h2>
      </div>
      <article className="release-card">
        <div className="release-heading">
          <strong>{currentRelease.version}</strong>
          <span className="release-tag">{currentRelease.status}</span>
          <span className="release-date">{currentRelease.releasedOn}</span>
        </div>
        <p className="release-summary">{currentRelease.summary}</p>
        <div className="release-sections">
          {currentRelease.sections.map((section) => (
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
      </article>
    </section>
  )
}
