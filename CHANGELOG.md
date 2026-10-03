# Changelog

## [Unreleased]

### Changed

- Holy Week now uses the calvary Christicon; Year Overview now uses a consistent subsection heading pattern for celebrations, periods and rank guidance, with safer pill spacing/wrapping in the rank explanation.
- Corrected celebration icons: Baptism of the Lord → dove, Ash Wednesday → calvary, Holy Thursday → bread, Good Friday → calvary, Saints Peter and Paul → Saint Peter, and All Souls → tombstone.
- Added a second Year Overview table for the modelled liturgical/devotional periods, including semantic icons, period kind, annual boundaries and an explicit note that Ordinary Time is not modelled.
- Fixed Year Overview icon visibility by giving the shared masked-icon element an explicit inline-block box outside flex layouts.
- Nativity of Saint John the Baptist uses the dove Christicon; Year Overview displays each celebration's semantic icon.
- Primary observance, Active periods and Countdown now use the same colour-coded pill system as Year Overview, including rank/status, period-kind and upcoming-state pills.
- Added regression coverage clarifying that Saint Benedict is displayed normally on 11 July 2026 but is impeded by Sunday on 11 July 2027 and therefore appears only in Year Overview that year.
- Saints Michael, Gabriel and Raphael, Archangels now use the angel Christicon as an explicit display mapping.
- Confined impeded diagnostic callouts to Year Overview rather than the Calendar state tester, and removed raw precedence-number pills from the Primary observance card.
- Current year now mirrors the Return to today action with a coral treatment, small return icon and right alignment beneath Year Overview pagination.
- Refined the Christicons footer acknowledgement with the existing bible-1 Christicon and a new-tab link, reused rank pills inside the rank guide, right-aligned the tester Date label, and moved the selected date into Display configuration.
- Rendered liturgical ranks as colour-coded pill labels in Year Overview using the existing visual palette, and added a discreet Christicons acknowledgement in the site footer.
- Saint Bernadette now uses the rosary Christicon and Saint Benedict uses the cross Christicon as explicit display mappings; the Flaticon favicon notice now credits Magnific with the supplied source link.
- Added Saint Bernadette Soubirous on 16 April as a curated optional memorial and Saint Benedict of Nursia on 11 July as a universal memorial.
- Added the Transfiguration of the Lord on 6 August and the Holy Family of Jesus, Mary and Joseph within the Christmas Octave after auditing major universal feasts missing from the curated set.
- Restyled Return to today as a right-aligned coral action with a small return icon, renamed Year Overview's final column to Nominal / reason, and added a concise liturgical-rank guide beneath the table.
- Added the Presentation of the Blessed Virgin Mary on 21 November and Our Lady of Loreto on 10 December (effective from 2019), both using the Marian rosary icon semantics.
- Documented the Flaticon-sourced rosary favicon in third-party notices.
- Moved impediment reasons into the Year Overview Nominal date column, widened the hero copy, strengthened the composed-display quotation marks, and moved its label to the top of the card.
- Added a `commemorated` status for memorials permitted on privileged weekdays, so dates such as Our Lady of Lourdes on 11 February 2027 remain in the main calendar state instead of being incorrectly marked impeded.
- Hardened manual date entry against incomplete/out-of-range typed years, removed the decorative bubble from the three diagnostic cards, and replaced Year Overview's numeric year field with right-aligned previous/next year pagination.
- Added Saint Francis of Assisi on 4 October as a memorial in the General Roman Calendar baseline.
- Added explicit regression coverage for Our Lady of Lourdes on 11 February and corrected display icon mappings for the First Sunday of Advent (candle) and Christmas Time (star).
- The Annunciation now uses the rosary Christicon as an explicit display override while remaining categorised as a Lord observance in the calendar model.
- Marian observances and Marian countdown targets now use the rosary Christicon before the generic cross fallback.
- Added guaranteed icon fallback coverage to the composed display: unmapped observances/countdowns use the Christicons cross, while unmapped periods use church-1.
- Added semantic Christicons to the composed calendar display, normalised the curated SVG assets for themeable rendering, and exposed icon identifiers in package display items.
- Removed compact-display period prioritisation. The composed display now follows the engine's natural state order and only applies the selected two- or three-item truncation.
- Kept all three diagnostic cards independent from the composed-display limit and changed the tester limit choices to two or three items.
- Added Spanish celebration names to the calendar observance metadata and display them as lighter secondary labels in Year Overview.
- Added visible tester controls for the core composed-display length.
- Realigned the in-app Release Notes card with the Weekly Penguin Timeline pattern: eyebrow outside the card, version/codename heading and status pill inside, full-width summary, and two-column detail sections.
- Added a prominent composed calendar display preview above the three diagnostic cards and reduced the diagnostic card footprint.
- Simplified selected celebration labels to Divine Mercy Sunday, Corpus Christi, All Souls, Immaculate Conception, and Christmas.
- Marked Calm Bridge release notes as `In Development` without a release date.
- Added the npm lockfile, switched CI to `npm ci`, pinned npm 11.21.0 as the package manager, and generate Next.js route types before TypeScript checks.
- Stopped tracking generated `next-env.d.ts`; Next.js recreates it during type generation and builds.

### Security

- Explicitly deny the currently unnecessary `unrs-resolver` install script and fail installs when future dependency lifecycle scripts have not been reviewed.


All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and the project uses Semantic Versioning for its release line.

## [0.1.0-alpha.1] — Calm Bridge — In Development

### Added

- Standalone Next.js 16.3.8 proof-of-concept application using the visual identity established by Weekly Penguin Timeline.
- UI-agnostic TypeScript Catholic calendar engine under `lib/catholic-calendar/`.
- Gregorian Easter computus and derived Paschal-cycle dates.
- Derived First Sunday of Advent, Advent period and Christ the King date.
- Curated Roman Catholic observance set with Marian celebrations including Lourdes, Fatima, Mount Carmel and Guadalupe.
- Separate liturgical-period and Franciscan devotional-period layers, including St Michael’s Lent from 15 August through 29 September.
- Three-layer date state: primary observance, active periods and countdown to the next observed celebration when appropriate.
- Explicit nominal versus observed dates, transfer reasons and impediment metadata.
- Transfer handling for Saint Joseph, the Annunciation and the Immaculate Conception.
- Selected same-date solemnity collision resolution, including the Sacred Heart / Nativity of Saint John the Baptist pattern.
- Interactive date tester with computus and Advent diagnostics.
- Year overview for visual inspection of observed, transferred and impeded entries.
- Regression tests for known Easter dates, Advent, period overlaps, countdowns, transfers, impediments and the 2022 Sacred Heart collision.
- GitHub Actions CI for linting, type-checking, tests and production build.
- Source and rule documentation in `docs/SOURCES.md`.

### Notes

- The alpha follows universal Roman dates and deliberately does not implement national or diocesan transfers of Epiphany, Ascension or Corpus Christi.
- The engine supports civil dates from 2000 through 2100 and is intended for current/future application use rather than full historical calendar reconstruction.
- Period boundaries are date-level approximations; Holy Thursday and Easter Sunday intentionally expose overlapping contextual periods.
