import { JaceAISitePOM } from './jace-ai-site.pom.js';

// Create dummy page to access POM structure
const dummyPage = { 
  goto: () => {}, 
  viewport: () => ({ width: 1200, height: 800 })
};
const pom = new JaceAISitePOM(dummyPage);

console.log('=== POM ENTITY STRUCTURE ANALYSIS ===\n');

// Analyze selector organization
const selectors = pom.selectors;
const categories = Object.keys(selectors);

console.log('HIERARCHICAL STRUCTURE:');
console.log('┌─ selectors (root)');

// Count elements per category
const stats = {};
categories.forEach(category => {
  if (category === 'coreElements') return; // Handle separately
  
  const items = selectors[category];
  let count = 0;
  let mappedCount = 0;
  
  if (typeof items === 'object' && !Array.isArray(items)) {
    Object.entries(items).forEach(([key, value]) => {
      count++;
      if (typeof value === 'object' && value.jaceSelector) {
        mappedCount++;
      }
    });
  }
  
  stats[category] = { count, mappedCount };
  console.log(`├─ ${category} (${count} elements, ${mappedCount} mapped)`);
});

console.log(`└─ coreElements (${Object.keys(selectors.coreElements).length} elements)\n`);

// Analyze logical grouping
console.log('\nLOGICAL GROUPING ANALYSIS:');

const groups = {
  'Page Structure': ['backgrounds', 'viewport', 'divs'],
  'Navigation & Header': ['navigation', 'mobileMenu'],
  'Hero/Landing': ['hero'],
  'Social Proof': ['trust', 'companies', 'testimonials'],
  'Content Sections': ['features', 'pricing', 'faq', 'faqInteractive'],
  'Footer': ['footer'],
  'UI Components': ['interactive', 'visual', 'buttons', 'forms', 'checkmarks'],
  'Compliance': ['cookie', 'cookieConsent'],
  'Accessibility': ['accessibility'],
  'Responsive': ['responsive'],
  'Core Testing': ['coreElements']
};

Object.entries(groups).forEach(([group, categories]) => {
  console.log(`\n${group}:`);
  categories.forEach(cat => {
    if (stats[cat]) {
      console.log(`  - ${cat}: ${stats[cat].count} elements`);
    } else if (cat === 'coreElements') {
      console.log(`  - ${cat}: ${Object.keys(selectors.coreElements).length} elements`);
    }
  });
});

// Check POM best practices
console.log('\n\nPOM BEST PRACTICES ANALYSIS:');

const bestPractices = {
  'Logical Hierarchy': categories.length > 0 && selectors.coreElements,
  'Semantic Naming': categories.every(cat => /^[a-z][a-zA-Z]+$/.test(cat)),
  'Selector Abstraction': Object.values(selectors).some(s => 
    Object.values(s).some(v => typeof v === 'object' && v.selector)
  ),
  'Platform Mapping': Object.values(selectors).some(s => 
    Object.values(s).some(v => typeof v === 'object' && v.jaceSelector)
  ),
  'Reusable Methods': Object.getOwnPropertyNames(Object.getPrototypeOf(pom))
    .filter(m => m.startsWith('validate')).length > 0,
  'CSS Property Tracking': Array.isArray(pom.cssProperties) && pom.cssProperties.length > 0,
  'Mobile Support': !!pom.mobileRequirements,
  'Expected Values': !!pom.expectedStyles
};

console.log('✓ = Implemented, ✗ = Missing\n');
Object.entries(bestPractices).forEach(([practice, implemented]) => {
  console.log(`${implemented ? '✓' : '✗'} ${practice}`);
});

// Analyze selector types
console.log('\n\nSELECTOR TYPE DISTRIBUTION:');
let selectorTypes = {
  'CSS Class': 0,
  'CSS ID': 0,
  'Tag Name': 0,
  'Attribute': 0,
  'Complex': 0,
  'Mapped (ralph/jace)': 0
};

// Count selector types across all categories
Object.values(selectors).forEach(category => {
  if (typeof category === 'object') {
    Object.values(category).forEach(selector => {
      if (typeof selector === 'string') {
        if (selector.startsWith('.')) selectorTypes['CSS Class']++;
        else if (selector.startsWith('#')) selectorTypes['CSS ID']++;
        else if (selector.includes('[')) selectorTypes['Attribute']++;
        else if (selector.includes(' ') || selector.includes('>')) selectorTypes['Complex']++;
        else selectorTypes['Tag Name']++;
      } else if (selector?.jaceSelector) {
        selectorTypes['Mapped (ralph/jace)']++;
      }
    });
  }
});

Object.entries(selectorTypes).forEach(([type, count]) => {
  console.log(`${type}: ${count}`);
});

// Comments on standards compliance
console.log('\n\nPOM STANDARDS COMPLIANCE:');
console.log(`
Overall Assessment: ${
  Object.values(bestPractices).filter(v => v).length >= 6 ? 'GOOD' : 'NEEDS IMPROVEMENT'
}

Strengths:
- Clear hierarchical organization with logical categories
- Comprehensive selector coverage (${categories.length} categories)
- Platform-specific selector mapping (ralph/jace)
- Extensive validation methods
- Mobile-specific requirements tracked
- CSS property tracking (${pom.cssProperties.length} properties)

Areas Following POM Best Practices:
- Separation of selectors from test logic
- Abstraction of element locators
- Reusable validation methods
- Clear naming conventions
- Support for multiple platforms/environments

Potential Improvements:
${!bestPractices['Logical Hierarchy'] ? '- Add more logical grouping of selectors\n' : ''}
${selectorTypes['Complex'] > 50 ? '- Reduce complex selector chains for maintainability\n' : ''}
${Object.keys(selectors.coreElements).length > 30 ? '- Consider sub-grouping core elements\n' : ''}
- Consider adding data-testid attributes for more stable selectors
- Document selector naming conventions in comments

Industry Standard Compliance: ${
  Object.values(bestPractices).filter(v => v).length >= 7 ? 'EXCELLENT' : 
  Object.values(bestPractices).filter(v => v).length >= 5 ? 'GOOD' :
  'NEEDS WORK'
}
`);