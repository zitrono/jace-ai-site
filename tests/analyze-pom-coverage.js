import { JaceAISitePOM } from './jace-ai-site.pom.js';

function analyzePOM() {
  console.log('📊 POM Coverage Analysis');
  console.log('========================\n');

  // Create a dummy page object for analysis
  const dummyPage = {};
  const pom = new JaceAISitePOM(dummyPage);

  // Count selectors
  let totalSelectors = 0;
  let selectorsBySection = {};

  function countSelectors(obj, section = '') {
    let count = 0;
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        count++;
        totalSelectors++;
      } else if (typeof value === 'object' && value !== null) {
        if (value.selector || value.jaceSelector) {
          // This is a selector definition object
          count++;
          totalSelectors++;
        } else {
          // This is a nested section
          const nestedCount = countSelectors(value, key);
          if (section) {
            selectorsBySection[`${section}.${key}`] = nestedCount;
          } else {
            selectorsBySection[key] = nestedCount;
          }
        }
      }
    }
    return count;
  }

  countSelectors(pom.selectors);

  console.log('📌 SELECTORS:');
  console.log(`Total selectors: ${totalSelectors}\n`);
  console.log('By section:');
  Object.entries(selectorsBySection).forEach(([section, count]) => {
    console.log(`  ${section}: ${count}`);
  });

  // Count expected styles
  let totalStyles = 0;
  let stylesByCategory = {};

  function countStyles(obj, category = '') {
    let count = 0;
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' || value instanceof RegExp) {
        count++;
        totalStyles++;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedCount = countStyles(value, key);
        if (category) {
          stylesByCategory[`${category}.${key}`] = nestedCount;
        } else {
          stylesByCategory[key] = nestedCount;
        }
      }
    }
    return count;
  }

  countStyles(pom.expectedStyles);

  console.log('\n📐 EXPECTED STYLES:');
  console.log(`Total style properties: ${totalStyles}\n`);
  console.log('By category:');
  Object.entries(stylesByCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });

  // Count expected content
  let totalContent = 0;
  for (const [key, value] of Object.entries(pom.expectedContent)) {
    if (Array.isArray(value)) {
      totalContent += value.length;
    } else {
      totalContent++;
    }
  }

  console.log('\n📝 EXPECTED CONTENT:');
  console.log(`Total content items: ${totalContent}`);

  // Check validation methods
  const validationMethods = [];
  const allMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(pom));

  for (const method of allMethods) {
    if (method.startsWith('validate') && typeof pom[method] === 'function') {
      validationMethods.push(method);
    }
  }

  console.log('\n🧪 VALIDATION METHODS:');
  console.log(`Total validation methods: ${validationMethods.length}`);
  validationMethods.forEach((method) => {
    console.log(`  - ${method}`);
  });

  // Interactive test methods
  const interactiveMethods = [];
  for (const method of allMethods) {
    if (method.startsWith('test') && typeof pom[method] === 'function') {
      interactiveMethods.push(method);
    }
  }

  console.log('\n🎮 INTERACTIVE TEST METHODS:');
  console.log(`Total interactive methods: ${interactiveMethods.length}`);
  interactiveMethods.forEach((method) => {
    console.log(`  - ${method}`);
  });

  // Summary
  console.log('\n📊 SUMMARY:');
  console.log('==========');
  console.log(`Total Selectors: ${totalSelectors}`);
  console.log(`Total Style Properties: ${totalStyles}`);
  console.log(`Total Content Items: ${totalContent}`);
  console.log(`Total Validation Methods: ${validationMethods.length}`);
  console.log(`Total Interactive Methods: ${interactiveMethods.length}`);
  console.log(`\nGRAND TOTAL ELEMENTS: ${totalSelectors + totalStyles + totalContent}`);

  // Check which validation methods are called in unified-test.js
  const testedSections = [
    'Backgrounds',
    'Hero',
    'Navigation',
    'Trust',
    'Companies',
    'Features',
    'Testimonials',
    'Pricing',
    'FAQ',
    'CallToAction',
    'Footer',
    'Buttons',
    'Cards',
    'Typography',
    'Colors',
    'Interactive',
    'NewElements',
  ];

  console.log('\n✅ COVERAGE CHECK:');
  const testedMethods = testedSections.map((s) => `validate${s}`);
  const untestedMethods = validationMethods.filter((m) => !testedMethods.includes(m));

  if (untestedMethods.length > 0) {
    console.log('❌ Untested validation methods:');
    untestedMethods.forEach((method) => console.log(`  - ${method}`));
  } else {
    console.log('✅ All validation methods are covered in unified-test.js');
  }
}

analyzePOM();
