# Release checklist

Each release has a version and a codename, such as `v0.1.0-beta.2` “Ivory Delta”. Development happens on a branch with an open pull request; production and npm stay untouched until the release is confirmed.

## During development

- Keep `[skip netlify]` in the pull request title and in commit messages so Netlify builds no Deploy Previews.
- Keep the release entry in `lib/releases.ts` at `status: 'In development'` with no `releasedOn`.
- Record changes under `## [Unreleased]` in `CHANGELOG.md`.

## Before merging

1. Run the full validation suite and confirm CI passes on Node 22 and 24:

   ```bash
   npm run check
   npm run check:package
   npm run build
   npm audit --omit=dev
   ```

2. Set the release date (ISO, `YYYY-MM-DD`) in three places:
   - `lib/releases.ts`: `status: 'Released'` and `releasedOn`;
   - `CHANGELOG.md`: rename `## [Unreleased]` to `## [x.y.z] — Codename — YYYY-MM-DD` and update the compare links at the end;
   - `README.md`: the “Current published release” line, removing the “In development” line.

   `tests/releases.test.ts` fails if the release date and the CHANGELOG heading disagree.

3. Update the README sentence on npm channels if the channel changes.
4. **Remove `[skip netlify]` from the pull request title**, or edit the merge commit message. GitHub uses the title in the merge commit, and Netlify would otherwise skip the production deploy.

## After merging

1. Tag the merge commit and create a GitHub pre-release:

   ```bash
   git tag -a v0.1.0-beta.2 -m "v0.1.0-beta.2 Ivory Delta"
   git push origin v0.1.0-beta.2
   gh release create v0.1.0-beta.2 --prerelease --title "v0.1.0-beta.2 “Ivory Delta”" --notes-file <notes>
   ```

2. Publish the package from `packages/catholic-calendar/`. `prepack` rebuilds `dist/` first, and `publishConfig.tag` publishes to the `beta` channel:

   ```bash
   cd packages/catholic-calendar
   npm publish
   ```

3. Point `latest` at the new version, so a plain `npm install` does not resolve to an older prerelease:

   ```bash
   npm dist-tag add @bgonzalezbustamante/catholic-calendar@0.1.0-beta.2 latest
   npm view @bgonzalezbustamante/catholic-calendar dist-tags
   ```

4. Check the production site after Netlify deploys.

## Optional

- Publish from GitHub Actions with npm trusted publishing to add provenance attestations.
