// Universal Parity Test
// Tests both original and refactor sites using the same POM
// Provides direct parity comparison

import puppeteer from 'puppeteer';
import { UniversalJaceAISitePOM } from './universal-jace-pom.js';

async function testSite(siteType) {
  console.log(`\n🔬 Testing ${siteType.toUpperCase()} site...`);
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Create POM instance
    const pom = new UniversalJaceAISitePOM(page, siteType);
    
    // Navigate to site
    await pom.navigate();
    
    // Run all validations
    const results = await pom.validateAll();
    
    // Calculate metrics
    const totalErrors = Object.values(results).reduce((sum, errors) => sum + errors.length, 0);
    const totalTests = Object.keys(results).length * 5; // Approximate tests per section
    const successRate = Math.round(((totalTests - totalErrors) / totalTests) * 100);
    
    console.log(`\n📊 ${siteType.toUpperCase()} RESULTS:`);
    console.log(`   Success Rate: ${successRate}%`);
    console.log(`   Total Errors: ${totalErrors}`);
    
    // Report section results
    for (const [section, errors] of Object.entries(results)) {
      if (errors.length > 0) {
        console.log(`   ❌ ${section}: ${errors.length} errors`);
        errors.forEach(error => console.log(`      - ${error}`));
      } else {
        console.log(`   ✅ ${section}: All checks passed`);
      }
    }
    
    await browser.close();
    
    return {
      siteType,
      results,
      totalErrors,
      successRate,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    await browser.close();
    console.error(`❌ ${siteType} test failed:`, error.message);
    return {
      siteType,
      error: error.message,
      totalErrors: 999,
      successRate: 0
    };
  }
}

async function runParityComparison() {
  console.log('🎯 UNIVERSAL PARITY TEST');
  console.log('Testing both original and refactor sites with identical validation...\n');
  
  try {
    // Test both sites
    const [originalResults, refactorResults] = await Promise.all([
      testSite('original'),
      testSite('refactor')
    ]);
    
    // Compare results
    console.log('\n' + '='.repeat(80));
    console.log('                          PARITY COMPARISON');
    console.log('='.repeat(80));
    
    console.log(`\n📈 SUCCESS RATES:`);
    console.log(`   Original: ${originalResults.successRate}%`);
    console.log(`   Refactor: ${refactorResults.successRate}%`);
    
    const parityGap = Math.abs(originalResults.successRate - refactorResults.successRate);
    console.log(`   Parity Gap: ${parityGap}%`);
    
    console.log(`\n🔢 ERROR COUNTS:`);
    console.log(`   Original: ${originalResults.totalErrors} errors`);
    console.log(`   Refactor: ${refactorResults.totalErrors} errors`);
    
    // Section-by-section comparison
    console.log(`\n🔍 SECTION COMPARISON:`);
    
    if (originalResults.results && refactorResults.results) {
      const sections = Object.keys(originalResults.results);
      
      for (const section of sections) {
        const origErrors = originalResults.results[section]?.length || 0;
        const refactorErrors = refactorResults.results[section]?.length || 0;
        
        const status = origErrors === refactorErrors ? '✅' : '⚠️';
        console.log(`   ${status} ${section}: Original(${origErrors}) vs Refactor(${refactorErrors})`);
        
        // Show specific differences
        if (origErrors !== refactorErrors) {
          const origSet = new Set(originalResults.results[section] || []);
          const refactorSet = new Set(refactorResults.results[section] || []);
          
          // Errors only in refactor
          for (const error of refactorSet) {
            if (!origSet.has(error)) {
              console.log(`      🔴 Refactor only: ${error}`);
            }
          }
          
          // Errors only in original
          for (const error of origSet) {
            if (!refactorSet.has(error)) {
              console.log(`      🟡 Original only: ${error}`);
            }
          }
        }
      }
    }
    
    // Overall assessment
    console.log(`\n🎯 PARITY ASSESSMENT:`);
    
    if (parityGap <= 5) {
      console.log('   ✅ EXCELLENT PARITY - Sites are very similar');
    } else if (parityGap <= 15) {
      console.log('   ⚠️  GOOD PARITY - Minor differences detected');
    } else if (parityGap <= 30) {
      console.log('   🔶 MODERATE PARITY - Significant differences');
    } else {
      console.log('   ❌ POOR PARITY - Major structural differences');
    }
    
    // Recommendations
    if (refactorResults.successRate < originalResults.successRate) {
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('   - Focus on fixing refactor issues to match original');
      console.log('   - Review failed sections for structural differences');
      console.log('   - Add data-test attributes for better selector matching');
    } else if (refactorResults.successRate > originalResults.successRate) {
      console.log('\n💡 OBSERVATIONS:');
      console.log('   - Refactor may have improvements over original');
      console.log('   - Verify original site accessibility and functionality');
    }
    
    // Save results
    const comparisonReport = {
      timestamp: new Date().toISOString(),
      parityGap,
      originalResults,
      refactorResults,
      assessment: parityGap <= 5 ? 'excellent' : parityGap <= 15 ? 'good' : parityGap <= 30 ? 'moderate' : 'poor'
    };
    
    console.log('\n📄 Full comparison report available in results object');
    return comparisonReport;
    
  } catch (error) {
    console.error('❌ Parity test failed:', error.message);
    return null;
  }
}

// Run the test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runParityComparison()
    .then(results => {
      if (results) {
        console.log('\n✅ Parity test completed successfully');
        process.exit(results.parityGap <= 15 ? 0 : 1);
      } else {
        console.log('\n❌ Parity test failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { runParityComparison, testSite };