# Installing & distributing retort-ai-extension without Chrome Web Store

If you can't (or don't want to) pay the Chrome Web Store registration fee, here are practical ways to install and distribute the extension.

1) Local development & testing (Load unpacked)

- Build the extension:

```bash
npm ci
npm run package
```

- Unpack and load in Chrome:

1. Unzip `extension.zip` into a folder (or use `dist/` directly).
2. Open `chrome://extensions` in Chrome.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the folder from step 1.

Notes:
- This requires Developer mode enabled in each user's Chrome and is best for testing or small-scale manual installs.

2) Create a GitHub Release artifact (quick distribution)

- The repository includes a workflow `.github/workflows/create_release.yml` that builds and attaches `extension.zip` to a GitHub Release. You can run the workflow manually (Actions → Create Release Artifact → Run workflow) or trigger on push to `main`.
- Once the release is created, users can download `extension.zip` and follow the Load unpacked steps above.

3) Firefox Add-on (free publishing option)

- Mozilla Add-ons (AMO) usually does not charge a developer registration fee. You can publish a WebExtension for Firefox.
- Quick local testing with `web-ext` (no install required globally):

```bash
# Build the extension into dist/ (Vite already does this)
npm run build

# Build a firefox-compatible XPI in webext-artifacts/
npx web-ext build -s dist -a webext-artifacts

# Run it in a temporary Firefox profile for testing
npx web-ext run -s dist
```

- If web-ext raises manifest issues, check compatibility (some Chrome MV3 APIs may not be available in Firefox yet). See the Firefox extension docs for migration notes.

4) Enterprise / Admin-deployed installs

- If your organization uses Google Workspace, admins can push extensions to users without using the public Web Store. This is suitable for company-wide distribution but requires admin privileges.

5) When you are ready to publish to Chrome Web Store

- You will need a developer account (one-time registration fee) and then the workflow we originally added can publish programmatically using GitHub Secrets. See `docs/CHROME_WEBSTORE_CI.md` for details.

If you'd like, I can:
- Add an automated job to create GitHub Releases on tags only (instead of every push),
- Add a small script to verify Firefox compatibility and adjust manifest fields,
- Or change the CI to only create a Release artifact when a Release is created.
