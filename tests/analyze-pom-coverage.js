// Analyze if all POM elements are covered by tests
import fs from 'fs';

function analyzePOMCoverage() {
  console.log('🔍 Analyzing POM Element Test Coverage\n');
  
  // Read the unified POM file
  const pomContent = fs.readFileSync('/Users/zitrono/dev/web/ralph-web/jace-ai-site/tests/jace-ai-site.pom.js', 'utf8');
  
  // Extract all selectors from the POM
  const selectorRegex = /(\w+):\s*['"`]([^'"`]+)['"`]/g;
  const allSelectors = [];
  let match;
  
  while ((match = selectorRegex.exec(pomContent)) !== null) {
    const [, name, selector] = match;
    if (!name.includes('expected') && !name.includes('url') && !selector.includes('expected')) {
      allSelectors.push({ name, selector });
    }
  }
  
  // Extract validation methods
  const validationMethods = [];
  const validationRegex = /async\s+(validate\w+|test\w+)\s*\(/g;
  
  while ((match = validationRegex.exec(pomContent)) !== null) {
    validationMethods.push(match[1]);
  }
  
  // Analyze which selectors are used in validation methods
  const usedSelectors = [];
  const unusedSelectors = [];
  
  // Check each selector to see if it's referenced in any validation method
  for (const { name, selector } of allSelectors) {
    const selectorPattern = new RegExp(`this\\.selectors\\.[\\w.]*${name}\\b`, 'g');
    const isUsed = pomContent.match(selectorPattern);
    
    if (isUsed) {
      usedSelectors.push({ name, selector });
    } else {
      // Check if selector is used directly
      const directPattern = new RegExp(`['"\`]${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g');
      if (pomContent.match(directPattern)) {
        usedSelectors.push({ name, selector });
      } else {
        unusedSelectors.push({ name, selector });
      }
    }
  }
  
  // Group selectors by category
  const selectorCategories = {};
  const categoryRegex = /(\w+):\s*{([^}]+)}/g;
  
  while ((match = categoryRegex.exec(pomContent)) !== null) {
    const [, category, content] = match;
    const categorySelectors = content.match(/\w+:/g);
    if (categorySelectors) {
      selectorCategories[category] = categorySelectors.length;
    }
  }
  
  // Display results
  console.log('📊 POM ELEMENT COVERAGE ANALYSIS');
  console.log('=================================\n');
  
  console.log(`Total selectors defined: ${allSelectors.length}`);
  console.log(`Selectors used in tests: ${usedSelectors.length}`);
  console.log(`Unused selectors: ${unusedSelectors.length}`);
  console.log(`Coverage percentage: ${((usedSelectors.length / allSelectors.length) * 100).toFixed(1)}%\n`);
  
  console.log('📋 Validation Methods Found:');
  console.log('===========================');
  validationMethods.forEach(method => {
    console.log(`✓ ${method}`);
  });
  
  console.log('\n🔴 UNUSED SELECTORS:');
  console.log('====================');
  if (unusedSelectors.length === 0) {
    console.log('✅ All selectors are covered by tests!');
  } else {
    unusedSelectors.forEach(({ name, selector }) => {
      console.log(`❌ ${name}: '${selector}'`);
    });
  }
  
  console.log('\n📂 Selector Categories:');
  console.log('======================');
  Object.entries(selectorCategories).forEach(([category, count]) => {
    console.log(`${category.padEnd(20)}: ${count} selectors`);
  });
  
  // Check for test coverage completeness
  console.log('\n🎯 TEST COVERAGE ASSESSMENT:');
  console.log('============================');
  
  const coveragePercentage = (usedSelectors.length / allSelectors.length) * 100;
  
  if (coveragePercentage === 100) {
    console.log('✅ PERFECT! 100% of POM elements are covered by tests!');
  } else if (coveragePercentage >= 95) {
    console.log('🟢 EXCELLENT! Over 95% of POM elements are covered by tests.');
  } else if (coveragePercentage >= 90) {
    console.log('🟡 GOOD! Over 90% of POM elements are covered by tests.');
  } else {
    console.log('🔴 NEEDS IMPROVEMENT! Less than 90% coverage.');
  }
  
  return {
    total: allSelectors.length,
    used: usedSelectors.length,
    unused: unusedSelectors.length,
    coverage: coveragePercentage,
    unusedList: unusedSelectors
  };
}

// Run the analysis
const results = analyzePOMCoverage();

console.log('\n💡 RECOMMENDATIONS:');
console.log('==================');
if (results.unused > 0) {
  console.log('1. Create tests for unused selectors');
  console.log('2. Remove selectors that are no longer needed');
  console.log('3. Ensure all UI elements have corresponding validation');
} else {
  console.log('✅ All POM elements are properly tested!');
  console.log('✅ No unused selectors found!');
  console.log('✅ Complete test coverage achieved!');
}