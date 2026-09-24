// Comprehensive test suite for Financial Master Datapoint Tree
const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== Running Verification Tests ===");

// 1. Verify index.html
const htmlPath = path.join(__dirname, "index.html");
assert(fs.existsSync(htmlPath), "index.html must exist");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");
assert(htmlContent.includes("Financial Master Datapoint Tree"), "HTML must contain title 'Financial Master Datapoint Tree'");
assert(htmlContent.includes('id="tree-root"'), "HTML must contain #tree-root container");
assert(htmlContent.includes('id="statement-toggles"'), "HTML must contain #statement-toggles");
assert(htmlContent.includes('id="industry-toggles"'), "HTML must contain #industry-toggles");
assert(htmlContent.includes('id="tree-container"'), "HTML must contain #tree-container");
assert(htmlContent.includes('id="supplementary-container"'), "HTML must contain #supplementary-container");
assert(htmlContent.includes('data-target="balanceSheet"'), "HTML must contain Balance Sheet button");
assert(htmlContent.includes('data-target="incomeStatement"'), "HTML must contain Income Statement button");
assert(htmlContent.includes('data-target="cashFlow"'), "HTML must contain Cash Flow button");
assert(htmlContent.includes('data-target="gind"'), "HTML must contain GIND button");
assert(htmlContent.includes('data-target="bank"'), "HTML must contain Bank button");
assert(htmlContent.includes('href="style.css"'), "HTML must link style.css");
assert(htmlContent.includes('src="script.js"'), "HTML must load script.js");
console.log("✔ index.html verification passed");

// 2. Verify style.css
const cssPath = path.join(__dirname, "style.css");
assert(fs.existsSync(cssPath), "style.css must exist");
const cssContent = fs.readFileSync(cssPath, "utf-8");
const requiredSelectors = [
  ".selectors-container",
  ".selector-group",
  ".selector-label",
  ".toggle-group",
  ".toggle-btn",
  ".toggle-btn.active",
  ".tree-display",
  ".tree-branch",
  ".tree-branch.collapsed",
  ".tree-item",
  ".tree-row",
  ".branch-row",
  ".leaf-row",
  ".tree-toggle",
  ".tree-spacer",
  ".datapoint-name",
  ".datapoint-code",
  ".bs-root-branch",
  ".bs-side-assets",
  ".bs-side-liabilities-equity",
  ".supplementary-section",
  ".supplementary-header",
  ".supplementary-list"
];
for (const selector of requiredSelectors) {
  assert(cssContent.includes(selector), `style.css must include selector: ${selector}`);
}

// Verify connector lines implemented via CSS borders and pseudo-elements
assert(cssContent.includes(".tree-branch .tree-branch > .tree-item::before"), "style.css must have ::before pseudo-element for vertical connector line");
assert(cssContent.includes(".tree-branch .tree-branch > .tree-item:first-child::before"), "style.css must have :first-child::before for parent-to-child vertical connector line");
assert(cssContent.includes(".tree-branch .tree-branch > .tree-item:last-child::before"), "style.css must have :last-child::before to stop vertical line");
assert(cssContent.includes(".tree-branch .tree-branch > .tree-item:first-child:last-child::before"), "style.css must have :first-child:last-child::before for only-child branches");
assert(cssContent.includes(".tree-branch .tree-branch > .tree-item::after"), "style.css must have ::after pseudo-element for horizontal connector line");
assert(cssContent.includes(".tree-branch .tree-branch > .tree-item > .leaf-row .tree-spacer::before"), "style.css must scope spacer horizontal extension to nested leaf rows");
assert(cssContent.includes("border-left"), "style.css must use border-left for vertical connector lines");
assert(cssContent.includes("border-top"), "style.css must use border-top for horizontal connector lines");
assert(!cssContent.includes("<svg") && !cssContent.includes("canvas") && !cssContent.includes("url("), "Lines must NOT use images, canvas, or SVG");

// Verify Balance Sheet connector structure styling (Requirement 4)
assert(cssContent.includes(".bs-root-branch::before"), "style.css must define .bs-root-branch::before vertical trunk line");
assert(cssContent.includes(".bs-side-assets::after"), "style.css must define .bs-side-assets::after connector");
assert(cssContent.includes(".bs-side-liabilities-equity"), "style.css must define .bs-side-liabilities-equity");

// Verify white-space nowrap on datapoint code
assert(cssContent.includes("white-space: nowrap"), "style.css must prevent text wrapping on datapoint codes / leaf rows");
console.log("✔ style.css verification passed");

// 3. Mock DOM environment for Node testing
class MockElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.classList = {
      _classes: new Set(),
      add: (...clsList) => clsList.forEach(cls => this.classList._classes.add(cls)),
      remove: (...clsList) => clsList.forEach(cls => this.classList._classes.delete(cls)),
      contains: (cls) => this.classList._classes.has(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (this.classList.contains(cls)) {
            this.classList.remove(cls);
            return false;
          } else {
            this.classList.add(cls);
            return true;
          }
        } else if (force) {
          this.classList.add(cls);
          return true;
        } else {
          this.classList.remove(cls);
          return false;
        }
      }
    };
    this.children = [];
    this.childNodes = [];
    this.attributes = {};
    this.textContent = "";
    this._listeners = {};
    this.type = "";
    this.parentElement = null;
  }

  get className() {
    return Array.from(this.classList._classes).join(" ");
  }

  set className(val) {
    this.classList._classes = new Set(val.split(" ").filter(Boolean));
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
  }

  getAttribute(name) {
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  hasChildNodes() {
    return this.children.length > 0;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    this.childNodes.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
    const nIdx = this.childNodes.indexOf(child);
    if (nIdx !== -1) {
      this.childNodes.splice(nIdx, 1);
    }
    child.parentElement = null;
    return child;
  }

  replaceChildren(...newChildren) {
    for (const child of this.children) {
      child.parentElement = null;
    }
    this.children = [];
    this.childNodes = [];
    for (const child of newChildren) {
      this.appendChild(child);
    }
  }

  addEventListener(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  }

  dispatchEvent(event) {
    if (!event.target) {
      event.target = this;
    }
    let stopped = false;
    event.stopPropagation = () => { stopped = true; };
    const handlers = this._listeners[event.type] || [];
    for (const handler of handlers) {
      handler(event);
      if (stopped) return;
    }
    if (event.bubbles !== false && this.parentElement && !stopped) {
      this.parentElement.dispatchEvent(event);
    }
  }

  click() {
    this.dispatchEvent({ type: "click", bubbles: true, target: this });
  }

  _matchesSimple(selector) {
    if (selector.startsWith("#")) {
      return this.id === selector.slice(1);
    }
    if (selector.startsWith(".")) {
      const classes = selector.split(".").filter(Boolean);
      return classes.every(c => this.classList.contains(c));
    }
    return this.tagName === selector.toUpperCase();
  }

  querySelector(selector) {
    if (selector.includes(",")) {
      const parts = selector.split(",").map(s => s.trim()).filter(Boolean);
      for (const p of parts) {
        const found = this.querySelector(p);
        if (found) return found;
      }
      return null;
    }

    if (selector.includes(" ")) {
      const parts = selector.split(/\s+/);
      let current = [this];
      for (const part of parts) {
        let next = [];
        for (const el of current) {
          next = next.concat(el.querySelectorAll(part));
        }
        current = next;
      }
      return current[0] || null;
    }

    for (const child of this.children) {
      if (child._matchesSimple(selector)) {
        return child;
      }
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }

  querySelectorAll(selector) {
    if (selector.includes(",")) {
      const parts = selector.split(",").map(s => s.trim()).filter(Boolean);
      let set = new Set();
      for (const p of parts) {
        for (const el of this.querySelectorAll(p)) {
          set.add(el);
        }
      }
      return Array.from(set);
    }

    if (selector.includes(" ")) {
      const parts = selector.split(/\s+/);
      let current = [this];
      for (const part of parts) {
        let next = [];
        for (const el of current) {
          next = next.concat(el.querySelectorAll(part));
        }
        current = next;
      }
      return current;
    }

    let results = [];
    for (const child of this.children) {
      if (child._matchesSimple(selector)) {
        results.push(child);
      }
      results = results.concat(child.querySelectorAll(selector));
    }
    return results;
  }
}

// Build standard DOM tree matching updated index.html
const mockRoot = new MockElement("main");
mockRoot.id = "tree-root";

const mockDocument = {
  readyState: "loading",
  createElement: (tag) => new MockElement(tag),
  getElementById: (id) => {
    if (id === "tree-root") return mockRoot;
    return mockRoot.querySelector("#" + id);
  },
  querySelector: (sel) => mockRoot.querySelector(sel),
  querySelectorAll: (sel) => mockRoot.querySelectorAll(sel),
  addEventListener: () => {}
};

global.document = mockDocument;
const {
  financialData,
  renderTree,
  initTree,
  selectStatement,
  selectIndustry,
  updateTreeDisplay,
  renderSupplementaryItems,
  buildTaxonomyUI
} = require("./script.js");

// 4. Verify financialData structure (Requirement 1 & 6)
assert(financialData, "financialData object must be exported");
assert(financialData.gind, "financialData.gind must exist");
assert(financialData.bank, "financialData.bank must exist");
assert(Array.isArray(financialData.supplementaryItems), "financialData.supplementaryItems must be an array");

assert(Array.isArray(financialData.gind.balanceSheet), "financialData.gind.balanceSheet must be an array");
assert(Array.isArray(financialData.gind.incomeStatement), "financialData.gind.incomeStatement must be an array");
assert(Array.isArray(financialData.gind.cashFlow), "financialData.gind.cashFlow must be an array");

assert(Array.isArray(financialData.bank.balanceSheet), "financialData.bank.balanceSheet must be an array");
assert(Array.isArray(financialData.bank.incomeStatement), "financialData.bank.incomeStatement must be an array");
assert(Array.isArray(financialData.bank.cashFlow), "financialData.bank.cashFlow must be an array");

// Verify separate, distinct data structures
assert.notDeepStrictEqual(financialData.gind.balanceSheet, financialData.bank.balanceSheet, "GIND and Bank BS must be separate");
assert.notDeepStrictEqual(financialData.gind.incomeStatement, financialData.bank.incomeStatement, "GIND and Bank IS must be separate");
assert.notDeepStrictEqual(financialData.gind.cashFlow, financialData.bank.cashFlow, "GIND and Bank CF must be separate");

// Verify datapoints have name and datapoint code
function verifyNodes(nodes) {
  let count = 0;
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      assert(node.name, "Branch node must have a name");
      count += verifyNodes(node.children);
    } else {
      count++;
      assert(node.name, `Datapoint must have a name: ${JSON.stringify(node)}`);
      const code = node.datapoint || node.code;
      assert(code, `Datapoint must have a datapoint code: ${JSON.stringify(node)}`);
      assert(!code.includes(" "), `Datapoint code must not contain spaces: ${code}`);
    }
  }
  return count;
}

const gindBsCount = verifyNodes(financialData.gind.balanceSheet);
const gindIsCount = verifyNodes(financialData.gind.incomeStatement);
const gindCfCount = verifyNodes(financialData.gind.cashFlow);
const bankBsCount = verifyNodes(financialData.bank.balanceSheet);
const bankIsCount = verifyNodes(financialData.bank.incomeStatement);
const bankCfCount = verifyNodes(financialData.bank.cashFlow);
const suppCount = verifyNodes(financialData.supplementaryItems);

console.log(`✔ Verified datapoint counts: GIND (BS: ${gindBsCount}, IS: ${gindIsCount}, CF: ${gindCfCount}), Bank (BS: ${bankBsCount}, IS: ${bankIsCount}, CF: ${bankCfCount}), Supplementary: ${suppCount}`);

// 5. Test DOM initialization and Initial State (Requirement 11)
// Setup mock tree root matching index.html
buildTaxonomyUI(mockRoot);
initTree();

const treeContainer = mockDocument.getElementById("tree-container");
assert(treeContainer !== null, "#tree-container must exist");

const supplementaryContainer = mockDocument.getElementById("supplementary-container");
assert(supplementaryContainer !== null, "#supplementary-container must exist");

// Initial state: Balance Sheet selected
const stmtButtons = mockRoot.querySelectorAll("#statement-toggles .toggle-btn");
assert.strictEqual(stmtButtons.length, 3, "Must have 3 financial statement toggle buttons");
assert(stmtButtons[0].classList.contains("active"), "Balance Sheet button must be active initially");
assert.strictEqual(stmtButtons[0].getAttribute("aria-selected"), "true");
assert(!stmtButtons[1].classList.contains("active"), "Income Statement button must not be active initially");
assert(!stmtButtons[2].classList.contains("active"), "Cash Flow button must not be active initially");

// Initial state: GIND selected
const indButtons = mockRoot.querySelectorAll("#industry-toggles .toggle-btn");
assert.strictEqual(indButtons.length, 2, "Must have 2 industry toggle buttons: GIND and Bank");
assert(indButtons[0].classList.contains("active"), "GIND button must be active initially");
assert.strictEqual(indButtons[0].getAttribute("aria-selected"), "true");
assert(!indButtons[1].classList.contains("active"), "Bank button must not be active initially");

// 6. Test Initial Balance Sheet Tree (Assets vs Total Liabilities & Equity)
assert.strictEqual(treeContainer.children.length, 1, "treeContainer should contain root ul");
const rootUl = treeContainer.children[0];
assert(rootUl.classList.contains("bs-root-branch"), "Root ul for Balance Sheet must have .bs-root-branch class");

// Assets is first child, Total Liabilities & Equity is second child
const assetsLi = rootUl.children[0];
assert(assetsLi.classList.contains("bs-side-assets"), "Assets item must have .bs-side-assets class");
assert.strictEqual(assetsLi.querySelector(".branch-label").textContent, "Assets");

const liabEqLi = rootUl.children[1];
assert(liabEqLi.classList.contains("bs-side-liabilities-equity"), "Total Liabilities & Equity must have .bs-side-liabilities-equity class");
assert.strictEqual(liabEqLi.querySelector(".branch-label").textContent, "Total Liabilities & Equity");

// Verify Assets children: Current Assets, Non-Current Assets, Total Assets
const assetsChildrenUl = assetsLi.children[1];
const assetsChildLabels = assetsChildrenUl.children.map(li => {
  const branchLabel = li.querySelector(".branch-label");
  const leafLabel = li.querySelector(".datapoint-name");
  return branchLabel ? branchLabel.textContent : (leafLabel ? leafLabel.textContent : "");
});
assert.deepStrictEqual(assetsChildLabels, ["Current Assets", "Non-Current Assets", "Total Assets"]);
const totalAssetsLi = assetsChildrenUl.children[2];
assert(totalAssetsLi.querySelector(".tree-row").classList.contains("leaf-row"), "Total Assets must be a leaf row without toggle button");
assert.strictEqual(totalAssetsLi.querySelector(".datapoint-code").textContent, "[Total_Assets]");

// Verify Total Liabilities & Equity children: Liabilities, Equity
const liabEqChildrenUl = liabEqLi.children[1];
const liabEqChildLabels = liabEqChildrenUl.children.map(li => {
  const branchLabel = li.querySelector(".branch-label");
  const leafLabel = li.querySelector(".datapoint-name");
  return branchLabel ? branchLabel.textContent : (leafLabel ? leafLabel.textContent : "");
});
assert.deepStrictEqual(liabEqChildLabels, ["Liabilities", "Equity"]);
assert.strictEqual(liabEqChildrenUl.children.length, 2, "Total Liabilities & Equity must have only 2 children: Liabilities and Equity");
assert.strictEqual(assetsLi.children[0].querySelector(".datapoint-code"), null, "Assets grouping node must NOT have a datapoint code");
assert.strictEqual(liabEqLi.children[0].querySelector(".datapoint-code").textContent, "[Total_Liabilities_And_Equity]");
assert.strictEqual(liabEqChildrenUl.children[0].children[0].querySelector(".datapoint-code"), null, "Liabilities grouping node must NOT have a datapoint code");
assert.strictEqual(liabEqChildrenUl.children[1].children[0].querySelector(".datapoint-code"), null, "Equity grouping node must NOT have a datapoint code");

// Verify Liabilities has Current, Non-Current, Total Liabilities
const liabBranchUl = liabEqChildrenUl.children[0].children[1];
const liabLabels = liabBranchUl.children.map(li => {
  const branchLabel = li.querySelector(".branch-label");
  const leafLabel = li.querySelector(".datapoint-name");
  return branchLabel ? branchLabel.textContent : (leafLabel ? leafLabel.textContent : "");
});
assert.deepStrictEqual(liabLabels, ["Current Liabilities", "Non-Current Liabilities", "Total Liabilities"]);
const totalLiabLeaf = liabBranchUl.children[2];
assert.strictEqual(totalLiabLeaf.querySelector(".datapoint-code").textContent, "[Total_Liabilities]");

// Verify Equity has Share Capital, Retained Earnings, Other Equity, Total Equity
const eqBranchUl = liabEqChildrenUl.children[1].children[1];
const eqLabels = eqBranchUl.children.map(li => {
  const branchLabel = li.querySelector(".branch-label");
  const leafLabel = li.querySelector(".datapoint-name");
  return branchLabel ? branchLabel.textContent : (leafLabel ? leafLabel.textContent : "");
});
assert.deepStrictEqual(eqLabels, ["Share Capital", "Retained Earnings", "Other Equity", "Total Equity"]);
const totalEqLeaf = eqBranchUl.children[3];
assert.strictEqual(totalEqLeaf.querySelector(".datapoint-code").textContent, "[Total_Equity]");

// Verify all top-level items are collapsed initially
assert(assetsChildrenUl.classList.contains("collapsed"), "Assets must be collapsed initially");
assert(liabEqChildrenUl.classList.contains("collapsed"), "Total Liabilities & Equity must be collapsed initially");
assert.strictEqual(assetsLi.querySelector(".tree-toggle").textContent, "+");
assert.strictEqual(liabEqLi.querySelector(".tree-toggle").textContent, "+");
console.log("✔ Balance Sheet hierarchy and collapsed initial state verified");

// 7. Verify Supplementary Items section rendering
const suppRows = supplementaryContainer.querySelectorAll(".supplementary-row");
assert.strictEqual(suppRows.length, 8, "Must render 8 supplementary items");
const suppCodes = suppRows.map(r => r.querySelector(".datapoint-code").textContent);
assert(suppCodes.includes("[EPS]"));
assert(suppCodes.includes("[Diluted_EPS]"));
assert(suppCodes.includes("[DPS]"));
assert(suppCodes.includes("[Book_Value_Per_Share]"));
assert(suppCodes.includes("[Tangible_Book_Value_Per_Share]"));
assert(suppCodes.includes("[Weighted_Average_Shares_Outstanding]"));
assert(suppCodes.includes("[Diluted_Weighted_Average_Shares_Outstanding]"));
assert(suppCodes.includes("[Dividend_Payout]"));
console.log("✔ Supplementary items rendered correctly with standard codes");

// 8. Test Combinations: Statement x Industry
// Combination 1: Balance Sheet + Bank
indButtons[1].click(); // Click Bank
assert(!indButtons[0].classList.contains("active"));
assert(indButtons[1].classList.contains("active"));
assert(stmtButtons[0].classList.contains("active")); // Still Balance Sheet

const bankBsUl = treeContainer.children[0];
assert(bankBsUl.classList.contains("bs-root-branch"));
const bankBsAssetsLi = bankBsUl.children[0];
const bankBsAssetsChildren = bankBsAssetsLi.children[1];
const bankAssetsNames = bankBsAssetsChildren.children.map(li => {
  const leaf = li.querySelector(".datapoint-name");
  return leaf ? leaf.textContent : "";
});
assert(bankAssetsNames.includes("Cash & Balances with Central Banks"));
assert(bankAssetsNames.includes("Investment Securities"));
assert(bankAssetsNames.includes("Total Assets"));
const bankTotalAssetsLeaf = bankBsAssetsChildren.children.find(li => li.querySelector(".datapoint-name")?.textContent === "Total Assets");
assert.strictEqual(bankTotalAssetsLeaf.querySelector(".datapoint-code").textContent, "[Bank_Total_Assets]");
console.log("✔ Balance Sheet + Bank combination verified");

// Combination 2: Income Statement + Bank
stmtButtons[1].click(); // Click Income Statement
assert(stmtButtons[1].classList.contains("active"));
assert(indButtons[1].classList.contains("active"));

const bankIsUl = treeContainer.children[0];
const bankIsRows = bankIsUl.children.map(li => {
  const b = li.querySelector(".branch-label");
  const l = li.querySelector(".datapoint-name");
  return b ? b.textContent : (l ? l.textContent : "");
});
assert(bankIsRows.includes("Interest Income"));
assert(bankIsRows.includes("Interest Expense"));
assert(bankIsRows.includes("Net Interest Income"));
assert(bankIsRows.includes("Non-Interest Income"));
assert(bankIsRows.includes("Credit Loss Expense / Loan Loss Provisions"));
assert(bankIsRows.includes("Operating Expenses"));
assert(bankIsRows.includes("Profit Before Tax"));
assert(bankIsRows.includes("Tax"));
assert(bankIsRows.includes("Net Profit"));

// Check leaf datapoint lines in Bank IS
const netIntIncomeLi = bankIsUl.children.find(li => li.querySelector(".datapoint-name")?.textContent === "Net Interest Income");
assert(netIntIncomeLi.querySelector(".tree-row").classList.contains("leaf-row"), "Net Interest Income must be leaf row");
assert.strictEqual(netIntIncomeLi.querySelector(".datapoint-code").textContent, "[Net_Interest_Income]");

const bankPbtLi = bankIsUl.children.find(li => li.querySelector(".datapoint-name")?.textContent === "Profit Before Tax");
assert(bankPbtLi.querySelector(".tree-row").classList.contains("leaf-row"), "Bank Profit Before Tax must be leaf row");
assert.strictEqual(bankPbtLi.querySelector(".datapoint-code").textContent, "[Profit_Before_Tax]");

const bankNetProfitLi = bankIsUl.children.find(li => li.querySelector(".datapoint-name")?.textContent === "Net Profit");
assert(bankNetProfitLi.querySelector(".tree-row").classList.contains("leaf-row"), "Bank Net Profit must be leaf row");
assert.strictEqual(bankNetProfitLi.querySelector(".datapoint-code").textContent, "[Net_Profit]");

const bankTaxLi = bankIsUl.children.find(li => li.querySelector(".datapoint-name")?.textContent === "Tax");
assert(bankTaxLi.querySelector(".tree-row").classList.contains("leaf-row"), "Bank Tax must be leaf row");
assert.strictEqual(bankTaxLi.querySelector(".datapoint-code").textContent, "[Bank_Taxation]");

console.log("✔ Income Statement + Bank combination verified");

// Combination 3: Income Statement + GIND
indButtons[0].click(); // Click GIND
assert(indButtons[0].classList.contains("active"));
assert(stmtButtons[1].classList.contains("active"));

const gindIsUl = treeContainer.children[0];
const gindIsRows = gindIsUl.children.map(li => {
  const b = li.querySelector(".branch-label");
  const l = li.querySelector(".datapoint-name");
  return b ? b.textContent : (l ? l.textContent : "");
});
assert.deepStrictEqual(gindIsRows, [
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
]);

// Gross Profit, EBITDA, Depreciation & Amortization, EBIT / Operating Profit, Profit Before Tax, and Net Profit must be leaf rows
const grossProfitLi = gindIsUl.children[2];
assert(grossProfitLi.querySelector(".tree-row").classList.contains("leaf-row"), "Gross Profit must be a leaf row");
assert.strictEqual(grossProfitLi.querySelector(".datapoint-code").textContent, "[Gross_Profit]");

// Verify Operating Expenses children: SG&A, R&D, Other Operating Expenses (no D&A inside OpEx)
const opexLi = gindIsUl.children[3];
const opexUl = opexLi.querySelector(".tree-branch");
const opexChildNames = opexUl.children.map(li => li.querySelector(".datapoint-name")?.textContent);
assert.deepStrictEqual(opexChildNames, [
  "Selling, General & Administrative",
  "Research & Development",
  "Other Operating Expenses"
]);
assert(!opexChildNames.includes("Depreciation & Amortization"), "D&A must NOT be inside Operating Expenses");

const ebitdaLi = gindIsUl.children[4];
assert(ebitdaLi.querySelector(".tree-row").classList.contains("leaf-row"), "EBITDA must be a leaf row");
assert.strictEqual(ebitdaLi.querySelector(".datapoint-code").textContent, "[EBITDA]");

const dnaLi = gindIsUl.children[5];
assert(dnaLi.querySelector(".tree-row").classList.contains("leaf-row"), "Depreciation & Amortization must be a leaf row");
assert.strictEqual(dnaLi.querySelector(".datapoint-code").textContent, "[Depreciation_And_Amortization]");

const ebitLi = gindIsUl.children[6];
assert(ebitLi.querySelector(".tree-row").classList.contains("leaf-row"), "EBIT / Operating Profit must be a leaf row");
assert.strictEqual(ebitLi.querySelector(".datapoint-code").textContent, "[EBIT]");

const pbtLi = gindIsUl.children[8];
assert(pbtLi.querySelector(".tree-row").classList.contains("leaf-row"), "Profit Before Tax must be a leaf row");
assert.strictEqual(pbtLi.querySelector(".datapoint-code").textContent, "[Profit_Before_Tax]");

const taxLi = gindIsUl.children[9];
assert(taxLi.querySelector(".tree-row").classList.contains("leaf-row"), "Tax must be a leaf row without toggle");
assert.strictEqual(taxLi.querySelector(".datapoint-code").textContent, "[Income_Tax]");

const netProfitLi = gindIsUl.children[10];
assert(netProfitLi.querySelector(".tree-row").classList.contains("leaf-row"), "Net Profit must be a leaf row");
assert.strictEqual(netProfitLi.querySelector(".datapoint-code").textContent, "[Net_Profit]");
console.log("✔ Income Statement + GIND exact order and leaf datapoints verified");

// Combination 4: Cash Flow + GIND
stmtButtons[2].click(); // Click Cash Flow
assert(stmtButtons[2].classList.contains("active"));
assert(indButtons[0].classList.contains("active"));

const gindCfUl = treeContainer.children[0];
const gindCfRows = gindCfUl.children.map(li => {
  const b = li.querySelector(".branch-label");
  const l = li.querySelector(".datapoint-name");
  return b ? b.textContent : (l ? l.textContent : "");
});
assert.deepStrictEqual(gindCfRows, [
  "Operating Activities",
  "Investing Activities",
  "Financing Activities",
  "Net Change In Cash",
  "Cash & Cash Equivalents At Beginning Of Period",
  "Cash & Cash Equivalents At End Of Period"
]);

const netChangeCashLi = gindCfUl.children[3];
assert(netChangeCashLi.querySelector(".tree-row").classList.contains("leaf-row"));
assert.strictEqual(netChangeCashLi.querySelector(".datapoint-code").textContent, "[Net_Change_In_Cash]");

const cashBegLi = gindCfUl.children[4];
assert.strictEqual(cashBegLi.querySelector(".datapoint-code").textContent, "[Cash_And_Cash_Equivalents_At_Beginning]");

const cashEndLi = gindCfUl.children[5];
assert.strictEqual(cashEndLi.querySelector(".datapoint-code").textContent, "[Cash_And_Cash_Equivalents_At_End]");
console.log("✔ Cash Flow + GIND combination with cash flow ending sequence verified");

// Combination 5: Cash Flow + Bank
indButtons[1].click(); // Click Bank
assert(stmtButtons[2].classList.contains("active"));
assert(indButtons[1].classList.contains("active"));

const bankCfUl = treeContainer.children[0];
const bankCfRows = bankCfUl.children.map(li => {
  const b = li.querySelector(".branch-label");
  const l = li.querySelector(".datapoint-name");
  return b ? b.textContent : (l ? l.textContent : "");
});
assert.deepStrictEqual(bankCfRows, [
  "Operating Activities",
  "Investing Activities",
  "Financing Activities",
  "Net Change In Cash",
  "Cash & Cash Equivalents At Beginning Of Period",
  "Cash & Cash Equivalents At End Of Period"
]);
console.log("✔ Cash Flow + Bank combination verified");

// 9. Test Expand/Collapse & Leaf Row Behavior
stmtButtons[0].click(); // Balance sheet
indButtons[0].click(); // GIND

const testBsUl = treeContainer.children[0];
const testAssetsLi = testBsUl.children[0];
const testAssetsRow = testAssetsLi.children[0];
const testAssetsToggle = testAssetsRow.querySelector(".tree-toggle");
const testAssetsChildren = testAssetsLi.children[1];

// Expand Assets
assert(testAssetsChildren.classList.contains("collapsed"));
testAssetsRow.click();
assert(!testAssetsChildren.classList.contains("collapsed"));
assert.strictEqual(testAssetsToggle.textContent, "−");

// Expand Current Assets
const currAssetsLi = testAssetsChildren.children[0];
const currAssetsRow = currAssetsLi.children[0];
const currAssetsToggle = currAssetsRow.querySelector(".tree-toggle");
const currAssetsChildren = currAssetsLi.children[1];

currAssetsToggle.click();
assert(!currAssetsChildren.classList.contains("collapsed"));
assert.strictEqual(currAssetsToggle.textContent, "−");

// Verify leaf datapoints and codes
const cashItemLi = currAssetsChildren.children[0];
const cashRow = cashItemLi.children[0];
assert(cashRow.classList.contains("leaf-row"));
assert.strictEqual(cashRow.querySelector(".tree-toggle"), null, "Leaf rows must NOT have + / − buttons");
assert.strictEqual(cashRow.querySelector(".datapoint-name").textContent, "Cash & Cash Equivalents");
const cashCode = cashRow.querySelector(".datapoint-code").textContent;
assert(cashCode === "[Cash_And_Cash_Equivalents]" || cashCode === "[Cash_And_Equivalents]", `Unexpected cash code: ${cashCode}`);

// Collapse Assets
testAssetsRow.click();
assert(testAssetsChildren.classList.contains("collapsed"));
assert.strictEqual(testAssetsToggle.textContent, "+");
console.log("✔ Expand/collapse and leaf datapoints with standardized codes verified");

// 10. Edge Cases
// Empty array rendering
const emptyUl = renderTree([]);
assert.strictEqual(emptyUl.tagName, "UL");
assert.strictEqual(emptyUl.children.length, 0);

// Null/undefined rendering
const nullUl = renderTree(null);
assert.strictEqual(nullUl.children.length, 0);

// Node with empty children
const emptyBranch = renderTree([{ name: "Empty", children: [] }]);
assert.strictEqual(emptyBranch.children.length, 1);
assert(emptyBranch.children[0].children[0].classList.contains("leaf-row"));

// Render supplementary items with null container
renderSupplementaryItems(null);

// 11. Test Expand All / Collapse All functionality & Supplementary Items parent behavior
console.log("=== Testing Expand All / Collapse All & Supplementary Parent Node ===");

// Reset to initial state: BS + GIND
selectStatement("balanceSheet");
selectIndustry("gind");

// Verify Expand All and Collapse All buttons in HTML
assert(htmlContent.includes('id="expand-all-btn"'), "HTML must contain #expand-all-btn");
assert(htmlContent.includes('id="collapse-all-btn"'), "HTML must contain #collapse-all-btn");
assert(htmlContent.includes('Expand All'), "HTML must contain 'Expand All' text");
assert(htmlContent.includes('Collapse All'), "HTML must contain 'Collapse All' text");

// Verify supplementary items has an expandable parent node with toggle
const suppParentLi = supplementaryContainer.querySelector(".supplementary-tree .tree-item");
assert(suppParentLi !== null, "Supplementary items must be contained in a parent tree-item");
const suppParentToggle = suppParentLi.querySelector(".tree-toggle");
assert(suppParentToggle !== null, "Supplementary items parent must have a + / − toggle button");
assert.strictEqual(suppParentToggle.textContent, "+", "Supplementary parent must initially be collapsed (+)");
const suppSubBranch = suppParentLi.querySelector(".tree-branch");
assert(suppSubBranch !== null, "Supplementary parent must have a child .tree-branch");
assert(suppSubBranch.classList.contains("collapsed"), "Supplementary child branch must initially be collapsed");

// Supplementary leaf rows must NOT have + / − buttons
const suppLeaves = suppSubBranch.querySelectorAll(".leaf-row");
assert.strictEqual(suppLeaves.length, 8, "Supplementary must have 8 leaf rows");
suppLeaves.forEach(leaf => {
  assert.strictEqual(leaf.querySelector(".tree-toggle"), null, "Supplementary datapoint leaves must NOT have + / − buttons");
  assert(leaf.querySelector(".tree-spacer") !== null, "Supplementary datapoint leaves must have spacer");
});

// Test Expand All on BS + GIND
const expandBtn = mockRoot.querySelector("#expand-all-btn");
const collapseBtn = mockRoot.querySelector("#collapse-all-btn");
assert(expandBtn !== null, "Expand All button must exist in mock root");
assert(collapseBtn !== null, "Collapse All button must exist in mock root");
assert.strictEqual(expandBtn._listeners["click"].length, 1, "Expand All button must have exactly 1 click listener");
assert.strictEqual(collapseBtn._listeners["click"].length, 1, "Collapse All button must have exactly 1 click listener");

expandBtn.click();

// Verify all expandable nodes in BS tree and Supplementary tree are expanded
const allBranchesAfterExpand = mockRoot.querySelectorAll(".tree-branch.collapsed");
assert.strictEqual(allBranchesAfterExpand.length, 0, "Expand All must leave zero collapsed tree branches");

const allTogglesAfterExpand = mockRoot.querySelectorAll(".tree-toggle");
assert(allTogglesAfterExpand.length > 0, "Must have toggle buttons");
allTogglesAfterExpand.forEach(tog => {
  assert.strictEqual(tog.textContent, "−", "All toggles must display '−' after Expand All");
});
assert.strictEqual(suppParentToggle.textContent, "−", "Supplementary parent toggle must be '−' after Expand All");
assert(!suppSubBranch.classList.contains("collapsed"), "Supplementary items must be expanded after Expand All");

// Test Collapse All on BS + GIND
collapseBtn.click();

const expandedRowsAfterCollapse = mockRoot.querySelectorAll(".branch-row.expanded");
assert.strictEqual(expandedRowsAfterCollapse.length, 0, "All branch rows must be collapsed after Collapse All");

const allTogglesAfterCollapse = mockRoot.querySelectorAll(".tree-toggle");
allTogglesAfterCollapse.forEach(tog => {
  assert.strictEqual(tog.textContent, "+", "All toggles must display '+' after Collapse All");
});
assert.strictEqual(suppParentToggle.textContent, "+", "Supplementary parent toggle must be '+' after Collapse All");
assert(suppSubBranch.classList.contains("collapsed"), "Supplementary items must be collapsed after Collapse All");

// Test toggle resets tree to normal collapsed state
expandBtn.click(); // Expand all first
assert.strictEqual(mockRoot.querySelectorAll(".tree-branch.collapsed").length, 0);

// Switch industry to Bank
indButtons[1].click(); // Bank
const bankCollapsedBranches = mockRoot.querySelectorAll(".tree-branch.collapsed");
const bankOpenBranches = mockRoot.querySelectorAll(".branch-row.expanded");
assert(bankCollapsedBranches.length > 0, "Switching industry must reset tree to collapsed state");
assert.strictEqual(bankOpenBranches.length, 0, "No branch row should be expanded after industry switch");

// Expand all in Bank BS
expandBtn.click();
assert.strictEqual(mockRoot.querySelectorAll(".tree-branch.collapsed").length, 0);

// Switch statement to Cash Flow
stmtButtons[2].click(); // Cash Flow
const cfCollapsedBranches = mockRoot.querySelectorAll(".tree-branch.collapsed");
const cfOpenBranches = mockRoot.querySelectorAll(".branch-row.expanded");
assert(cfCollapsedBranches.length > 0, "Switching statement must reset tree to collapsed state");
assert.strictEqual(cfOpenBranches.length, 0, "No branch row should be expanded after statement switch");

// In Cash Flow, verify leaf items (Net Change In Cash, etc.) do NOT have + / - toggles
const cfLeavesWithoutToggles = mockRoot.querySelectorAll(".tree-display .leaf-row .tree-toggle");
assert.strictEqual(cfLeavesWithoutToggles.length, 0, "Cash flow leaf rows must NOT have toggles");

console.log("✔ Expand All / Collapse All & Supplementary Parent Node verified successfully");

// 12. Exhaustive Audit of All 6 Combinations (Requirement 8 & 10)
console.log("=== Running Exhaustive 6-Combination Audit ===");

const combinations = [
  {
    industry: "gind",
    statement: "balanceSheet",
    label: "GIND + Balance Sheet",
    requiredLeafDatapoints: [
      { name: "Total Assets", code: "Total_Assets" },
      { name: "Total Liabilities", code: "Total_Liabilities" },
      { name: "Total Equity", code: "Total_Equity" }
    ],
    requiredCategories: ["Assets", "Current Assets", "Non-Current Assets", "Liabilities", "Equity"],
    requiredBranchDatapoints: [
      { name: "Current Assets", code: "Current_Assets" },
      { name: "Non-Current Assets", code: "Non_Current_Assets" },
      { name: "Total Liabilities & Equity", code: "Total_Liabilities_And_Equity" },
      { name: "Current Liabilities", code: "Current_Liabilities" },
      { name: "Non-Current Liabilities", code: "Non_Current_Liabilities" }
    ]
  },
  {
    industry: "gind",
    statement: "incomeStatement",
    label: "GIND + Income Statement",
    requiredLeafDatapoints: [
      { name: "Gross Profit", code: "Gross_Profit" },
      { name: "Selling, General & Administrative", code: "Selling_General_Administrative" },
      { name: "Research & Development", code: "Research_And_Development" },
      { name: "Other Operating Expenses", code: "Other_Operating_Expenses" },
      { name: "EBITDA", code: "EBITDA" },
      { name: "Depreciation & Amortization", code: "Depreciation_And_Amortization" },
      { name: "EBIT / Operating Profit", code: "EBIT" },
      { name: "Profit Before Tax", code: "Profit_Before_Tax" },
      { name: "Tax", code: "Income_Tax" },
      { name: "Net Profit", code: "Net_Profit" }
    ],
    requiredCategories: [
      "Revenue",
      "Cost of Sales",
      "Operating Expenses",
      "Non-Operating Income / Expense"
    ],
    requiredBranchDatapoints: [
      { name: "Revenue", code: "Revenue" },
      { name: "Cost of Sales", code: "Cost_Of_Sales" },
      { name: "Operating Expenses", code: "Operating_Expenses" },
      { name: "Non-Operating Income / Expense", code: "Non_Operating_Income_Expense" }
    ]
  },
  {
    industry: "gind",
    statement: "cashFlow",
    label: "GIND + Cash Flow",
    requiredLeafDatapoints: [
      { name: "Cash Flow From Operations", code: "Cash_Flow_From_Operations" },
      { name: "Cash Flow From Investing", code: "Cash_Flow_From_Investing" },
      { name: "Cash Flow From Financing", code: "Cash_Flow_From_Financing" },
      { name: "Net Change In Cash", code: "Net_Change_In_Cash" },
      { name: "Cash & Cash Equivalents At Beginning Of Period", code: "Cash_And_Cash_Equivalents_At_Beginning" },
      { name: "Cash & Cash Equivalents At End Of Period", code: "Cash_And_Cash_Equivalents_At_End" }
    ],
    requiredCategories: ["Operating Activities", "Investing Activities", "Financing Activities"]
  },
  {
    industry: "bank",
    statement: "balanceSheet",
    label: "Bank + Balance Sheet",
    requiredLeafDatapoints: [
      { name: "Total Assets", code: "Bank_Total_Assets" },
      { name: "Total Liabilities", code: "Bank_Total_Liabilities" },
      { name: "Total Equity", code: "Bank_Total_Equity" }
    ],
    requiredCategories: ["Assets", "Total Liabilities & Equity", "Liabilities", "Equity"],
    requiredBranchDatapoints: [
      { name: "Total Liabilities & Equity", code: "Bank_Total_Liabilities_And_Equity" }
    ]
  },
  {
    industry: "bank",
    statement: "incomeStatement",
    label: "Bank + Income Statement",
    requiredLeafDatapoints: [
      { name: "Interest Income", code: "Interest_Income" },
      { name: "Interest Expense", code: "Bank_Interest_Expense" },
      { name: "Net Interest Income", code: "Net_Interest_Income" },
      { name: "Profit Before Tax", code: "Profit_Before_Tax" },
      { name: "Tax", code: "Bank_Taxation" },
      { name: "Net Profit", code: "Net_Profit" }
    ],
    requiredCategories: [
      "Non-Interest Income",
      "Credit Loss Expense / Loan Loss Provisions",
      "Operating Expenses"
    ],
    requiredBranchDatapoints: [
      { name: "Non-Interest Income", code: "Non_Interest_Income" },
      { name: "Credit Loss Expense / Loan Loss Provisions", code: "Credit_Loss_Expense" },
      { name: "Operating Expenses", code: "Operating_Expenses" }
    ]
  },
  {
    industry: "bank",
    statement: "cashFlow",
    label: "Bank + Cash Flow",
    requiredLeafDatapoints: [
      { name: "Cash Flow From Operations", code: "Cash_Flow_From_Operations" },
      { name: "Cash Flow From Investing", code: "Cash_Flow_From_Investing" },
      { name: "Cash Flow From Financing", code: "Cash_Flow_From_Financing" },
      { name: "Net Change In Cash", code: "Net_Change_In_Cash" },
      { name: "Cash & Cash Equivalents At Beginning Of Period", code: "Cash_And_Cash_Equivalents_At_Beginning" },
      { name: "Cash & Cash Equivalents At End Of Period", code: "Cash_And_Cash_Equivalents_At_End" }
    ],
    requiredCategories: ["Operating Activities", "Investing Activities", "Financing Activities"]
  }
];

combinations.forEach(combo => {
  selectIndustry(combo.industry);
  selectStatement(combo.statement);

  const container = mockDocument.getElementById("tree-container");
  const renderedLeaves = container.querySelectorAll(".leaf-row");
  const renderedBranches = container.querySelectorAll(".branch-row");

  // Verify all required leaf datapoints exist and have correct name + code
  combo.requiredLeafDatapoints.forEach(expectedLeaf => {
    const found = renderedLeaves.find(leaf => {
      const name = leaf.querySelector(".datapoint-name")?.textContent;
      const code = leaf.querySelector(".datapoint-code")?.textContent;
      return name === expectedLeaf.name && code === `[${expectedLeaf.code}]`;
    });
    assert(found, `Combination ${combo.label} must contain leaf datapoint: ${expectedLeaf.name} [${expectedLeaf.code}]`);
    assert.strictEqual(found.querySelector(".tree-toggle"), null, `Leaf ${expectedLeaf.name} must NOT have a +/- toggle button`);
  });

  // Verify all required category branches exist
  combo.requiredCategories.forEach(expectedCat => {
    const found = renderedBranches.find(br => {
      const label = br.querySelector(".branch-label")?.textContent;
      return label === expectedCat;
    });
    assert(found, `Combination ${combo.label} must contain branch category: ${expectedCat}`);
    assert(found.querySelector(".tree-toggle") !== null, `Branch ${expectedCat} must have a +/- toggle button`);
  });

  // Verify all required branch datapoint codes exist on the branch row beside the toggle
  if (combo.requiredBranchDatapoints) {
    combo.requiredBranchDatapoints.forEach(expectedBranch => {
      const found = renderedBranches.find(br => {
        const label = br.querySelector(".branch-label")?.textContent;
        const code = br.querySelector(".datapoint-code")?.textContent;
        return label === expectedBranch.name && code === `[${expectedBranch.code}]`;
      });
      assert(found, `Combination ${combo.label} must contain branch datapoint: ${expectedBranch.name} [${expectedBranch.code}]`);
      assert(found.querySelector(".tree-toggle") !== null, `Branch ${expectedBranch.name} must have a +/- toggle button`);
    });
  }

  console.log(`✔ Verified ${combo.label}: all subtotals, leaves, categories, and branch datapoints present and correctly tagged`);
});

// 13. Deep Financial Progression and No-Duplication Audit
console.log("=== Running Deep Financial Progression and No-Duplication Audit ===");

// Audit GIND Income Statement specifically:
selectIndustry("gind");
selectStatement("incomeStatement");

const gindIsContainer = mockDocument.getElementById("tree-container");
const gindIsRootUl = gindIsContainer.children[0];

// Expected exact top-to-bottom sequence of GIND IS rows:
const expectedGindIsOrder = [
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
];

const actualGindIsOrder = gindIsRootUl.children.map(li => {
  const b = li.querySelector(".branch-label");
  const l = li.querySelector(".datapoint-name");
  return b ? b.textContent : (l ? l.textContent : "");
});
assert.deepStrictEqual(actualGindIsOrder, expectedGindIsOrder, "GIND IS must match exact 11-step financial flow");

// Verify that D&A appears EXACTLY ONCE in GIND Income Statement:
const allDnaOccurrences = gindIsContainer.querySelectorAll(".leaf-row, .branch-row").filter(row => {
  const name = row.querySelector(".datapoint-name")?.textContent || row.querySelector(".branch-label")?.textContent;
  return name === "Depreciation & Amortization";
});
assert.strictEqual(allDnaOccurrences.length, 1, "Depreciation & Amortization must appear EXACTLY ONCE in GIND Income Statement");

// Verify that D&A is NOT inside Operating Expenses
const gindOpExItem = gindIsRootUl.children[3];
assert.strictEqual(gindOpExItem.querySelector(".branch-label")?.textContent, "Operating Expenses");
const gindOpExSubUl = gindOpExItem.querySelector(".tree-branch");
const gindOpExItems = gindOpExSubUl.children.map(li => li.querySelector(".datapoint-name")?.textContent);
assert.deepStrictEqual(gindOpExItems, [
  "Selling, General & Administrative",
  "Research & Development",
  "Other Operating Expenses"
]);
assert(!gindOpExItems.includes("Depreciation & Amortization"), "D&A must NOT be inside Operating Expenses");

// Verify standalone D&A position: right after EBITDA and before EBIT / Operating Profit
assert.strictEqual(actualGindIsOrder[4], "EBITDA");
assert.strictEqual(actualGindIsOrder[5], "Depreciation & Amortization");
assert.strictEqual(actualGindIsOrder[6], "EBIT / Operating Profit");

// Verify EBIT / Operating Profit is single and unified
const ebitOccurrences = actualGindIsOrder.filter(name => name.includes("EBIT") || name.includes("Operating Profit"));
assert.deepStrictEqual(ebitOccurrences, ["EBITDA", "EBIT / Operating Profit"], "Only EBITDA and unified EBIT / Operating Profit should exist");

// Audit Bank Income Statement flow:
selectIndustry("bank");
selectStatement("incomeStatement");

const bankIsContainer = mockDocument.getElementById("tree-container");
const bankIsRootUl = bankIsContainer.children[0];
const actualBankIsOrder = bankIsRootUl.children.map(li => {
  const b = li.querySelector(".branch-label");
  const l = li.querySelector(".datapoint-name");
  return b ? b.textContent : (l ? l.textContent : "");
});

const expectedBankIsOrder = [
  "Interest Income",
  "Interest Expense",
  "Net Interest Income",
  "Non-Interest Income",
  "Credit Loss Expense / Loan Loss Provisions",
  "Operating Expenses",
  "Profit Before Tax",
  "Tax",
  "Net Profit"
];
assert.deepStrictEqual(actualBankIsOrder, expectedBankIsOrder, "Bank IS must match exact financial flow");

// Audit Balance Sheet flow (GIND & Bank):
selectIndustry("gind");
selectStatement("balanceSheet");
const gindBsContainer = mockDocument.getElementById("tree-container");
const gindBsRoot = gindBsContainer.children[0];
const gindBsAssets = gindBsRoot.children[0];
const gindBsLiabEq = gindBsRoot.children[1];
const gindAssetsKids = gindBsAssets.children[1].children.map(li => li.querySelector(".branch-label, .datapoint-name")?.textContent);
assert.deepStrictEqual(gindAssetsKids, ["Current Assets", "Non-Current Assets", "Total Assets"]);
const gindLiabEqKids = gindBsLiabEq.children[1].children.map(li => li.querySelector(".branch-label, .datapoint-name")?.textContent);
assert.deepStrictEqual(gindLiabEqKids, ["Liabilities", "Equity"]);

// Audit Bank Balance Sheet flow:
selectIndustry("bank");
selectStatement("balanceSheet");
const bankBsContainer = mockDocument.getElementById("tree-container");
const bankBsRoot = bankBsContainer.children[0];
const bankBsAssets = bankBsRoot.children[0];
const bankBsLiabEq = bankBsRoot.children[1];
const bankAssetsKids = bankBsAssets.children[1].children.map(li => li.querySelector(".branch-label, .datapoint-name")?.textContent);
assert.strictEqual(bankAssetsKids[bankAssetsKids.length - 1], "Total Assets");
const bankLiabEqKids = bankBsLiabEq.children[1].children.map(li => li.querySelector(".branch-label, .datapoint-name")?.textContent);
assert.deepStrictEqual(bankLiabEqKids, ["Liabilities", "Equity"]);

// Audit Cash Flow flow (GIND & Bank):
["gind", "bank"].forEach(ind => {
  selectIndustry(ind);
  selectStatement("cashFlow");
  const cfContainer = mockDocument.getElementById("tree-container");
  const cfRoot = cfContainer.children[0];
  const cfKids = cfRoot.children.map(li => li.querySelector(".branch-label, .datapoint-name")?.textContent);
  assert.deepStrictEqual(cfKids, [
    "Operating Activities",
    "Investing Activities",
    "Financing Activities",
    "Net Change In Cash",
    "Cash & Cash Equivalents At Beginning Of Period",
    "Cash & Cash Equivalents At End Of Period"
  ]);

  // Operating activities subtotal
  const opBranch = cfRoot.children[0].querySelector(".tree-branch");
  const opLastChild = opBranch.children[opBranch.children.length - 1];
  assert.strictEqual(opLastChild.querySelector(".datapoint-name")?.textContent, "Cash Flow From Operations");

  // Investing activities subtotal
  const invBranch = cfRoot.children[1].querySelector(".tree-branch");
  const invLastChild = invBranch.children[invBranch.children.length - 1];
  assert.strictEqual(invLastChild.querySelector(".datapoint-name")?.textContent, "Cash Flow From Investing");

  // Financing activities subtotal
  const finBranch = cfRoot.children[2].querySelector(".tree-branch");
  const finLastChild = finBranch.children[finBranch.children.length - 1];
  assert.strictEqual(finLastChild.querySelector(".datapoint-name")?.textContent, "Cash Flow From Financing");
});

console.log("✔ Deep Financial Progression and No-Duplication Audit passed");

// 14. Verify Leaf vs Branch integrity and Expand/Collapse on all combinations
console.log("=== Testing Leaf vs Branch Integrity on all combinations ===");
const allStatements = ["balanceSheet", "incomeStatement", "cashFlow"];
const allIndustries = ["gind", "bank"];

allIndustries.forEach(ind => {
  allStatements.forEach(stmt => {
    selectIndustry(ind);
    selectStatement(stmt);
    const container = mockDocument.getElementById("tree-container");

    const leafRows = container.querySelectorAll(".leaf-row");
    assert(leafRows.length > 0, `Must have leaf rows for ${ind} ${stmt}`);
    leafRows.forEach(row => {
      assert.strictEqual(row.querySelector(".tree-toggle"), null, `Leaf row "${row.textContent}" must NOT have a toggle button`);
      assert(row.querySelector(".tree-spacer") !== null, `Leaf row "${row.textContent}" must have a spacer`);
    });

    const branchRows = container.querySelectorAll(".branch-row");
    assert(branchRows.length > 0, `Must have branch rows for ${ind} ${stmt}`);
    branchRows.forEach(row => {
      assert(row.querySelector(".tree-toggle") !== null, `Branch row "${row.textContent}" must have a toggle button`);
    });

    // Test Expand All on this combination
    expandBtn.click();
    assert.strictEqual(container.querySelectorAll(".tree-branch.collapsed").length, 0, `All branches must be expanded for ${ind} ${stmt}`);

    // Test Collapse All on this combination
    collapseBtn.click();
    assert.strictEqual(container.querySelectorAll(".branch-row.expanded").length, 0, `No branch should be expanded for ${ind} ${stmt}`);
  });
});
console.log("✔ Leaf vs Branch Integrity and Expand/Collapse verified across all combinations");

// 15. Verify Idempotent initTree and No Listener Duplication
console.log("=== Testing Idempotent initTree and Listener Stability ===");
initTree();
initTree();
assert.strictEqual(expandBtn._listeners["click"].length, 1, "Must maintain exactly 1 click listener after multiple initTree calls");
assert.strictEqual(collapseBtn._listeners["click"].length, 1, "Must maintain exactly 1 click listener after multiple initTree calls");
console.log("✔ Idempotent initTree and Listener Stability verified");

// Reset to initial state
selectStatement("balanceSheet");
selectIndustry("gind");

// 16. No-Duplicate Datapoint Code Validation
console.log("=== Running No-Duplicate Datapoint Code Validation ===");

/**
 * Recursively collects all datapoint codes from a data array,
 * and verifies no parent shares its code with a direct child.
 */
function collectCodesAndCheckParentChild(nodes, path) {
  const codes = [];
  for (const node of nodes) {
    const code = node.datapoint || node.code;
    if (code) {
      codes.push({ code, name: node.name, path: path + " > " + node.name });
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      // Check parent vs direct children for same code
      if (code) {
        for (const child of node.children) {
          const childCode = child.datapoint || child.code;
          if (childCode && childCode === code) {
            throw new Error(
              `DUPLICATE: Parent "${node.name}" [${code}] has child "${child.name}" [${childCode}] with the SAME code at ${path}`
            );
          }
        }
      }
      const childCodes = collectCodesAndCheckParentChild(node.children, path + " > " + node.name);
      codes.push(...childCodes);
    }
  }
  return codes;
}

const dataCombinations = [
  { data: financialData.gind.balanceSheet, label: "GIND Balance Sheet" },
  { data: financialData.gind.incomeStatement, label: "GIND Income Statement" },
  { data: financialData.gind.cashFlow, label: "GIND Cash Flow" },
  { data: financialData.bank.balanceSheet, label: "Bank Balance Sheet" },
  { data: financialData.bank.incomeStatement, label: "Bank Income Statement" },
  { data: financialData.bank.cashFlow, label: "Bank Cash Flow" }
];

dataCombinations.forEach(({ data, label }) => {
  const allCodes = collectCodesAndCheckParentChild(data, label);
  const codeValues = allCodes.map(c => c.code);
  const seen = new Set();
  for (const entry of allCodes) {
    assert(
      !seen.has(entry.code),
      `DUPLICATE CODE in ${label}: "${entry.code}" appears more than once (at ${entry.path})`
    );
    seen.add(entry.code);
  }
  console.log(`  ✔ ${label}: ${codeValues.length} unique codes, no duplicates, no parent-child conflicts`);
});

// Verify Total Liabilities & Equity appears only once per BS tree
["gind", "balanceSheet", "bank", "balanceSheet"].forEach((_, idx) => {
  if (idx % 2 !== 0) return;
  const ind = ["gind", "bank"][idx / 2];
  const bsData = financialData[ind].balanceSheet;
  const allCodes = collectCodesAndCheckParentChild(bsData, ind + " BS");
  const tleCount = allCodes.filter(c =>
    c.code === "Total_Liabilities_And_Equity" || c.code === "Bank_Total_Liabilities_And_Equity"
  ).length;
  assert.strictEqual(tleCount, 1, `${ind} BS: Total Liabilities & Equity code must appear exactly once`);
});

// Verify Cash Flow activity sections have NO datapoint codes
["gind", "bank"].forEach(ind => {
  const cfData = financialData[ind].cashFlow;
  const activityNodes = cfData.filter(n =>
    n.name === "Operating Activities" || n.name === "Investing Activities" || n.name === "Financing Activities"
  );
  activityNodes.forEach(node => {
    assert(
      !node.datapoint && !node.code,
      `${ind} CF: "${node.name}" must be a structural grouping with NO datapoint code`
    );
  });
});

// Verify BS grouping nodes (Assets, Liabilities, Equity) have NO datapoint codes
["gind", "bank"].forEach(ind => {
  const bsData = financialData[ind].balanceSheet;
  const assetsNode = bsData.find(n => n.name === "Assets");
  assert(assetsNode, `${ind} BS: Assets node must exist`);
  assert(!assetsNode.datapoint && !assetsNode.code, `${ind} BS: Assets must be structural with NO datapoint code`);

  const tleNode = bsData.find(n => n.name === "Total Liabilities & Equity");
  assert(tleNode, `${ind} BS: Total Liabilities & Equity node must exist`);
  const liabNode = tleNode.children.find(n => n.name === "Liabilities");
  const eqNode = tleNode.children.find(n => n.name === "Equity");
  assert(liabNode, `${ind} BS: Liabilities node must exist`);
  assert(eqNode, `${ind} BS: Equity node must exist`);
  assert(!liabNode.datapoint && !liabNode.code, `${ind} BS: Liabilities must be structural with NO datapoint code`);
  assert(!eqNode.datapoint && !eqNode.code, `${ind} BS: Equity must be structural with NO datapoint code`);
});

console.log("✔ No-Duplicate Datapoint Code Validation passed");

console.log("=== ALL TESTS PASSED SUCCESSFULLY ===");
