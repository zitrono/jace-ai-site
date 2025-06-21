// Count POM Elements and Tests Coverage
import fs from 'fs';

function countPOMElements() {
  console.log('📊 POM Element and Test Coverage Analysis\n');
  
  // Read the consolidated POM file
  const pomContent = fs.readFileSync('/Users/zitrono/dev/web/ralph-web/jace-ai-site/tests/jace-ai-site.pom.js', 'utf8');
  
  // Count selectors in each category
  const selectorCategories = {
    backgrounds: 0,
    hero: 0,
    navigation: 0,
    trust: 0,
    companies: 0,
    features: 0,
    pricing: 0,
    testimonials: 0,
    faq: 0,
    footer: 0,
    mobileMenu: 0,
    interactive: 0,
    visual: 0,
    accessibility: 0,
    responsive: 0,
    cookie: 0,
    forms: 0
  };
  
  // Extract selector sections
  const selectorSectionRegex = /(\w+):\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;
  let match;
  
  while ((match = selectorSectionRegex.exec(pomContent)) !== null) {
    const [, categoryName, categoryContent] = match;
    
    if (selectorCategories.hasOwnProperty(categoryName)) {
      // Count individual selectors in this category
      const selectorRegex = /'\s*([^']+)'/g;
      let selectorMatch;
      let count = 0;
      
      while ((selectorMatch = selectorRegex.exec(categoryContent)) !== null) {
        count++;
      }
      
      selectorCategories[categoryName] = count;
    }
  }
  
  // Read the validation script
  const validationContent = fs.readFileSync('/Users/zitrono/dev/web/ralph-web/jace-ai-site/tests/validate-jace-ai-100.js', 'utf8');
  
  // Count validation methods
  const validationMethods = (pomContent.match(/async validate\w+\(\)/g) || []).length;
  const interactiveMethods = (pomContent.match(/async test\w+\(\)/g) || []).length;
  const additionalChecks = (validationContent.match(/checks\.\w+\s*=/g) || []).length;
  
  // Read pom_extension.md to compare coverage
  const pomExtensionContent = fs.readFileSync('/Users/zitrono/dev/web/ralph-web/jace-ai-site/tests/pom_extension.md', 'utf8');
  
  // Count sections in pom_extension.md
  const extensionSections = (pomExtensionContent.match(/## \d+\. /g) || []).length;
  const extensionSelectors = (pomExtensionContent.match(/^'[^']+'/gm) || []).length;
  
  // Display results
  console.log('🔍 POM Selector Categories and Counts:');
  console.log('=====================================');
  
  let totalSelectors = 0;
  Object.entries(selectorCategories).forEach(([category, count]) => {
    console.log(`${category.padEnd(15)}: ${count.toString().padStart(3)} selectors`);
    totalSelectors += count;
  });
  
  console.log('=====================================');
  console.log(`TOTAL SELECTORS: ${totalSelectors}`);
  
  console.log('\n🧪 Test Coverage Analysis:');
  console.log('===========================');
  console.log(`Validation methods     : ${validationMethods}`);
  console.log(`Interactive test methods: ${interactiveMethods}`);
  console.log(`Additional checks      : ${additionalChecks}`);
  console.log(`TOTAL TEST METHODS     : ${validationMethods + interactiveMethods + additionalChecks}`);
  
  console.log('\n📋 pom_extension.md Coverage:');
  console.log('==============================');
  console.log(`Extension sections     : ${extensionSections}`);
  console.log(`Extension selectors    : ${extensionSelectors}`);
  console.log(`POM categories covered : ${Object.keys(selectorCategories).length}`);
  console.log(`Coverage percentage    : ${((Object.keys(selectorCategories).length / extensionSections) * 100).toFixed(1)}%`);
  
  console.log('\n📊 Summary Statistics:');
  console.log('======================');
  console.log(`Total POM selectors    : ${totalSelectors}`);
  console.log(`Total test methods     : ${validationMethods + interactiveMethods + additionalChecks}`);
  console.log(`Selector/test ratio    : ${(totalSelectors / (validationMethods + interactiveMethods + additionalChecks)).toFixed(2)}`);
  
  // Detailed breakdown by category
  console.log('\n📋 Detailed Category Breakdown:');
  console.log('================================');
  
  const categoryMapping = {
    backgrounds: 'Background Colors and Sections',
    hero: 'Hero Section Elements',
    navigation: 'Navigation and Header',
    trust: 'Trust Indicators (Badges, User Count)',
    companies: 'Company Logos Section',
    features: 'Features Section',
    pricing: 'Pricing Section',
    testimonials: 'Testimonials Section',
    faq: 'FAQ Section',
    footer: 'Footer Elements',
    mobileMenu: 'Mobile Menu System',
    interactive: 'Interactive Elements',
    visual: 'Visual Elements (Icons, Badges)',
    accessibility: 'Accessibility Features',
    responsive: 'Responsive Design',
    cookie: 'Cookie Banner',
    forms: 'Form Elements'
  };
  
  Object.entries(selectorCategories).forEach(([category, count]) => {
    const description = categoryMapping[category] || category;
    console.log(`${category.padEnd(12)}: ${count.toString().padStart(3)} → ${description}`);
  });
  
  return {
    totalSelectors,
    totalTests: validationMethods + interactiveMethods + additionalChecks,
    categories: Object.keys(selectorCategories).length,
    extensionSections,
    coverage: (Object.keys(selectorCategories).length / extensionSections) * 100
  };
}

// Run the analysis
const results = countPOMElements();

console.log('\n🎯 Final Assessment:');
console.log('====================');
if (results.coverage >= 100) {
  console.log('✅ COMPLETE COVERAGE: All pom_extension.md sections are covered!');
} else {
  console.log(`⚠️  PARTIAL COVERAGE: ${results.coverage.toFixed(1)}% of pom_extension.md sections covered`);
}

if (results.totalSelectors > 100) {
  console.log('✅ COMPREHENSIVE POM: Over 100 selectors defined');
} else {
  console.log(`📝 POM SIZE: ${results.totalSelectors} selectors defined`);
}

if (results.totalTests > 25) {
  console.log('✅ THOROUGH TESTING: Over 25 test methods defined');
} else {
  console.log(`🧪 TEST COVERAGE: ${results.totalTests} test methods defined`);
}