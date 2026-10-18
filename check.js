// check.js — checks that the taxonomy and definitions stay in sync.
//
// Run from this folder with: node check.js
// A non-zero exit code means the checker found a problem.

let financialData;
let DEFINITIONS;
let loadError = null;

try {
  ({ financialData } = require("./taxonomyData.js"));
  ({ DEFINITIONS } = require("./definitions.js"));
} catch (error) {
  loadError = error;
}

if (loadError) {
  console.error("ERROR: Could not load taxonomyData.js or definitions.js.");
  console.error(loadError.message);
  process.exitCode = 1;
} else if (!financialData || !DEFINITIONS) {
  console.error("ERROR: The required financialData or DEFINITIONS export is missing.");
  process.exitCode = 1;
} else {
  const occurrencesByCode = new Map();
  let datapointOccurrences = 0;

  // Record each code, display name and location in the taxonomy.
  function visit(items, section) {
    if (!Array.isArray(items)) {
      console.error("ERROR: Expected a list of items at " + section + ".");
      process.exitCode = 1;
      return;
    }

    for (const item of items) {
      if (!item || typeof item !== "object") {
        console.error("ERROR: Found an invalid item at " + section + ".");
        process.exitCode = 1;
        continue;
      }

      const name = typeof item.name === "string" ? item.name : "(unnamed item)";
      const location = section + " > " + name;

      if (typeof item.datapoint === "string" && item.datapoint.trim() !== "") {
        const code = item.datapoint.trim();
        const occurrence = { name, location };
        datapointOccurrences += 1;

        if (!occurrencesByCode.has(code)) {
          occurrencesByCode.set(code, []);
        }
        occurrencesByCode.get(code).push(occurrence);
      } else {
        console.error("ERROR: Missing datapoint code at " + location + ".");
        process.exitCode = 1;
      }

      if (item.children !== undefined) {
        visit(item.children, location);
      }
    }
  }

  // The live taxonomy is grouped by industry, then statement.
  for (const [groupName, groupValue] of Object.entries(financialData)) {
    if (Array.isArray(groupValue)) {
      const label = groupName === "supplementaryItems" ? "Supplementary Items" : groupName;
      visit(groupValue, label);
    } else if (groupValue && typeof groupValue === "object") {
      for (const [statementName, items] of Object.entries(groupValue)) {
        visit(items, groupName + " > " + statementName);
      }
    } else {
      console.error("ERROR: Unexpected taxonomy section: " + groupName + ".");
      process.exitCode = 1;
    }
  }

  const taxonomyCodes = new Set(occurrencesByCode.keys());
  const missingDefinitions = [...taxonomyCodes].filter((code) => {
    return !Object.prototype.hasOwnProperty.call(DEFINITIONS, code) ||
      typeof DEFINITIONS[code] !== "string" ||
      DEFINITIONS[code].trim() === "";
  });
  const unusedDefinitions = Object.keys(DEFINITIONS).filter((code) => !taxonomyCodes.has(code));
  const conflictingCodes = [...occurrencesByCode.entries()].filter(([, occurrences]) => {
    return new Set(occurrences.map((occurrence) => occurrence.name)).size > 1;
  });

  console.log("Financial taxonomy check");
  console.log("========================");
  console.log("Datapoint entries checked: " + datapointOccurrences);
  console.log("Unique datapoint codes: " + taxonomyCodes.size);
  console.log("Definition entries: " + Object.keys(DEFINITIONS).length);

  let issuesFound = process.exitCode === 1;

  if (missingDefinitions.length > 0) {
    issuesFound = true;
    console.error("\nERROR: Taxonomy codes with missing or blank definitions:");
    for (const code of missingDefinitions) {
      console.error("  - " + code);
    }
  }

  if (unusedDefinitions.length > 0) {
    issuesFound = true;
    console.error("\nERROR: Definition keys not used in the taxonomy:");
    for (const code of unusedDefinitions) {
      console.error("  - " + code);
    }
  }

  if (conflictingCodes.length > 0) {
    issuesFound = true;
    console.error("\nERROR: Codes used with different display names:");
    for (const [code, occurrences] of conflictingCodes) {
      console.error("  - " + code);
      for (const occurrence of occurrences) {
        console.error("      " + occurrence.name + " (" + occurrence.location + ")");
      }
    }
  }

  if (issuesFound) {
    console.error("\nFAILED: Fix the issues above, then run node check.js again.");
    process.exitCode = 1;
  } else {
    console.log("\nPASS: Every code has a definition; no unused definitions or conflicting code names were found.");
    console.log("Note: Reusing a code for the same display name in multiple places is allowed.");
    process.exitCode = 0;
  }
}
