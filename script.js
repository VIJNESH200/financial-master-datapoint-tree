// script.js - HOW the application works.
//
// This file has NO data in it. It only contains the application logic:
//   taxonomyData.js = WHAT financial items exist  (the `financialData` variable).
//   definitions.js  = WHAT those items mean       (the `DEFINITIONS` variable).
//   script.js       = HOW the app works           (this file).
//   style.css       = HOW it looks.  index.html   = WHAT is on the page.
//
// Load order in index.html matters: taxonomyData.js and definitions.js
// must load BEFORE this file, because the functions below read the
// `financialData` and `DEFINITIONS` variables they define.


// ========================================
// 1. APP STATE
// ========================================
// Which industry and statement are showing, which node is selected, and the search text.

// State variables tracking selected options
let currentStatement = "balanceSheet";
let currentIndustry = "gind";
let selectedNode = null;
let searchText = "";
let searchQuery = "";

// ========================================
// 2. DISPLAY LABELS
// ========================================
// Human-readable names for the statement and industry keys used in the data.

const STATEMENT_LABELS = {
  balanceSheet: "Balance Sheet",
  incomeStatement: "Income Statement",
  cashFlow: "Cash Flow Statement"
};

const INDUSTRY_LABELS = {
  gind: "GIND",
  bank: "Bank"
};



// ========================================
// 3. COPY TO CLIPBOARD
// ========================================
// Copies a datapoint code (without brackets) and briefly shows "Copied".

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

// ========================================
// 4. DETAIL PANEL
// ========================================
// Fills the right-side panel when a datapoint is clicked: name, code,
// definition, statement, industry, full path, and direct children.

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
  const defText = DEFINITIONS[node.datapoint || node.code] || "Definition not available.";
  getElement("detail-definition").textContent = defText;
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

// ========================================
// 5. DOM HELPERS
// ========================================
// Small utilities for finding elements, clearing them, and updating the footer.

function updateChrome(label) {
  const crumb = getElement("breadcrumb");
  if (crumb) {
    const ind = INDUSTRY_LABELS[currentIndustry] || currentIndustry;
    const stmt = STATEMENT_LABELS[currentStatement] || currentStatement;
    crumb.textContent = selectedNode
      ? ind + " › " + stmt + " › " + selectedNode
      : ind + " › " + stmt;
  }
  const hint = getElement("tree-count");
  if (hint && typeof label !== "undefined") hint.textContent = String(label);
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

// ========================================
// 6. SEARCH
// ========================================
// Matches names AND codes (case-insensitive, partial). While searching,
// matching parents stay visible and auto-expand; clearing restores the tree.

function matchesSearch(item) {
  if (!searchQuery) return true;
  const q = searchQuery.toLowerCase();
  const code = (item.datapoint || item.code || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  return name.includes(q) || code.includes(q);
}

function subtreeHasMatch(item) {
  if (matchesSearch(item)) return true;
  return Array.isArray(item.children) && item.children.some(subtreeHasMatch);
}

function syncSearchUI() {
  const input = getElement("tree-search");
  // Never rewrite the field while the user is typing: that would swallow trailing spaces.
  if (input && document.activeElement !== input && input.value !== searchText) {
    input.value = searchText;
  }
  const clearBtn = getElement("search-clear");
  if (clearBtn) clearBtn.hidden = !searchQuery;
}

function setSearch(value) {
  searchText = String(value == null ? "" : value);
  searchQuery = searchText.trim();
  updateTreeDisplay();
}

function clearSearch() {
  const input = getElement("tree-search");
  if (input) input.value = "";
  setSearch("");
  if (input) input.focus();
}

// ========================================
// 7. TREE RENDERING
// ========================================
// Builds the visible tree. A + / - toggle means ONLY "has children" - a parent
// can still carry its own datapoint code, which renders beside the parent label.

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function highlightText(text) {
  if (!searchQuery) return escapeHtml(text);
  const lower = String(text).toLowerCase();
  const q = searchQuery.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return escapeHtml(text);
  return escapeHtml(text.slice(0, idx)) + "<mark>" + escapeHtml(text.slice(idx, idx + q.length)) + "</mark>" + escapeHtml(text.slice(idx + q.length));
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
    if (searchQuery && !subtreeHasMatch(item)) return;
    const li = document.createElement("li");
    li.className = "tree-item";

    if (item.isSide === "assets") {
      li.classList.add("bs-side", "bs-side-assets");
    } else if (item.isSide === "liabilitiesEquity") {
      li.classList.add("bs-side", "bs-side-liabilities-equity");
    }

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const codeValue = item.datapoint || item.code;
    // While searching, every rendered branch stays expanded so matches and their
    // required parent path are visible. Clearing the search restores the default collapsed state.
    const isSearching = Boolean(searchQuery);

    const row = document.createElement("div");
    row.className = "tree-row " + (hasChildren ? "branch-row" : "leaf-row");
    if (codeValue) row.setAttribute("data-code", codeValue);
    const trail = (parentTrail || []).concat([item]);

    if (hasChildren) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tree-toggle";
      toggle.setAttribute("aria-expanded", isSearching ? "true" : "false");
      toggle.setAttribute("aria-label", `${isSearching ? "Collapse" : "Expand"} ${item.name}`);
      toggle.textContent = isSearching ? "−" : "+";
      if (isSearching) row.classList.add("expanded");

      const label = document.createElement("span");
      label.className = "branch-label";
      label.innerHTML = highlightText(item.name);

      row.appendChild(toggle);
      row.appendChild(label);

      if (codeValue) {
        const code = document.createElement("span");
        code.className = "datapoint-code";
        code.innerHTML = `[${highlightText(codeValue)}]`;
        code.addEventListener("click", (e) => e.stopPropagation());
        row.appendChild(code);
        addCopyButton(row, codeValue);
      }

      li.appendChild(row);

      const childrenContainer = renderTree(item.children, false, trail);
      // Default state is collapsed; search keeps branches open so matches stay reachable.
      if (!searchQuery) childrenContainer.classList.add("collapsed");
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
      name.innerHTML = highlightText(item.name);

      row.appendChild(spacer);
      row.appendChild(name);

      if (codeValue) {
        const code = document.createElement("span");
        code.className = "datapoint-code";
        code.innerHTML = `[${highlightText(codeValue)}]`;
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

// ========================================
// 8. EXPAND / COLLAPSE
// ========================================
// Expand All opens every branch; Collapse All closes every branch.

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

// ========================================
// 9. STATEMENT DISPLAY
// ========================================
// Renders the current statement, the supplementary section, and the footer count.

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

function countMatches(nodes) {
  let n = 0;
  (function walk(list) {
    list.forEach(item => {
      if (matchesSearch(item)) n += 1;
      if (item.children) walk(item.children);
    });
  })(nodes);
  return n;
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

  let label;
  if (searchQuery) {
    label = countMatches(statementData) + " matches";
  } else {
    let count = 0;
    (function countCodes(nodes) {
      nodes.forEach(item => {
        if (item.datapoint || item.code) count += 1;
        if (item.children) countCodes(item.children);
      });
    })(statementData);
    label = count + " datapoints";
  }
  updateChrome(label);

  const suppContainer = getElement("supplementary-container");
  if (suppContainer) renderSupplementaryItems(suppContainer);
  syncSearchUI();
}

// ========================================
// 10. STATEMENT / INDUSTRY SELECTION
// ========================================
// Switching statement or industry re-renders the tree from the data.

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

// ========================================
// 11. BUTTON EVENTS AND INITIALIZATION
// ========================================
// Wires up every button and starts the app once the page is ready.

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

  const searchInput = getElement("tree-search");
  if (searchInput && !searchInput._hasSearchListener) {
    searchInput._hasSearchListener = true;
    searchInput.addEventListener("input", (e) => setSearch(e.target.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchQuery) {
        e.preventDefault();
        clearSearch();
      }
    });
  }

  const clearBtn = getElement("search-clear");
  if (clearBtn && !clearBtn._hasClickListener) {
    clearBtn._hasClickListener = true;
    clearBtn.addEventListener("click", clearSearch);
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
    renderTree,
    initTree,
    selectStatement,
    selectIndustry,
    updateTreeDisplay,
    renderSupplementaryItems,
    buildTaxonomyUI,
    expandAll,
    collapseAll,
    setSearch,
    clearSearch,
    get searchQuery() { return searchQuery; },
    get searchText() { return searchText; },
    get currentStatement() { return currentStatement; },
    set currentStatement(v) { currentStatement = v; },
    get currentIndustry() { return currentIndustry; },
    set currentIndustry(v) { currentIndustry = v; }
  };
}
// Note for beginners: in the browser this file runs AFTER taxonomyData.js and
// definitions.js (see index.html), so it can freely use the `financialData`
// and `DEFINITIONS` variables they define. `module.exports` is only for
// quick Node checks and is ignored by the browser.
