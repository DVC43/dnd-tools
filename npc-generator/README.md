# High Fantasy NPC Generator (GitHub Pages)

A lightweight, **static** NPC generator for high fantasy / D&D-style campaigns:
- **Race + Class**
- **Race + Profession**
- **Monstrous** (alignment + INT come from the CSV)

Everything runs client-side (no server). Output is rendered as **HTML** cards so you can copy/paste into notes, VTTs, or docs.

## Deploy to GitHub Pages

1. Create a new GitHub repo (or use an existing one).
2. Copy this folder’s contents into the repo root.
3. In GitHub: **Settings → Pages**
   - **Build and deployment:** “Deploy from a branch”
   - Branch: `main` (or `master`) / Folder: `/root`
4. Visit the Pages URL GitHub gives you.

## Editing / expanding generator data

All editable content is in `/data/`:

- `races.json` — race list (and which name pool they use)
- `classes.json` — class list
- `professions_catalog.json` — profession catalog (group → category → profession + details)
- `names.json` — name pools + alignment-based epithets
- `fragments.json` — worldbuilding fragments used by templates
- `alignment_pools.json` — the main alignment-driven template pools (**equal-length pools per alignment**)
- `monstrous_npcs.csv` — creatures + stats; Monstrous NPCs keep **Align.** and **INT** from here

### Template placeholders

Alignment pool strings can use placeholders like:

- `{city}`, `{region}`, `{faction}`, `{order}`, `{deity}`
- `{artifact}`, `{threats}`, `{vice}`, `{virtue}`, `{stakes}`

These are filled from `fragments.json`.

## Notes

- Monstrous alignment entries like “ANY EVIL”, “NOT GOOD”, “ANY CHAOTIC” are converted into a specific one of the classic nine alignments at generation time.
- Intelligence banding follows D&D-style breakpoints (≤7, 8–11, 12–15, 16–17, 18+).

---

Generated: 2025-12-26


### Monstrous role controls
In **Monstrous** mode, you choose whether to optionally add a **Class** *or* a **Profession** (via the “Role add-on” dropdown).
- If you pick **Profession**, the Profession dropdown includes **Never**. Select **Never** to generate the monster **without** a profession add-on.
