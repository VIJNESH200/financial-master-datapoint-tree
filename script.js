// Standardized Financial Master Datapoint Data Structure
// Hierarchies organized by Industry -> Financial Statement
const financialData = {
  gind: {
    balanceSheet: [
      {
        name: "Assets",
        datapoint: "Total_Assets",
        isSide: "assets",
        children: [
          {
            name: "Current Assets",
            datapoint: "Current_Assets",
            children: [
              { name: "Cash & Cash Equivalents", datapoint: "Cash_And_Cash_Equivalents" },
              { name: "Accounts Receivable", datapoint: "Accounts_Receivable" },
              { name: "Inventory", datapoint: "Inventory" },
              { name: "Other Current Assets", datapoint: "Other_Current_Assets" }
            ]
          },
          {
            name: "Non-Current Assets",
            datapoint: "Non_Current_Assets",
            children: [
              { name: "Property, Plant & Equipment", datapoint: "Property_Plant_Equipment" },
              {
                name: "Intangible Assets",
                datapoint: "Intangible_Assets",
                children: [
                  { name: "Goodwill", datapoint: "Goodwill" },
                  { name: "Other Intangible Assets", datapoint: "Other_Intangible_Assets" }
                ]
              },
              { name: "Other Non-Current Assets", datapoint: "Other_Non_Current_Assets" }
            ]
          }
        ]
      },
      {
        name: "Total Liabilities & Equity",
        isSide: "liabilitiesEquity",
        datapoint: "Total_Liabilities_And_Equity",
        children: [
          {
            name: "Liabilities",
            datapoint: "Total_Liabilities",
            children: [
              {
                name: "Current Liabilities",
                datapoint: "Current_Liabilities",
                children: [
                  { name: "Accounts Payable", datapoint: "Accounts_Payable" },
                  { name: "Short-Term Debt", datapoint: "Short_Term_Debt" },
                  { name: "Other Current Liabilities", datapoint: "Other_Current_Liabilities" }
                ]
              },
              {
                name: "Non-Current Liabilities",
                datapoint: "Non_Current_Liabilities",
                children: [
                  { name: "Long-Term Debt", datapoint: "Long_Term_Debt" },
                  { name: "Deferred Tax Liabilities", datapoint: "Deferred_Tax_Liabilities" },
                  { name: "Other Non-Current Liabilities", datapoint: "Other_Non_Current_Liabilities" }
                ]
              }
            ]
          },
          {
            name: "Equity",
            datapoint: "Total_Equity",
            children: [
              { name: "Share Capital", datapoint: "Share_Capital" },
              { name: "Retained Earnings", datapoint: "Retained_Earnings" },
              { name: "Other Equity", datapoint: "Other_Equity" }
            ]
          }
        ]
      }
    ],
    incomeStatement: [
      {
        name: "Revenue",
        datapoint: "Revenue",
        children: [
          { name: "Product / Service Revenue", datapoint: "Product_Service_Revenue" },
          { name: "Other Operating Revenue", datapoint: "Other_Operating_Revenue" }
        ]
      },
      {
        name: "Cost of Sales",
        datapoint: "Cost_Of_Sales",
        children: [
          { name: "Cost of Goods Sold", datapoint: "Cost_Of_Goods_Sold" },
          { name: "Other Cost of Sales", datapoint: "Other_Cost_Of_Sales" }
        ]
      },
      { name: "Gross Profit", datapoint: "Gross_Profit" },
      {
        name: "Operating Expenses",
        datapoint: "Operating_Expenses",
        children: [
          { name: "Selling, General & Administrative", datapoint: "Selling_General_Administrative" },
          { name: "Research & Development", datapoint: "Research_And_Development" },
          { name: "Other Operating Expenses", datapoint: "Other_Operating_Expenses" }
        ]
      },
      { name: "EBITDA", datapoint: "EBITDA" },
      { name: "Depreciation & Amortization", datapoint: "Depreciation_And_Amortization" },
      { name: "EBIT / Operating Profit", datapoint: "EBIT" },
      {
        name: "Non-Operating Income / Expense",
        datapoint: "Non_Operating_Income_Expense",
        children: [
          { name: "Interest Income", datapoint: "Interest_Income" },
          { name: "Interest Expense", datapoint: "Interest_Expense" },
          { name: "Other Non-Operating Income / Expense", datapoint: "Other_Non_Operating_Income_Expense" }
        ]
      },
      { name: "Profit Before Tax", datapoint: "Profit_Before_Tax" },
      { name: "Tax", datapoint: "Income_Tax" },
      { name: "Net Profit", datapoint: "Net_Profit" }
    ],
    cashFlow: [
      {
        name: "Cash Flow From Operations",
        datapoint: "Cash_Flow_From_Operations",
        children: [
          { name: "Net Income", datapoint: "Net_Income" },
          { name: "Depreciation & Amortization", datapoint: "Depreciation_And_Amortization" },
          { name: "Changes In Working Capital", datapoint: "Changes_In_Working_Capital" },
          { name: "Other Operating Adjustments", datapoint: "Other_Operating_Adjustments" }
        ]
      },
      {
        name: "Cash Flow From Investing",
        datapoint: "Cash_Flow_From_Investing",
        children: [
          { name: "Capital Expenditure", datapoint: "Capital_Expenditure" },
          { name: "Acquisitions", datapoint: "Acquisitions" },
          { name: "Investments", datapoint: "Investments" },
          { name: "Other Investing Activities", datapoint: "Other_Investing_Activities" }
        ]
      },
      {
        name: "Cash Flow From Financing",
        datapoint: "Cash_Flow_From_Financing",
        children: [
          { name: "Debt Issuance", datapoint: "Debt_Issuance" },
          { name: "Debt Repayment", datapoint: "Debt_Repayment" },
          { name: "Share Issuance", datapoint: "Share_Issuance" },
          { name: "Share Buybacks", datapoint: "Share_Buybacks" },
          { name: "Dividends", datapoint: "Dividends" },
          { name: "Other Financing Activities", datapoint: "Other_Financing_Activities" }
        ]
      },
      { name: "Net Change In Cash", datapoint: "Net_Change_In_Cash" },
      { name: "Cash & Cash Equivalents At Beginning Of Period", datapoint: "Cash_And_Cash_Equivalents_At_Beginning" },
      { name: "Cash & Cash Equivalents At End Of Period", datapoint: "Cash_And_Cash_Equivalents_At_End" }
    ]
  },

  bank: {
    balanceSheet: [
      {
        name: "Assets",
        datapoint: "Bank_Total_Assets",
        isSide: "assets",
        children: [
          { name: "Cash & Balances with Central Banks", datapoint: "Cash_Balances_Central_Banks" },
          { name: "Loans & Advances to Banks", datapoint: "Loans_Advances_Banks" },
          { name: "Loans & Advances to Customers", datapoint: "Loans_Advances_Customers" },
          { name: "Investment Securities", datapoint: "Investment_Securities" },
          { name: "Derivative Financial Assets", datapoint: "Derivative_Financial_Assets" },
          { name: "Property and Equipment", datapoint: "Bank_Property_Equipment" },
          { name: "Other Bank Assets", datapoint: "Other_Bank_Assets" }
        ]
      },
      {
        name: "Total Liabilities & Equity",
        isSide: "liabilitiesEquity",
        datapoint: "Bank_Total_Liabilities_And_Equity",
        children: [
          {
            name: "Liabilities",
            datapoint: "Bank_Total_Liabilities",
            children: [
              { name: "Deposits from Banks", datapoint: "Deposits_From_Banks" },
              { name: "Customer Accounts & Deposits", datapoint: "Customer_Deposits" },
              { name: "Debt Securities in Issue", datapoint: "Debt_Securities_Issued" },
              { name: "Derivative Financial Liabilities", datapoint: "Derivative_Financial_Liabilities" },
              { name: "Subordinated Debt", datapoint: "Subordinated_Debt" },
              { name: "Other Bank Liabilities", datapoint: "Other_Bank_Liabilities" }
            ]
          },
          {
            name: "Equity",
            datapoint: "Bank_Total_Equity",
            children: [
              { name: "Share Capital", datapoint: "Bank_Share_Capital" },
              { name: "Retained Earnings", datapoint: "Bank_Retained_Earnings" },
              { name: "Reserves & Other Equity", datapoint: "Bank_Reserves" }
            ]
          }
        ]
      }
    ],
    incomeStatement: [
      { name: "Interest Income", datapoint: "Interest_Income" },
      { name: "Interest Expense", datapoint: "Bank_Interest_Expense" },
      { name: "Net Interest Income", datapoint: "Net_Interest_Income" },
      {
        name: "Non-Interest Income",
        datapoint: "Non_Interest_Income",
        children: [
          { name: "Fees & Commissions", datapoint: "Net_Fee_Commission_Income" },
          { name: "Trading Income", datapoint: "Trading_Fair_Value_Income" },
          { name: "Other Non-Interest Income", datapoint: "Bank_Other_Operating_Income" }
        ]
      },
      {
        name: "Credit Loss Expense / Loan Loss Provisions",
        datapoint: "Credit_Loss_Expense",
        children: [
          { name: "Loan Loss Provisions", datapoint: "Loan_Loss_Provisions" },
          { name: "Impairment Charges", datapoint: "Credit_Impairment_Charges" }
        ]
      },
      {
        name: "Operating Expenses",
        datapoint: "Operating_Expenses",
        children: [
          { name: "Staff Expenses", datapoint: "Staff_Expenses" },
          { name: "Administrative Expenses", datapoint: "Administrative_Expenses" },
          { name: "Other Operating Expenses", datapoint: "Other_Operating_Expenses" }
        ]
      },
      { name: "Profit Before Tax", datapoint: "Profit_Before_Tax" },
      { name: "Tax", datapoint: "Bank_Taxation" },
      { name: "Net Profit", datapoint: "Net_Profit" }
    ],
    cashFlow: [
      {
        name: "Cash Flow From Operations",
        datapoint: "Cash_Flow_From_Operations",
        children: [
          { name: "Operating Profit Before Tax", datapoint: "Bank_CF_Operating_Profit" },
          { name: "Adjustments for Non-Cash Items", datapoint: "Bank_CF_Non_Cash_Adjustments" },
          { name: "Change in Loans & Advances", datapoint: "Bank_CF_Change_In_Loans" },
          { name: "Change in Customer Deposits", datapoint: "Bank_CF_Change_In_Deposits" }
        ]
      },
      {
        name: "Cash Flow From Investing",
        datapoint: "Cash_Flow_From_Investing",
        children: [
          { name: "Purchase of Investment Securities", datapoint: "Bank_CF_Investment_Securities_Purchase" },
          { name: "Proceeds from Investment Securities", datapoint: "Bank_CF_Investment_Securities_Proceeds" },
          { name: "Capital Expenditure on Fixed Assets", datapoint: "Bank_CF_Capex" }
        ]
      },
      {
        name: "Cash Flow From Financing",
        datapoint: "Cash_Flow_From_Financing",
        children: [
          { name: "Issuance of Subordinated Debt", datapoint: "Bank_CF_Subordinated_Debt_Issued" },
          { name: "Repayment of Subordinated Debt", datapoint: "Bank_CF_Subordinated_Debt_Repaid" },
          { name: "Dividends Paid", datapoint: "Bank_CF_Dividends_Paid" }
        ]
      },
      { name: "Net Change In Cash", datapoint: "Net_Change_In_Cash" },
      { name: "Cash & Cash Equivalents At Beginning Of Period", datapoint: "Cash_And_Cash_Equivalents_At_Beginning" },
      { name: "Cash & Cash Equivalents At End Of Period", datapoint: "Cash_And_Cash_Equivalents_At_End" }
    ]
  },

  supplementaryItems: [
    { name: "Earnings Per Share", datapoint: "EPS" },
    { name: "Diluted Earnings Per Share", datapoint: "Diluted_EPS" },
    { name: "Dividend Per Share", datapoint: "DPS" },
    { name: "Book Value Per Share", datapoint: "Book_Value_Per_Share" },
    { name: "Tangible Book Value Per Share", datapoint: "Tangible_Book_Value_Per_Share" },
    { name: "Weighted Average Shares Outstanding", datapoint: "Weighted_Average_Shares_Outstanding" },
    { name: "Diluted Weighted Average Shares Outstanding", datapoint: "Diluted_Weighted_Average_Shares_Outstanding" },
    { name: "Dividend Payout", datapoint: "Dividend_Payout" }
  ]
};

// State variables tracking selected options
let currentStatement = "balanceSheet";
let currentIndustry = "gind";
let selectedNode = null;

const STATEMENT_LABELS = {
  balanceSheet: "Balance Sheet",
  incomeStatement: "Income Statement",
  cashFlow: "Cash Flow Statement"
};

const INDUSTRY_LABELS = {
  gind: "GIND",
  bank: "Bank"
};

const COPY_ICON_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.5"></rect><path d="M11 5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5.5A1.5 1.5 0 0 0 4 11h1"></path></svg>';

function copyText(text, done) {
  function fallback() {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done(true);
    } catch (e) {
      done(false);
    }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => done(true), fallback);
  } else {
    fallback();
  }
}

function showRowToast(row) {
  const old = row.querySelector(".copy-toast");
  if (old) old.remove();
  const toast = document.createElement("span");
  toast.className = "copy-toast";
  toast.textContent = "Copied";
  row.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

function addCopyButton(row, code) {
  if (!code || row.querySelector(".copy-btn")) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.title = "Copy " + code;
  btn.setAttribute("aria-label", "Copy datapoint code " + code);
  btn.innerHTML = COPY_ICON_SVG;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    copyText(code, (ok) => {
      if (ok) showRowToast(row);
    });
  });
  row.appendChild(btn);
}

function findPath(nodes, code, trail) {
  for (const node of nodes) {
    const nodeCode = node.datapoint || node.code;
    const next = trail.concat([node]);
    if (nodeCode && nodeCode === code) return next;
    if (node.children) {
      const hit = findPath(node.children, code, next);
      if (hit) return hit;
    }
  }
  return null;
}

function openDetail(node, trail) {
  const panel = getElement("detail-panel");
  if (!panel) return;
  selectedNode = node.datapoint || node.code;
  document.querySelectorAll(".tree-row.selected").forEach(r => r.classList.remove("selected"));
  const row = document.querySelector('.tree-row[data-code="' + selectedNode + '"]');
  if (row) row.classList.add("selected");

  getElement("detail-name").textContent = node.name;
  const codeBtn = getElement("detail-code");
  codeBtn.textContent = "[" + (node.datapoint || node.code) + "]";
  codeBtn.onclick = () => {
    copyText(node.datapoint || node.code, (ok) => {
      const el = getElement("detail-copied");
      if (ok && el) {
        el.hidden = false;
        setTimeout(() => { el.hidden = true; }, 1200);
      }
    });
  };
  getElement("detail-statement").textContent = STATEMENT_LABELS[currentStatement] || currentStatement;
  getElement("detail-industry").textContent = INDUSTRY_LABELS[currentIndustry] || currentIndustry;
  getElement("detail-path").textContent = trail.map(n => n.name).join(" → ");

  const block = getElement("detail-children-block");
  const list = getElement("detail-children");
  list.innerHTML = "";
  if (node.children && node.children.length) {
    block.hidden = false;
    node.children.forEach(child => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "→ " + child.name;
      b.addEventListener("click", () => {
        const full = findPath(financialData[currentIndustry][currentStatement], child.datapoint || child.code, [{ name: STATEMENT_LABELS[currentStatement] || currentStatement }]);
        if (full) openDetail(child, full);
      });
      li.appendChild(b);
      list.appendChild(li);
    });
  } else {
    block.hidden = true;
  }
  panel.hidden = false;
}

function closeDetail() {
  const panel = getElement("detail-panel");
  if (panel) panel.hidden = true;
  selectedNode = null;
  document.querySelectorAll(".tree-row.selected").forEach(r => r.classList.remove("selected"));
}

function updateChrome(count) {
  const crumb = getElement("breadcrumb");
  if (crumb) {
    const ind = INDUSTRY_LABELS[currentIndustry] || currentIndustry;
    const stmt = STATEMENT_LABELS[currentStatement] || currentStatement;
    crumb.textContent = selectedNode
      ? ind + " › " + stmt + " › " + selectedNode
      : ind + " › " + stmt;
  }
  const hint = getElement("tree-count");
  if (hint && typeof count === "number") hint.textContent = count + " datapoints";
}

function getElement(id) {
  if (typeof document !== "undefined") {
    if (typeof document.getElementById === "function") {
      const el = document.getElementById(id);
      if (el) return el;
    }
    const root = typeof document.getElementById === "function" ? document.getElementById("tree-root") : null;
    if (root && typeof root.querySelector === "function") {
      return root.querySelector("#" + id);
    }
  }
  return null;
}

function getElements(selector) {
  if (typeof document !== "undefined") {
    if (typeof document.querySelectorAll === "function") {
      const res = document.querySelectorAll(selector);
      if (res && res.length > 0) return Array.from(res);
    }
    const root = typeof document.getElementById === "function" ? document.getElementById("tree-root") : null;
    if (root) {
      if (selector.includes(" ")) {
        const parts = selector.split(/\s+/);
        let current = [root];
        for (const part of parts) {
          let next = [];
          for (const el of current) {
            if (part.startsWith("#")) {
              const found = el.id === part.slice(1) ? el : (el.querySelector ? el.querySelector(part) : null);
              if (found) next.push(found);
            } else if (part.startsWith(".")) {
              const found = el.querySelectorAll ? el.querySelectorAll(part) : [];
              next = next.concat(found);
            }
          }
          current = next;
        }
        return current;
      } else if (typeof root.querySelectorAll === "function") {
        return Array.from(root.querySelectorAll(selector));
      }
    }
  }
  return [];
}

function clearElement(element) {
  if (!element) return;
  if (typeof element.replaceChildren === "function") {
    element.replaceChildren();
  } else {
    while (element.children && element.children.length > 0) {
      if (typeof element.removeChild === "function") {
        element.removeChild(element.children[0]);
      } else {
        element.children.shift();
      }
    }
    if (element.childNodes) {
      element.childNodes = [];
    }
  }
}

function renderTree(items, isBalanceSheetRoot = false, parentTrail) {
  const ul = document.createElement("ul");
  ul.className = "tree-branch";

  const list = Array.isArray(items)
    ? items
    : (items && Array.isArray(items.children) ? items.children : []);

  if (isBalanceSheetRoot) {
    ul.classList.add("bs-root-branch");
  }

  list.forEach(item => {
    const li = document.createElement("li");
    li.className = "tree-item";

    if (item.isSide === "assets") {
      li.classList.add("bs-side", "bs-side-assets");
    } else if (item.isSide === "liabilitiesEquity") {
      li.classList.add("bs-side", "bs-side-liabilities-equity");
    }

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const codeValue = item.datapoint || item.code;

    const row = document.createElement("div");
    row.className = "tree-row " + (hasChildren ? "branch-row" : "leaf-row");
    if (codeValue) row.setAttribute("data-code", codeValue);
    const trail = (parentTrail || []).concat([item]);

    if (hasChildren) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tree-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", `Expand ${item.name}`);
      toggle.textContent = "+";

      const label = document.createElement("span");
      label.className = "branch-label";
      label.textContent = item.name;

      row.appendChild(toggle);
      row.appendChild(label);

      if (codeValue) {
        const code = document.createElement("span");
        code.className = "datapoint-code";
        code.textContent = `[${codeValue}]`;
        code.addEventListener("click", (e) => e.stopPropagation());
        row.appendChild(code);
        addCopyButton(row, codeValue);
      }

      li.appendChild(row);

      const childrenContainer = renderTree(item.children, false, trail);
      childrenContainer.classList.add("collapsed");
      li.appendChild(childrenContainer);

      row.addEventListener("click", (e) => {
        if (e.target.closest(".copy-btn")) return;
        if (e.target.closest(".datapoint-code")) {
          openDetail(item, [{ name: STATEMENT_LABELS[currentStatement] || currentStatement }].concat(trail));
          return;
        }
        const isCollapsed = childrenContainer.classList.contains("collapsed");
        childrenContainer.classList.toggle("collapsed");
        toggle.textContent = isCollapsed ? "−" : "+";
        toggle.setAttribute("aria-expanded", isCollapsed ? "true" : "false");
        toggle.setAttribute("aria-label", `${isCollapsed ? "Collapse" : "Expand"} ${item.name}`);
        row.classList.toggle("expanded", isCollapsed);
      });
    } else {
      const spacer = document.createElement("span");
      spacer.className = "tree-spacer";

      const name = document.createElement("span");
      name.className = "datapoint-name";
      name.textContent = item.name;

      row.appendChild(spacer);
      row.appendChild(name);

      if (codeValue) {
        const code = document.createElement("span");
        code.className = "datapoint-code";
        code.textContent = `[${codeValue}]`;
        row.appendChild(code);
        addCopyButton(row, codeValue);
      }

      li.appendChild(row);
      row.addEventListener("click", (e) => {
        if (e.target.closest(".copy-btn")) return;
        openDetail(item, [{ name: STATEMENT_LABELS[currentStatement] || currentStatement }].concat(trail));
      });
    }

    ul.appendChild(li);
  });

  return ul;
}

function expandAll() {
  const container = getElement("tree-container") || getElement("statement-tree");
  const suppContainer = getElement("supplementary-container");
  const rootContainers = [];
  if (container) rootContainers.push(container);
  if (suppContainer) rootContainers.push(suppContainer);

  rootContainers.forEach(root => {
    const branchItems = root.querySelectorAll ? root.querySelectorAll(".tree-item") : [];
    branchItems.forEach(item => {
      const toggle = item.querySelector ? item.querySelector(".tree-toggle") : null;
      const subBranch = item.querySelector ? item.querySelector(".tree-branch") : null;
      const branchRow = item.querySelector ? item.querySelector(".branch-row") : null;
      if (toggle && subBranch) {
        subBranch.classList.remove("collapsed");
        toggle.textContent = "−";
        toggle.setAttribute("aria-expanded", "true");
        const label = branchRow ? branchRow.querySelector(".branch-label") : null;
        const name = label ? label.textContent : "";
        toggle.setAttribute("aria-label", `Collapse ${name}`);
        if (branchRow) branchRow.classList.add("expanded");
      }
    });
  });
}

function collapseAll() {
  const container = getElement("tree-container") || getElement("statement-tree");
  const suppContainer = getElement("supplementary-container");
  const rootContainers = [];
  if (container) rootContainers.push(container);
  if (suppContainer) rootContainers.push(suppContainer);

  rootContainers.forEach(root => {
    const branchItems = root.querySelectorAll ? root.querySelectorAll(".tree-item") : [];
    branchItems.forEach(item => {
      const toggle = item.querySelector ? item.querySelector(".tree-toggle") : null;
      const subBranch = item.querySelector ? item.querySelector(".tree-branch") : null;
      const branchRow = item.querySelector ? item.querySelector(".branch-row") : null;
      if (toggle && subBranch) {
        subBranch.classList.add("collapsed");
        toggle.textContent = "+";
        toggle.setAttribute("aria-expanded", "false");
        const label = branchRow ? branchRow.querySelector(".branch-label") : null;
        const name = label ? label.textContent : "";
        toggle.setAttribute("aria-label", `Expand ${name}`);
        if (branchRow) branchRow.classList.remove("expanded");
      }
    });
  });
}

function renderSupplementaryItems(container) {
  if (!container || !financialData.supplementaryItems) return;
  clearElement(container);

  const suppTreeData = [
    {
      name: "Supplementary Items",
      children: financialData.supplementaryItems
    }
  ];

  const suppTree = renderTree(suppTreeData, false);
  suppTree.classList.add("supplementary-tree");

  const leafRows = suppTree.querySelectorAll ? Array.from(suppTree.querySelectorAll(".leaf-row")) : [];
  leafRows.forEach(row => row.classList.add("supplementary-row"));

  container.appendChild(suppTree);
}

function updateTreeDisplay() {
  const container = getElement("tree-container") || getElement("statement-tree");
  if (!container) return;

  const industryData = financialData[currentIndustry];
  if (!industryData) return;

  const statementData = industryData[currentStatement];
  if (!statementData) return;

  closeDetail();
  clearElement(container);

  const isBalanceSheet = currentStatement === "balanceSheet";
  const tree = renderTree(statementData, isBalanceSheet, []);
  container.appendChild(tree);

  let count = 0;
  (function countCodes(nodes) {
    nodes.forEach(n => {
      if (n.datapoint || n.code) count += 1;
      if (n.children) countCodes(n.children);
    });
  })(statementData);
  updateChrome(count);

  const suppContainer = getElement("supplementary-container");
  if (suppContainer) renderSupplementaryItems(suppContainer);
}

function selectStatement(key, render = true) {
  currentStatement = key;

  const buttons = getElements("#statement-toggles .toggle-btn");
  buttons.forEach(btn => {
    const isTarget = btn.getAttribute("data-target") === key;
    if (btn.classList) {
      if (isTarget) btn.classList.add("active");
      else btn.classList.remove("active");
    }
    if (typeof btn.setAttribute === "function") {
      btn.setAttribute("aria-selected", isTarget ? "true" : "false");
    }
  });

  if (render) updateTreeDisplay();
}

function selectIndustry(key, render = true) {
  currentIndustry = key;

  const buttons = getElements("#industry-toggles .toggle-btn");
  buttons.forEach(btn => {
    const isTarget = btn.getAttribute("data-target") === key;
    if (btn.classList) {
      if (isTarget) btn.classList.add("active");
      else btn.classList.remove("active");
    }
    if (typeof btn.setAttribute === "function") {
      btn.setAttribute("aria-selected", isTarget ? "true" : "false");
    }
  });

  if (render) updateTreeDisplay();
}

function buildTaxonomyUI(treeRoot) {
  clearElement(treeRoot);

  const selectorsContainer = document.createElement("div");
  selectorsContainer.className = "selectors-container";

  const stmtGroup = document.createElement("div");
  stmtGroup.className = "selector-group";

  const stmtLabel = document.createElement("div");
  stmtLabel.className = "selector-label";
  stmtLabel.textContent = "FINANCIAL STATEMENT";
  stmtGroup.appendChild(stmtLabel);

  const stmtToggles = document.createElement("div");
  stmtToggles.className = "toggle-group";
  stmtToggles.id = "statement-toggles";
  stmtToggles.setAttribute("role", "tablist");
  stmtToggles.setAttribute("aria-label", "Financial Statement");

  const stmtOptions = [
    { key: "balanceSheet", label: "Balance Sheet" },
    { key: "incomeStatement", label: "Income Statement" },
    { key: "cashFlow", label: "Cash Flow Statement" }
  ];

  stmtOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toggle-btn" + (opt.key === currentStatement ? " active" : "");
    btn.setAttribute("data-target", opt.key);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", opt.key === currentStatement ? "true" : "false");
    btn.textContent = opt.label;
    btn._hasToggleListener = true;
    btn.addEventListener("click", () => selectStatement(opt.key));
    stmtToggles.appendChild(btn);
  });

  stmtGroup.appendChild(stmtToggles);
  selectorsContainer.appendChild(stmtGroup);

  const indGroup = document.createElement("div");
  indGroup.className = "selector-group";

  const indLabel = document.createElement("div");
  indLabel.className = "selector-label";
  indLabel.textContent = "INDUSTRY";
  indGroup.appendChild(indLabel);

  const indToggles = document.createElement("div");
  indToggles.className = "toggle-group";
  indToggles.id = "industry-toggles";
  indToggles.setAttribute("role", "tablist");
  indToggles.setAttribute("aria-label", "Industry");

  const indOptions = [
    { key: "gind", label: "GIND" },
    { key: "bank", label: "Bank" }
  ];

  indOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toggle-btn" + (opt.key === currentIndustry ? " active" : "");
    btn.setAttribute("data-target", opt.key);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", opt.key === currentIndustry ? "true" : "false");
    btn.textContent = opt.label;
    btn._hasToggleListener = true;
    btn.addEventListener("click", () => selectIndustry(opt.key));
    indToggles.appendChild(btn);
  });

  indGroup.appendChild(indToggles);
  selectorsContainer.appendChild(indGroup);
  treeRoot.appendChild(selectorsContainer);

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "tree-controls";

  const expandBtn = document.createElement("button");
  expandBtn.type = "button";
  expandBtn.className = "action-btn";
  expandBtn.id = "expand-all-btn";
  expandBtn.textContent = "Expand All";
  expandBtn._hasClickListener = true;
  expandBtn.addEventListener("click", expandAll);
  controlsDiv.appendChild(expandBtn);

  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = "action-btn";
  collapseBtn.id = "collapse-all-btn";
  collapseBtn.textContent = "Collapse All";
  collapseBtn._hasClickListener = true;
  collapseBtn.addEventListener("click", collapseAll);
  controlsDiv.appendChild(collapseBtn);

  treeRoot.appendChild(controlsDiv);

  const treeContainer = document.createElement("div");
  treeContainer.id = "tree-container";
  treeContainer.className = "tree-display";
  treeContainer.setAttribute("role", "region");
  treeContainer.setAttribute("aria-label", "Datapoint Hierarchy");
  treeRoot.appendChild(treeContainer);

  const suppContainer = document.createElement("div");
  suppContainer.id = "supplementary-container";
  suppContainer.className = "supplementary-section";
  suppContainer.setAttribute("role", "region");
  suppContainer.setAttribute("aria-label", "Supplementary Items");
  treeRoot.appendChild(suppContainer);
}

function initTree() {
  let treeContainer = getElement("tree-container") || getElement("statement-tree");

  if (!treeContainer) {
    const treeRoot = getElement("tree-root");
    if (treeRoot) {
      buildTaxonomyUI(treeRoot);
      treeContainer = getElement("tree-container");
    }
  }

  const statementBtns = getElements("#statement-toggles .toggle-btn");
  statementBtns.forEach(btn => {
    if (!btn._hasToggleListener) {
      btn._hasToggleListener = true;
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        selectStatement(target);
      });
    }
  });

  const industryBtns = getElements("#industry-toggles .toggle-btn");
  industryBtns.forEach(btn => {
    if (!btn._hasToggleListener) {
      btn._hasToggleListener = true;
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        selectIndustry(target);
      });
    }
  });

  const expandBtn = getElement("expand-all-btn");
  if (expandBtn && !expandBtn._hasClickListener) {
    expandBtn._hasClickListener = true;
    expandBtn.addEventListener("click", expandAll);
  }

  const collapseBtn = getElement("collapse-all-btn");
  if (collapseBtn && !collapseBtn._hasClickListener) {
    collapseBtn._hasClickListener = true;
    collapseBtn.addEventListener("click", collapseAll);
  }

  const closeBtn = getElement("detail-close");
  if (closeBtn && !closeBtn._hasClickListener) {
    closeBtn._hasClickListener = true;
    closeBtn.addEventListener("click", closeDetail);
  }

  selectIndustry("gind", false);
  selectStatement("balanceSheet", true);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTree);
  } else {
    initTree();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    financialData,
    renderTree,
    initTree,
    selectStatement,
    selectIndustry,
    updateTreeDisplay,
    renderSupplementaryItems,
    buildTaxonomyUI,
    expandAll,
    collapseAll,
    get currentStatement() { return currentStatement; },
    set currentStatement(v) { currentStatement = v; },
    get currentIndustry() { return currentIndustry; },
    set currentIndustry(v) { currentIndustry = v; }
  };
}
