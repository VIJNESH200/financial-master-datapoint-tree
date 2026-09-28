# Financial Master Datapoint Tree

A tiny static template (HTML + CSS + vanilla JS) for browsing a hierarchical datapoint taxonomy. This copy ships with GIND / Bank data, but the whole thing is meant to be forked and reshaped — most changes are a few lines in two files.

## Run it

No build, no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Files: `index.html` (layout), `style.css` (all styling), `script.js` (data + rendering). `LICENSE` is MIT.

## 1. Edit the taxonomy (`script.js` → `financialData`)

Everything renders from one object:

```js
const financialData = {
  gind: {
    balanceSheet: [ /* nodes */ ],
    incomeStatement: [ /* nodes */ ],
    cashFlow: [ /* nodes */ ]
  },
  bank: { /* same three arrays */ },
  supplementaryItems: [ /* flat list */ ]
};
```

Each node is:

```js
{ name: "Revenue", datapoint: "Revenue", children: [
  { name: "Product / Service Revenue", datapoint: "Product_Service_Revenue" },
  { name: "Other Operating Revenue", datapoint: "Other_Operating_Revenue" }
]}
```

Rules of thumb:

- `name` is the display label; `datapoint` is the code shown in `[brackets]` and used by search, copy, and the detail panel.
- A node **with** `children` gets a `+` / `−` toggle. A node **with** `datapoint` shows a code chip — parents can have both.
- Omit `datapoint` for a pure grouping heading (e.g. the built-in `Supplementary Items` wrapper has none).
- Keep codes in `UPPER_SNAKE_CASE` and unique within a statement so search counts and copy stay unambiguous.
- Leaf order is display order — just reorder the array.
- After editing, sanity-check with `node --check script.js` and reload the page. Counts, search, toggles, and the detail panel all follow the data automatically.

## 2. Add or edit definitions (`script.js` → `DEFINITIONS`)

One flat map, keyed by datapoint code:

```js
const DEFINITIONS = {
  Revenue: "Income generated from the company's ordinary business activities during the period.",
  // ...
};
```

- Add one line per new `datapoint` code; reuse the same key if two nodes share a code.
- Keep it to 1–2 sentences. The detail panel shows it right under the code; a missing key renders as "Definition not available."
- Bank/industry-specific nuance goes here (e.g. `Customer_Deposits` is described as bank funding, not generic revenue).

## 3. Add a new industry

Say you want `insurance` alongside `gind` / `bank`:

1. Add the data: `financialData.insurance = { balanceSheet: [...], incomeStatement: [...], cashFlow: [...] }` (copy one industry's shape as a starting point).
2. Add its label in `script.js`: `INDUSTRY_LABELS = { gind: "GIND", bank: "Bank", insurance: "Insurance" }`.
3. Add one button in `index.html` inside `#industry-toggles`:
   `<button type="button" class="toggle-btn" data-target="insurance" role="tab" aria-selected="false">Insurance</button>`
4. Add `DEFINITIONS` entries for any new codes.

No other JS changes needed — selection, breadcrumb (`GIND › Balance Sheet`), counts, and search scope follow automatically.

## 4. Add a new statement

Same pattern with the other axis:

1. Add the array under each industry, e.g. `financialData.gind.equityStatement = [...]`.
2. Add its label in `script.js`: `STATEMENT_LABELS = { ..., equityStatement: "Statement of Changes in Equity" }`.
3. Add one button per statement group in `index.html` inside `#statement-toggles` with a matching `data-target`.

## 5. Change the look (`style.css`)

All styling is plain CSS with variables at the top (`--bg`, `--card`, `--border`, `--accent`, …).

- Toolbar order in `index.html` is: selectors → search → Expand/Collapse buttons. Reorder those three blocks to rearrange.
- Search box styles live under `.search-box` / `.search-row`; result highlighting is the `mark` rule.
- Detail panel styles are the `.detail-*` rules (`.detail-definition-block` is the definition card).
- Layout collapses to one column under 980px (see the `@media` block at the bottom); the tree card scrolls horizontally on narrow screens.

## 6. What you don't need to touch

Search (name + code, case-insensitive, partial), the `×` / `Esc` clear behavior, `Expand All` / `Collapse All`, copy-to-clipboard (copies the raw code without brackets), the footer count (`N datapoints` / `N matches`), and the detail panel's statement / industry / path / children sections all derive from the data — they adapt without code changes.

## License

MIT — see [LICENSE](LICENSE).
