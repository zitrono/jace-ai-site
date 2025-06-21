// Test new POM elements with refactor site
import puppeteer from 'puppeteer';
import { UniversalJaceAISitePOM } from './universal-jace-pom.js';

async function testRefactorNewElements() {
  console.log('🧪 Testing new POM elements against refactor site...');
  
  const browser = await puppeteer.launch({ headless: true });
  
  try {
    // Test different viewports
    const viewports = [
      { width: 320, height: 568, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    const allResults = {};
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height });
      
      const pom = new UniversalJaceAISitePOM(page, 'refactor');
      await pom.navigate();
      
      // Test new validation methods
      const results = {
        viewport: await pom.validateViewportSpecificStyles(),
        checkmarks: await pom.validateCheckmarkColors(),
        faq: await pom.validateFAQInteractivity(),
        backgrounds: await pom.validateSectionBackgrounds()
      };
      
      allResults[viewport.name] = results;
      
      // Calculate success rate for new elements
      const totalErrors = Object.values(results).reduce((acc, errors) => acc + errors.length, 0);
      const totalTests = 4; // 4 new validation methods
      const successRate = ((totalTests - (totalErrors > 0 ? 1 : 0)) / totalTests * 100).toFixed(1);
      
      console.log(`${viewport.name} Success Rate: ${successRate}%`);
      
      if (totalErrors > 0) {
        console.log(`❌ Errors found:`);
        Object.entries(results).forEach(([section, errors]) => {
          if (errors.length > 0) {
            console.log(`  ${section}:`);
            errors.forEach(error => console.log(`    - ${error}`));
          }
        });
      }
      
      await page.close();
    }
    
    await browser.close();
    
    // Overall summary
    console.log('\n📊 OVERALL SUMMARY:');
    let totalErrors = 0;
    let totalTests = 0;
    
    Object.entries(allResults).forEach(([viewport, results]) => {
      const errors = Object.values(results).reduce((acc, errors) => acc + errors.length, 0);
      totalErrors += errors;
      totalTests += 4;
      console.log(`${viewport}: ${errors === 0 ? '✅ PASS' : '❌ FAIL'} (${errors} errors)`);
    });
    
    const overallSuccess = ((totalTests - totalErrors) / totalTests * 100).toFixed(1);
    console.log(`\nOverall Success Rate: ${overallSuccess}%`);
    
    if (overallSuccess === '100.0') {
      console.log('🎉 Perfect! All new POM elements pass with refactor site.');
    } else {
      console.log('⚠️ Some issues found. Check errors above.');
    }
    
    return allResults;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Test failed:', error.message);
    return null;
  }
}

testRefactorNewElements();