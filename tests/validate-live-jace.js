// Quick validation test for live jace.ai site
import { testSite } from './universal-parity-test.js';

console.log('🌐 Testing live jace.ai site...');

testSite('original')
  .then(results => {
    console.log('\n✅ LIVE JACE.AI VALIDATION COMPLETE');
    console.log(`📊 Success Rate: ${results.successRate}%`);
    console.log(`🔢 Total Errors: ${results.totalErrors}`);
    
    if (results.results) {
      console.log('\n📋 Section Breakdown:');
      for (const [section, errors] of Object.entries(results.results)) {
        const status = errors.length === 0 ? '✅' : '❌';
        console.log(`   ${status} ${section}: ${errors.length} errors`);
        if (errors.length > 0) {
          errors.forEach(error => console.log(`      - ${error}`));
        }
      }
    }
    
    console.log('\n🎯 Baseline established for parity comparison');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  });