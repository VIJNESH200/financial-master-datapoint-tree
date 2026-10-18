# Add a Datapoint — Maintainer Checklist

Use this checklist for each taxonomy change. The worked example adds **Subscription Revenue** under GIND Income Statement → Revenue.

## Worked example

**1. Add the item to `taxonomyData.js`.**

Find `financialData.gind.incomeStatement`, then the `Revenue` item. Add this line inside its existing `children` array:

```js
{ name: "Subscription Revenue", datapoint: "Subscription_Revenue" },
```

Keep the comma when another item follows it. Do not create a second `Revenue` parent. Add the item under the parent that matches its place in the taxonomy.

**2. Add its definition to `definitions.js`.**

Inside `DEFINITIONS`, add:

```js
Subscription_Revenue: "Revenue recognized from subscription services during the period.",
```

The key must match the `datapoint` value exactly. Keep the definition specific to the item.

## Before saving

- [ ] Confirm the display name, datapoint code, parent and statement are correct.
- [ ] Search for the code in `taxonomyData.js` to check whether it already exists. Reuse a code only when it represents the same concept.
- [ ] Confirm the definition key matches the datapoint code exactly.
- [ ] If editing a Balance Sheet root, preserve its existing `isSide` value.
- [ ] Leave `script.js`, `index.html` and `style.css` unchanged for a taxonomy-only update.

## Validate the change

- [ ] Run `node --check taxonomyData.js` and `node --check definitions.js`.
- [ ] Run `node check.js` and resolve every reported issue. It checks for missing datapoint codes, missing or blank definitions, unused definition keys and codes used with different display names. Reusing a code with the same display name in multiple places is allowed.
- [ ] Open `index.html` and refresh the page.
- [ ] Select the relevant industry and statement. Expand the parent and confirm the new item appears in the right place.
- [ ] Search by both the display name and datapoint code.
- [ ] Click the item and confirm its definition and hierarchy path. Test the copy button.
- [ ] Check the other statements and industry selector still work. Check Supplementary Items too.

For changes to `script.js` or `style.css`, also open `stress-test.html` and test search, Expand All, Collapse All, the detail panel and copy button. Repeat at a narrow browser width.

## Before committing

- [ ] Remove any temporary datapoints used for manual testing.
- [ ] Review the final diff to make sure only intended files changed.
- [ ] Commit the change with a message that describes the taxonomy update.

**Important:** The live page reads `taxonomyData.js` and `definitions.js`; it does not read the Jupyter Excel workbook automatically. If the Excel-to-JavaScript generator becomes the official workflow, update the workbook and regenerate the JavaScript instead of editing generated output by hand.
