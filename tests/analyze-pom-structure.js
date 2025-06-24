import { JaceAISitePOM } from './jace-ai-site.pom.js';

// Create a dummy page object to access the POM structure
const dummyPage = {
  goto: () => {},
  viewport: () => ({ width: 1200, height: 800 }),
};
const pom = new JaceAISitePOM(dummyPage);

console.log('=== POM STRUCTURE ANALYSIS ===\n');

// Analyze main selectors
const selectors = pom.selectors;
let totalSelectors = 0;
let selectorsByType = {};

// Count selectors by category
for (const [category, items] of Object.entries(selectors)) {
  let count = 0;
  let withMapping = 0;
  let uniqueToRalph = 0;

  if (typeof items === 'object' && !Array.isArray(items)) {
    for (const [key, value] of Object.entries(items)) {
      count++;
      if (typeof value === 'object' && value.jaceSelector) {
        withMapping++;
      }
      if (typeof value === 'object' && value.unique) {
        uniqueToRalph++;
      }
    }
  }

  selectorsByType[category] = {
    total: count,
    withMapping,
    uniqueToRalph,
  };
  totalSelectors += count;
}

console.log('SELECTOR CATEGORIES:');
console.log('Category              | Total | Mapped | Unique to Ralph');
console.log('----------------------|-------|--------|----------------');

for (const [category, stats] of Object.entries(selectorsByType)) {
  if (stats.total > 0) {
    console.log(
      `${category.padEnd(21)} | ${String(stats.total).padEnd(5)} | ${String(stats.withMapping).padEnd(6)} | ${stats.uniqueToRalph}`
    );
  }
}

console.log(`\nTotal selectors: ${totalSelectors}`);

// Analyze coreElements used for property testing
console.log('\n\nCORE ELEMENTS (for property testing):');
console.log('Element Name          | Type    | Has Mapping');
console.log('----------------------|---------|------------');

const coreElements = selectors.coreElements || {};
let coreCount = 0;
let coreMapped = 0;

for (const [name, selector] of Object.entries(coreElements)) {
  coreCount++;
  const hasMapping = typeof selector === 'object' && selector.jaceSelector;
  if (hasMapping) coreMapped++;

  console.log(
    `${name.padEnd(21)} | ${typeof selector === 'string' ? 'string' : 'object'} | ${hasMapping ? 'Yes' : 'No'}`
  );
}

console.log(`\nTotal core elements: ${coreCount}`);
console.log(`Elements with ralph/jace mapping: ${coreMapped}`);

// Show CSS properties tracked
console.log(`\n\nCSS PROPERTIES TRACKED: ${pom.cssProperties.length} properties per element`);

// Calculate expected property counts
console.log('\n\nEXPECTED PROPERTY COUNTS:');
console.log(
  `- If all ${coreCount} elements found: ${coreCount * pom.cssProperties.length} properties`
);
console.log(`- If 1 element missing: ${(coreCount - 1) * pom.cssProperties.length} properties`);

console.log('\n\nOBSERVED IN TESTS:');
console.log('- Ralph: 2,575 properties (22 elements found)');
console.log('- Jace: 2,691 properties (23 elements found)');
console.log('- Difference: 116 properties (1 element - images)');
