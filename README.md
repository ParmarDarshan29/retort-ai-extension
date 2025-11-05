<p align="center">
	<img src="public/logo.png" alt="retortai logo" width="96" />
</p>

# retortai — Browser Extension

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A lightweight Chrome/Edge extension that helps generate context-aware replies using OpenRouter (or other LLM providers). It extracts selected text or visible page content and sends it to an AI model to produce suggested replies you can copy to the clipboard.

This repo contains a small React popup, a background script that provides a context menu entry, and a content script to extract text from web pages.

<p align="center">
	<img src="retortai.gif" alt="retortai demo" width="600" />
</p>

## Features

- Generate a reply from selected text or full page content
- Message mode (rewrite a message) and Prompt mode (free-form prompt)
- Tone selection (Polite, Friendly, Professional, etc.)
- Copy suggested reply to clipboard


## Prerequisites

- Node.js (18.x or later recommended)
- npm (comes with Node.js)
- A valid OpenRouter API key (or another compatible chat-completions provider)


## Quick setup (development)

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server (hot reload for the popup UI):

```powershell
npm run dev
```

Open `http://localhost:5173/public/popup.html` in a browser to preview the popup during development (or use the built `dist/` to test as an extension — see below).

## Clone & run (quick start)

If someone wants to run this extension locally, the simplest way is to clone the repository and build or run a dev preview:

1. Clone the repo and enter the folder:

```bash
git clone https://github.com/ParmarDarshan29/retort-ai-extension.git
cd retort-ai-extension
```

2. Install dependencies:

```bash
npm install
```

3a. Run a local dev server (hot reload for the popup UI):

```bash
npm run dev
# open the popup preview in your browser (Vite prints the exact localhost port)
# example: http://localhost:5173/popup.html
```

3b. Or build the production-ready extension (creates `dist/`):

```bash
npm run build
# zip the contents of dist and upload to a browser store or use Load unpacked in chrome://extensions
```

4. Load the built extension into Chrome/Edge (unpacked):

```text
- Open chrome://extensions (or edge://extensions)
- Enable Developer mode
- Click "Load unpacked" and select the repo's `dist/` folder
```

Notes:
- Vite may pick a different port if the default 5173 is in use — check the terminal for the actual URL.
- The popup UI stores your OpenRouter API key in `chrome.storage.local` (open the popup, click ⚙️ to add it).
- The Simple Browser preview (http://localhost:PORT/popup.html) is useful to test layout, but extension APIs like `chrome.*` are not available there.


## Build (produce extension files)

This project uses Vite. The build step produces a `dist/` folder that contains the extension manifest, popup HTML and assets, background and content scripts.

```powershell
npm run build
```

After a successful build, the `dist/` folder is ready to be loaded as an unpacked extension.


## Load into Chrome/Edge (unpacked)

1. Open Chrome (or Edge) and go to `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode** (toggle at top-right).
3. Click **Load unpacked** and select the `dist/` folder from this repository (e.g. `D:\retort-ai-extension\dist`).
4. The extension should appear in your toolbar. Click the icon to open the popup.

## Install from Releases (download extension.zip)

If we publish release artifacts on GitHub, you can download `extension.zip` from the Releases page and install it locally without using the Chrome Web Store:

1. Open this repository's Releases page: https://github.com/twi-exe/retort-ai-extension/releases
2. Download the `extension.zip` asset from the desired release.
3. Unzip the downloaded `extension.zip` to a folder.
4. In Chrome: open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the unzipped folder.

This is a convenient way to distribute builds to testers without publishing to the Chrome Web Store.


## API key / Security

This extension provides an in-popup Settings UI where you can enter your OpenRouter API key. The key is saved to `chrome.storage.local` and used at runtime; it is no longer stored in source code.

Important: do not commit real API keys to version control. If you share the repository or publish it, rotate any keys you used for testing.

### How to add your OpenRouter API key

1. Install or load the extension (see "Load into Chrome/Edge (unpacked)" above or install from Releases).
2. Click the extension icon in the toolbar to open the popup.
3. Click the gear (⚙️) button in the top-right of the popup to open Settings.
4. Paste your OpenRouter API key into the **OpenRouter API Key** field and click **Save**.
5. The extension stores the key in `chrome.storage.local` and will use it for API calls.

Notes:
- If you don't have an OpenRouter API key, sign up at https://openrouter.ai (or your chosen LLM provider) and create an API key.
- The popup will show a toast notification when the key is saved successfully.


## Troubleshooting

- If the popup shows a blank page or assets are missing, make sure you loaded the `dist/` folder (not the project root). The built popup lives at `dist/public/popup.html` and references compiled `/assets/*` files.
- On case-sensitive filesystems ensure content script filename casing matches the manifest (`contentScript.js`).
- If the AI call fails, open the popup devtools to see the fetch error and response body. Common causes: invalid key, model not allowed on plan, or network restrictions.


## Files of interest

- `src/popup/Popup.jsx` — React popup UI
- `src/api/openrouter.js` — small wrapper that calls OpenRouter; helpful to replace with a better key-loading flow
- `src/background.js` — context menu and popup opener
- `src/content/ContentScript.js` — page text extraction (copied to `public/contentScript.js` during build)
- `public/` — static assets copied into `dist/` by the build


## Development tips

- Use the browser extension inspector (chrome://extensions → Inspect views) to open popup devtools and debug runtime issues.
- Run `npm run lint` to check for JavaScript/React issues according to the repo ESLint configuration.

## Team

- -Darshan Parmar       -Twisha Patel
-Akshat Chhatriwala   -Ishita Akolkar

## License

This project is released under the MIT License — see the `LICENSE` file for details.

You can freely use, modify, and distribute this code under the terms of the MIT license.
