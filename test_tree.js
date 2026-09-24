// Focused data-model tests for Financial Master Datapoint Tree
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectFiles = ["index.html", "script.js", "style.css"];
projectFiles.forEach(file => {
  assert(fs.existsSync(path.join(__dirname, file)), `${file} must exist`);
});

const { financialData } = require("./script.js");

function directNames(nodes) {
  return nodes.map(node => node.name);
}

function collectCodes(nodes, seen = new Set(), pathName = "") {
  for (const node of nodes) {
    const code = node.datapoint || node.code;
    if (code) {
      assert(!seen.has(code), `Duplicate datapoint code "${code}" at ${pathName} > ${node.name}`);
      seen.add(code);
    }

    if (Array.isArray(node.children) && node.children.length > 0) {
      const parentCode = node.datapoint || node.code;
      for (const child of node.children) {
        const childCode = child.datapoint || child.code;
        assert(
          !(parentCode && childCode && parentCode === childCode),
          `Parent/child duplicate code "${parentCode}" at ${pathName} > ${node.name}`
        );
        assert(
          child.name !== node.name,
          `Parent/child duplicate concept "${node.name}" at ${pathName}`
        );
      }
      collectCodes(node.children, seen, pathName ? `${pathName} > ${node.name}` : node.name);
    }
  }
  return seen;
}

function find(nodes, name) {
  return nodes.find(node => node.name === name);
}

function assertExactOrder(nodes, expected, label) {
  assert.deepStrictEqual(
    directNames(nodes),
    expected,
    `${label} top-level order is incorrect`
  );
}

function assertHasDatapoint(node, label = node.name) {
  assert(node, `${label} must exist`);
  assert(node.datapoint, `${label} must have a datapoint code`);
}

// --------------------------------------------------
// Balance Sheet
// --------------------------------------------------
for (const industry of ["gind", "bank"]) {
  const bs = financialData[industry].balanceSheet;
  assertExactOrder(bs, ["Assets", "Total Liabilities & Equity"], `${industry} Balance Sheet`);

  const assets = find(bs, "Assets");
  assert(assets, `${industry} BS must contain Assets`);
  assert(!assets.datapoint, `${industry} BS Assets is a structural heading and must not have a datapoint`);
  if (industry === "gind") {
    assertExactOrder(
      assets.children,
      ["Current Assets", "Non-Current Assets", "Total Assets"],
      `${industry} Assets`
    );
    assertHasDatapoint(find(find(assets.children, "Current Assets").children, "Cash & Cash Equivalents") || find(assets.children, "Current Assets"));
    assertHasDatapoint(find(find(assets.children, "Non-Current Assets").children, "Property, Plant & Equipment") || find(assets.children, "Non-Current Assets"));
  } else {
    // Bank uses bank-specific flat asset lines + Total Assets (existing bank codes kept).
    assertExactOrder(
      assets.children,
      ["Cash & Balances with Central Banks", "Loans & Advances to Banks", "Loans & Advances to Customers", "Investment Securities", "Derivative Financial Assets", "Property and Equipment", "Other Bank Assets", "Total Assets"],
      `${industry} Assets`
    );
    for (const leaf of assets.children) assertHasDatapoint(leaf, `Bank BS ${leaf.name}`);
  }

  const totalAssets = find(assets.children, "Total Assets");
  assertHasDatapoint(totalAssets);

  const tle = find(bs, "Total Liabilities & Equity");
  assertHasDatapoint(tle);
  assertExactOrder(tle.children, ["Liabilities", "Equity"], `${industry} Total Liabilities & Equity`);
  assert(!find(tle.children, "Total Liabilities & Equity"), `${industry} BS must not duplicate Total Liabilities & Equity`);

  const liabilities = find(tle.children, "Liabilities");
  const equity = find(tle.children, "Equity");
  assert(!liabilities.datapoint, `${industry} BS Liabilities is structural and must not have a datapoint`);
  assert(!equity.datapoint, `${industry} BS Equity is structural and must not have a datapoint`);
  assertHasDatapoint(find(liabilities.children, "Total Liabilities"));
  assertHasDatapoint(find(equity.children, "Total Equity"));

  collectCodes(bs, new Set(), `${industry} BS`);
}

// --------------------------------------------------
// Income Statement
// --------------------------------------------------
const gindIS = financialData.gind.incomeStatement;
assertExactOrder(
  gindIS,
  [
    "Revenue",
    "Cost of Sales",
    "Gross Profit",
    "Operating Expenses",
    "EBITDA",
    "Depreciation & Amortization",
    "EBIT / Operating Profit",
    "Non-Operating Income / Expense",
    "Profit Before Tax",
    "Tax",
    "Net Profit"
  ],
  "GIND Income Statement"
);

["Revenue", "Cost of Sales", "Operating Expenses", "Non-Operating Income / Expense",
 "Gross Profit", "EBITDA", "Depreciation & Amortization",
 "EBIT / Operating Profit", "Profit Before Tax", "Tax", "Net Profit"
].forEach(name => assertHasDatapoint(find(gindIS, name)));

const opEx = find(gindIS, "Operating Expenses");
assertExactOrder(
  opEx.children,
  [
    "Selling, General & Administrative",
    "Research & Development",
    "Other Operating Expenses"
  ],
  "GIND Operating Expenses"
);
assert(!find(opEx.children, "Depreciation & Amortization"), "GIND D&A must not be nested inside Operating Expenses");

const bankIS = financialData.bank.incomeStatement;
assertExactOrder(
  bankIS,
  [
    "Interest Income",
    "Interest Expense",
    "Net Interest Income",
    "Non-Interest Income",
    "Credit Loss Expense / Loan Loss Provisions",
    "Operating Expenses",
    "Profit Before Tax",
    "Tax",
    "Net Profit"
  ],
  "Bank Income Statement"
);

for (const name of ["Interest Income", "Interest Expense", "Net Interest Income", "Non-Interest Income",
  "Credit Loss Expense / Loan Loss Provisions", "Operating Expenses", "Profit Before Tax", "Tax", "Net Profit"]) {
  assertHasDatapoint(find(bankIS, name));
}

collectCodes(gindIS, new Set(), "GIND IS");
collectCodes(bankIS, new Set(), "Bank IS");

// --------------------------------------------------
// Cash Flow — the critical semantic correction
// --------------------------------------------------
for (const industry of ["gind", "bank"]) {
  const cf = financialData[industry].cashFlow;

  assertExactOrder(
    cf,
    [
      "Cash Flow From Operations",
      "Cash Flow From Investing",
      "Cash Flow From Financing",
      "Net Change In Cash",
      "Cash & Cash Equivalents At Beginning Of Period",
      "Cash & Cash Equivalents At End Of Period"
    ],
    `${industry} Cash Flow`
  );

  // These are the actual subtotal lines and therefore the parents.
  const cfo = find(cf, "Cash Flow From Operations");
  const cfi = find(cf, "Cash Flow From Investing");
  const cff = find(cf, "Cash Flow From Financing");

  [cfo, cfi, cff].forEach(node => {
    assertHasDatapoint(node);
    assert(Array.isArray(node.children) && node.children.length > 0, `${industry} ${node.name} must contain component children`);
    assert(
      !find(node.children, node.name),
      `${industry} ${node.name} must not contain itself as a child`
    );
  });

  assert(!find(cf, "Operating Activities"), `${industry} CF must not contain an "Operating Activities" wrapper`);
  assert(!find(cf, "Investing Activities"), `${industry} CF must not contain an "Investing Activities" wrapper`);
  assert(!find(cf, "Financing Activities"), `${industry} CF must not contain a "Financing Activities" wrapper`);

  assertHasDatapoint(find(cf, "Net Change In Cash"));
  assertHasDatapoint(find(cf, "Cash & Cash Equivalents At Beginning Of Period"));
  assertHasDatapoint(find(cf, "Cash & Cash Equivalents At End Of Period"));

  collectCodes(cf, new Set(), `${industry} CF`);
}

// --------------------------------------------------
// Supplementary Items
// --------------------------------------------------
assert(Array.isArray(financialData.supplementaryItems), "Supplementary Items must exist");
assert.strictEqual(financialData.supplementaryItems.length, 8, "Supplementary Items should contain the 8 current datapoints");
collectCodes(financialData.supplementaryItems, new Set(), "Supplementary Items");

console.log("=== Financial Master Datapoint Tree semantic tests passed ===");
console.log("✓ No duplicate parent/child concepts");
console.log("✓ No duplicate datapoint codes within any statement");
console.log("✓ Cash Flow uses CFO/CFI/CFF as the actual parent subtotal lines");
console.log("✓ Balance Sheet totals are distinct from structural headings");
console.log("✓ Income Statement follows the intended financial flow");
