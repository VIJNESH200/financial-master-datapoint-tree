# Financial Master Datapoint Tree

A small, static analyst reference tool for exploring the financial datapoint taxonomy for **GIND** and **Bank** industries. Plain HTML + CSS + vanilla JavaScript — no frameworks, no build step, no dependencies.

## Usage

Open `index.html` directly in a browser (or serve the folder with any static server):

```bash
npx serve .
```

## What it covers

Industries × statements (each combination renders its own tree):

| Industry | Balance Sheet | Income Statement | Cash Flow Statement |
|----------|---------------|------------------|---------------------|
| GIND     | ✓             | ✓                | ✓                   |
| Bank     | ✓             | ✓                | ✓                   |

Plus a separate **Supplementary Items** section (EPS, DPS, book values, shares outstanding, dividend payout).

## Features

- **Tree navigation** — `+` / `−` toggles expand and collapse branches; `Expand All` / `Collapse All` act on the whole view.
- **Search** — instant, case-insensitive, partial matching against both datapoint names and datapoint codes. Matching parents stay visible and auto-expand; `×` or `Esc` clears.
- **Detail panel** — clicking any node shows its datapoint code, a short analyst-grade **definition**, statement, industry, full path, and direct children.
- **Copy** — hover a row to copy the raw datapoint code (e.g. `Revenue`, not `[Revenue]`); the code in the detail panel is also click-to-copy.

## Data model (`script.js`)

- Taxonomy lives in `financialData` (`gind` / `bank` → `balanceSheet` / `incomeStatement` / `cashFlow`, plus `supplementaryItems`).
- Each node: `{ name, datapoint, children? }`. A `+` / `−` toggle means only "has children" — a parent may also carry its own datapoint code.
- Definitions live in `DEFINITIONS` in `script.js`, keyed by datapoint code (one per code, shared across industries where the code is shared).

## Checks

```bash
node --check script.js
```

## License

MIT — see [LICENSE](LICENSE).
