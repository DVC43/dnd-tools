# Fantasy Item Backstory Generator (Static / GitHub Pages)

A multi-file, **static** D&D / fantasy RPG **item backstory generator** designed to be hosted on **GitHub Pages**.

## Features
- Weighted tables with **tag & tone boosting**
- **Seedable** RNG for reproducible results
- Item controls: **type**, **tone**, **themes/tags**, **length**
- Toggles: include **curse/complication**, **plot hook**, **maker details**, **minor boon**
- **Lock** any section (name/origin/creator/purpose/event/hook/quirk/complication/boon) and reroll only the rest
- Buttons:
  - **Generate** (new result)
  - **Reroll unlocked** (keeps settings; changes only unlocked sections)
  - **Reroll (same seed)** (reconstructs output deterministically)
  - **Copy**
  - **Export Markdown** (Foundry-friendly)
  - **Export JSON**
- Collapsible **raw JSON** panel
- Saves last settings + output in **localStorage**

## Run locally
Just open `index.html` in a browser, or use any static server (recommended for local `fetch()`).
Examples:
- Python: `python -m http.server 8000`
- Node: `npx serve`

Then open: `http://localhost:8000`

## Host on GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Select **Deploy from branch**, choose your default branch and `/ (root)`
4. Visit the Pages URL

## Add / edit content
All generator content lives in `/data/*.json`.
- Add new entries with `text`, optional `tags`, `tone`, and `weight`.
- Add new tags in `tags.json` and they’ll appear in the UI.

## License
MIT (see LICENSE)
