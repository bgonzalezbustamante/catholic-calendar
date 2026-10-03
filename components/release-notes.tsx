import { currentRelease } from '@/lib/releases'

export default function ReleaseNotes() {
  return (
    <section className="release-notes" aria-labelledby="release-notes-title">
      <p className="eyebrow">Release notes</p>
      <div className="release-card">
        <div className="release-heading">
          <h2 id="release-notes-title">
            {currentRelease.version} “{currentRelease.codename}”
          </h2>
          <span className="release-tag">{currentRelease.status}</span>
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
      </div>
    </section>
  )
}
