import puppeteer from 'puppeteer';

async function compareSites() {
  console.log('🔍 Comparing Ralph vs Jace Sites\n');
  console.log('='.repeat(50));
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const results = {
      ralph: { url: 'https://zitrono.github.io/jace-ai-site/', results: {} },
      jace: { url: 'https://jace.ai', results: {} }
    };
    
    for (const [name, site] of Object.entries(results)) {
      console.log(`\n📊 Testing ${name.toUpperCase()} site: ${site.url}`);
      console.log('-'.repeat(40));
      
      const page = await browser.newPage();
      
      try {
        await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test key elements
        const tests = {
          heroTitle: await page.$eval('h1', el => el.textContent.trim()).catch(() => 'NOT FOUND'),
          heroSubtitle: await page.$eval('h1 + p', el => el.textContent.trim()).catch(() => 'NOT FOUND'),
          navLinks: await page.$$eval('nav a', links => links.length).catch(() => 0),
          ctaButtons: await page.$$eval('button.btn-primary', btns => btns.length).catch(() => 0),
          features: await page.$$eval('#features h3, [id*="feature"] h3', els => els.length).catch(() => 0),
          testimonials: await page.$$eval('[class*="testimonial"] blockquote', els => els.length).catch(() => 0),
          faqItems: await page.$$eval('[class*="faq"] button', els => els.length).catch(() => 0),
          logo: await page.$eval('nav a span', el => el.textContent.trim()).catch(() => 'NOT FOUND'),
          casaBadge: await page.$eval('.badge-certification', el => el.textContent.trim()).catch(() => 'NOT FOUND'),
          userCount: await page.$eval('[data-test="user-count"]', el => el.textContent.trim()).catch(() => 'NOT FOUND')
        };
        
        // Check mobile responsiveness
        await page.setViewport({ width: 375, height: 667 });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        tests.mobileMenuButton = await page.$('button[id*="mobile-menu"], button[aria-label*="menu"]') ? 'FOUND' : 'NOT FOUND';
        
        // Check page performance
        const metrics = await page.metrics();
        tests.jsHeapUsed = Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + ' MB';
        
        site.results = tests;
        
      } catch (error) {
        console.error(`Error testing ${name}:`, error.message);
        site.results.error = error.message;
      }
      
      await page.close();
    }
    
    // Compare results
    console.log('\n\n📊 COMPARISON RESULTS');
    console.log('='.repeat(50));
    
    const ralphResults = results.ralph.results;
    const jaceResults = results.jace.results;
    
    for (const key of Object.keys(ralphResults)) {
      if (key === 'error') continue;
      
      const ralphValue = ralphResults[key];
      const jaceValue = jaceResults[key] || 'N/A';
      const match = ralphValue === jaceValue ? '✅' : '⚠️';
      
      console.log(`\n${key}:`);
      console.log(`  Ralph: ${ralphValue}`);
      console.log(`  Jace:  ${jaceValue} ${match}`);
    }
    
    // Summary
    console.log('\n\n📈 SUMMARY');
    console.log('='.repeat(50));
    
    const differences = [];
    for (const key of Object.keys(ralphResults)) {
      if (key === 'error' || key === 'jsHeapUsed') continue;
      if (ralphResults[key] !== jaceResults[key]) {
        differences.push(key);
      }
    }
    
    if (differences.length === 0) {
      console.log('✅ Both sites have identical structure and content!');
    } else {
      console.log(`⚠️  Found ${differences.length} differences:`);
      differences.forEach(diff => console.log(`   - ${diff}`));
    }
    
    // Key observations
    console.log('\n🔑 KEY OBSERVATIONS:');
    console.log(`- Ralph (migrated) site: ${ralphResults.error ? '❌ ERROR: ' + ralphResults.error : '✅ Working'}`)
    console.log(`- Jace (official) site: ${jaceResults.error ? '❌ ERROR: ' + jaceResults.error : '✅ Working'}`);
    console.log(`- Ralph has ${ralphResults.features || 0} features, Jace has ${jaceResults.features || 0}`);
    console.log(`- Ralph has ${ralphResults.testimonials || 0} testimonials, Jace has ${jaceResults.testimonials || 0}`);
    
  } finally {
    await browser.close();
  }
}

// Run the comparison
compareSites().catch(console.error);