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
  // Older way: a hidden text field plus the classic copy command.
  function fallback() {
    try {
      const field = document.createElement("textarea");
      field.value = text;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
      done(true);
    } catch (e) {
      done(false);
    }
  }
  // Preferred modern way: the clipboard API.
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => done(true), fallback);
  } else {
    fallback();
  }
}

function showCopiedToast(row) {
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
      if (ok) showCopiedToast(row);
    });
  });
  row.appendChild(btn);
}

// ========================================
// 4. DETAIL PANEL
// ========================================
// Fills the right-side panel when a datapoint is clicked: name, code,
// definition, statement, industry, full path, and direct children.

function findItemPath(nodes, code, trail) {
  for (const item of nodes) {
    const itemCode = item.datapoint || item.code;
    const next = trail.concat([item]);
    if (itemCode && itemCode === code) return next;
    if (item.children) {
      const hit = findItemPath(item.children, code, next);
      if (hit) return hit;
    }
  }
  return null;
}

function openDetail(item, trail) {
  selectedNode = item.datapoint || item.code;
  document.querySelectorAll(".tree-row.selected").forEach(row => row.classList.remove("selected"));
  const selectedRow = document.querySelector('.tree-row[data-code="' + selectedNode + '"]');
  if (selectedRow) selectedRow.classList.add("selected");

  document.getElementById("detail-name").textContent = item.name;

  const codeButton = document.getElementById("detail-code");
  codeButton.textContent = "[" + selectedNode + "]";
  codeButton.onclick = () => {
    copyText(selectedNode, (ok) => {
      if (ok) flashElement("detail-copied");
    });
  };

  document.getElementById("detail-statement").textContent = STATEMENT_LABELS[currentStatement] || currentStatement;
  document.getElementById("detail-industry").textContent = INDUSTRY_LABELS[currentIndustry] || currentIndustry;
  document.getElementById("detail-definition").textContent = DEFINITIONS[selectedNode] || "Definition not available.";
  document.getElementById("detail-path").textContent = trail.map(step => step.name).join(" → ");

  const childrenBlock = document.getElementById("detail-children-block");
  const childrenList = document.getElementById("detail-children");
  childrenList.innerHTML = "";

  if (item.children && item.children.length) {
    childrenBlock.hidden = false;
    item.children.forEach(child => {
      const listItem = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "→ " + child.name;
      button.addEventListener("click", () => {
        // Look the child up in the data so the panel also gets its full path.
        const path = findItemPath(
          financialData[currentIndustry][currentStatement],
          child.datapoint || child.code,
          [{ name: STATEMENT_LABELS[currentStatement] || currentStatement }]
        );
        if (path) openDetail(child, path);
      });
      listItem.appendChild(button);
      childrenList.appendChild(listItem);
    });
  } else {
    childrenBlock.hidden = true;
  }

  document.getElementById("detail-panel").hidden = false;
}

function closeDetail() {
  document.getElementById("detail-panel").hidden = true;
  selectedNode = null;
  document.querySelectorAll(".tree-row.selected").forEach(row => row.classList.remove("selected"));
}

// Shows an element for a moment, then hides it again (used for the "Copied" note).
function flashElement(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.hidden = false;
  setTimeout(() => { element.hidden = true; }, 1200);
}

// ========================================
// 5. SEARCH
// ========================================
// Matches names AND codes (case-insensitive, partial). While searching,
// matching parents stay visible and auto-expand; clearing restores the tree.

function matchesSearch(item) {
  if (!searchQuery) return true;
  const query = searchQuery.toLowerCase();
  const code = (item.datapoint || item.code || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  return name.includes(query) || code.includes(query);
}

// True when the item matches itself, or when any item underneath it matches.
function subtreeHasMatch(item) {
  if (matchesSearch(item)) return true;
  return Array.isArray(item.children) && item.children.some(subtreeHasMatch);
}

// Counts items that pass the test, at every level (used for the footer text).
function countNodes(nodes, test) {
  let count = 0;
  nodes.forEach(item => {
    if (test(item)) count += 1;
    if (item.children) count += countNodes(item.children, test);
  });
  return count;
}

function syncSearchUI() {
  const input = document.getElementById("tree-search");
  // Never rewrite the field while the user is typing: that would swallow trailing spaces.
  if (document.activeElement !== input && input.value !== searchText) {
    input.value = searchText;
  }
  document.getElementById("search-clear").hidden = !searchQuery;
}

function setSearch(value) {
  searchText = String(value == null ? "" : value);
  searchQuery = searchText.trim();
  updateTreeDisplay();
}

function clearSearch() {
  const input = document.getElementById("tree-search");
  input.value = "";
  setSearch("");
  input.focus();
}


// ========================================
// 6. TREE RENDERING
// ========================================
// Builds the visible tree. A + / - toggle means ONLY "has children" - a parent
// can still carry its own datapoint code, which renders beside the parent label.

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (character) => ESCAPES[character]);
}

// Returns the label as HTML, wrapping the search match in <mark> when there is one.
function highlightText(text) {
  if (!searchQuery) return escapeHtml(text);
  const matchStart = String(text).toLowerCase().indexOf(searchQuery.toLowerCase());
  if (matchStart < 0) return escapeHtml(text);
  const matchEnd = matchStart + searchQuery.length;
  return escapeHtml(text.slice(0, matchStart)) +
    "<mark>" + escapeHtml(text.slice(matchStart, matchEnd)) + "</mark>" +
    escapeHtml(text.slice(matchEnd));
}

// Adds the blue [datapoint_code] chip plus its copy button, when the item has a code.
function appendCodeChip(row, item) {
  const codeValue = item.datapoint || item.code;
  if (!codeValue) return;
  const chip = document.createElement("span");
  chip.className = "datapoint-code";
  chip.innerHTML = "[" + highlightText(codeValue) + "]";
  chip.addEventListener("click", (e) => e.stopPropagation());
  row.appendChild(chip);
  addCopyButton(row, codeValue);
}

// A row that has children: gets a + / - button, the label, and its child list.
function renderBranchRow(item, row, trail) {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "tree-toggle";
  toggle.textContent = "+";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Expand " + item.name);

  const label = document.createElement("span");
  label.className = "branch-label";
  label.innerHTML = highlightText(item.name);

  row.appendChild(toggle);
  row.appendChild(label);
  appendCodeChip(row, item);

  // Children start collapsed; while searching the whole matched path stays open.
  const childrenBox = renderTree(item.children, false, trail);
  if (!searchQuery) childrenBox.classList.add("collapsed");

  // The + / - button ONLY expands or collapses the children. It never opens the panel.
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const shouldExpand = childrenBox.classList.contains("collapsed");
    childrenBox.classList.toggle("collapsed", !shouldExpand);
    toggle.textContent = shouldExpand ? "−" : "+";
    toggle.setAttribute("aria-expanded", shouldExpand ? "true" : "false");
    toggle.setAttribute("aria-label", (shouldExpand ? "Collapse " : "Expand ") + item.name);
    row.classList.toggle("expanded", shouldExpand);
  });

  // The name label and the datapoint code open the detail panel.
  row.addEventListener("click", (e) => {
    if (e.target.closest(".copy-btn")) return;
    if (e.target.closest(".tree-toggle")) return;
    openDetail(item, [detailRoot()].concat(trail));
  });

  return childrenBox;
}

// A row without children: just the name and the optional datapoint code.
function renderLeafRow(item, row, trail) {
  const spacer = document.createElement("span");
  spacer.className = "tree-spacer";

  const name = document.createElement("span");
  name.className = "datapoint-name";
  name.innerHTML = highlightText(item.name);

  row.appendChild(spacer);
  row.appendChild(name);
  appendCodeChip(row, item);

  row.addEventListener("click", (e) => {
    if (e.target.closest(".copy-btn")) return;
    openDetail(item, [detailRoot()].concat(trail));
  });
}

// The first step of the "Path" shown in the detail panel, e.g. "Income Statement".
function detailRoot() {
  return { name: STATEMENT_LABELS[currentStatement] || currentStatement };
}

function renderTree(items, isBalanceSheetRoot, parentTrail) {
  const ul = document.createElement("ul");
  ul.className = "tree-branch";
  if (isBalanceSheetRoot) ul.classList.add("bs-root-branch");

  items.forEach(item => {
    if (searchQuery && !subtreeHasMatch(item)) return;

    const listItem = document.createElement("li");
    listItem.className = "tree-item";
    if (item.isSide === "assets") listItem.classList.add("bs-side", "bs-side-assets");
    else if (item.isSide === "liabilitiesEquity") listItem.classList.add("bs-side", "bs-side-liabilities-equity");

    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const codeValue = item.datapoint || item.code;
    const trail = (parentTrail || []).concat([item]);

    const row = document.createElement("div");
    row.className = "tree-row " + (hasChildren ? "branch-row" : "leaf-row");
    if (codeValue) row.setAttribute("data-code", codeValue);
    listItem.appendChild(row);

    if (hasChildren) listItem.appendChild(renderBranchRow(item, row, trail));
    else renderLeafRow(item, row, trail);

    ul.appendChild(listItem);
  });

  return ul;
}


// ========================================
// 7. EXPAND / COLLAPSE
// ========================================
// Expand All opens every branch; Collapse All closes every branch.

function setBranchExpanded(item, expanded) {
  const toggle = item.querySelector(".tree-toggle");
  const childrenBox = item.querySelector(".tree-branch");
  if (!toggle || !childrenBox) return;

  childrenBox.classList.toggle("collapsed", !expanded);
  toggle.textContent = expanded ? "−" : "+";
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");

  const row = item.querySelector(".branch-row");
  const label = row ? row.querySelector(".branch-label") : null;
  toggle.setAttribute("aria-label", (expanded ? "Collapse " : "Expand ") + (label ? label.textContent : ""));
  if (row) row.classList.toggle("expanded", expanded);
}

function expandAll() {
  document.getElementById("tree-container").querySelectorAll(".tree-item")
    .forEach(item => setBranchExpanded(item, true));
  document.getElementById("supplementary-container").querySelectorAll(".tree-item")
    .forEach(item => setBranchExpanded(item, true));
}

function collapseAll() {
  document.getElementById("tree-container").querySelectorAll(".tree-item")
    .forEach(item => setBranchExpanded(item, false));
  document.getElementById("supplementary-container").querySelectorAll(".tree-item")
    .forEach(item => setBranchExpanded(item, false));
}

// ========================================
// 8. STATEMENT / INDUSTRY SELECTION
// ========================================
// Switching statement or industry re-renders the tree from the data.

// Renders the "Supplementary Items" section: a small tree with its own expandable heading.
function renderSupplementaryItems() {
  const container = document.getElementById("supplementary-container");
  container.innerHTML = "";

  const suppTree = renderTree([{ name: "Supplementary Items", children: financialData.supplementaryItems }], false);
  suppTree.classList.add("supplementary-tree");
  suppTree.querySelectorAll(".leaf-row").forEach(row => row.classList.add("supplementary-row"));
  container.appendChild(suppTree);
}

// Draws the current industry + statement: the tree, the footer text and the supplementary section.
function updateTreeDisplay() {
  const statementData = financialData[currentIndustry][currentStatement];

  closeDetail();

  const container = document.getElementById("tree-container");
  container.innerHTML = "";
  container.appendChild(renderTree(statementData, currentStatement === "balanceSheet", []));

  const label = searchQuery
    ? countNodes(statementData, matchesSearch) + " matches"
    : countNodes(statementData, item => item.datapoint || item.code) + " datapoints";
  updateFooter(label);

  renderSupplementaryItems();
  syncSearchUI();
}

// Footer: breadcrumb on the left ("GIND › Balance Sheet"), item count on the right.
function updateFooter(label) {
  const industry = INDUSTRY_LABELS[currentIndustry] || currentIndustry;
  const statement = STATEMENT_LABELS[currentStatement] || currentStatement;
  document.getElementById("breadcrumb").textContent = selectedNode
    ? industry + " › " + statement + " › " + selectedNode
    : industry + " › " + statement;
  document.getElementById("tree-count").textContent = String(label);
}

// Highlights the selected button in one of the two toggle groups.
function markActiveButton(groupId, key) {
  document.querySelectorAll("#" + groupId + " .toggle-btn").forEach(btn => {
    const isActive = btn.getAttribute("data-target") === key;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function selectStatement(key) {
  currentStatement = key;
  markActiveButton("statement-toggles", key);
  updateTreeDisplay();
}

function selectIndustry(key) {
  currentIndustry = key;
  markActiveButton("industry-toggles", key);
  updateTreeDisplay();
}


// ========================================
// 9. INITIALIZATION
// ========================================
// Wires up every button and starts the app once the page is ready.

function wireStaticButtons() {
  // All of these buttons already exist in index.html, so each one is wired once.
  document.querySelectorAll("#statement-toggles .toggle-btn").forEach(btn => {
    btn.onclick = () => selectStatement(btn.getAttribute("data-target"));
  });

  document.querySelectorAll("#industry-toggles .toggle-btn").forEach(btn => {
    btn.onclick = () => selectIndustry(btn.getAttribute("data-target"));
  });

  document.getElementById("expand-all-btn").onclick = expandAll;
  document.getElementById("collapse-all-btn").onclick = collapseAll;
  document.getElementById("detail-close").onclick = closeDetail;
  document.getElementById("search-clear").onclick = clearSearch;

  const searchInput = document.getElementById("tree-search");
  searchInput.oninput = (e) => setSearch(e.target.value);
  searchInput.onkeydown = (e) => {
    if (e.key === "Escape" && searchQuery) {
      e.preventDefault();
      clearSearch();
    }
  };
}

function initTree() {
  wireStaticButtons();
  // The starting industry and statement come from the state at the top of this file.
  markActiveButton("industry-toggles", currentIndustry);
  markActiveButton("statement-toggles", currentStatement);
  updateTreeDisplay();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTree);
} else {
  initTree();
}
