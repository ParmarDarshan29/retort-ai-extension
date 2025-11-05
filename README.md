# retort.ai — Browser Extension

A lightweight Chrome/Edge extension that helps generate context-aware replies using OpenRouter (or other LLM providers). It extracts selected text or visible page content and sends it to an AI model to produce suggested replies you can copy to the clipboard.

This repo contains a small React popup, a background script that provides a context menu entry, and a content script to extract text from web pages.

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


## API key / Security

This extension provides an in-popup Settings UI where you can enter your OpenRouter API key. The key is saved to `chrome.storage.local` and used at runtime; it is no longer stored in source code.

Important: do not commit real API keys to version control. If you share the repository or publish it, rotate any keys you used for testing.


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

Darshan  Twisha
Akshat   Ishita

## License

This project does not include a license file in the repository by default. Add a LICENSE file if you want to publish under an open-source license.
