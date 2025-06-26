import puppeteer from 'puppeteer';

async function compareHeaderGap() {
  const browser = await puppeteer.launch({ headless: false });
  
  try {
    // Check Jace reference
    console.log('\n🔍 Checking Jace reference header gap...');
    const jacePage = await browser.newPage();
    await jacePage.setViewport({ width: 1200, height: 800 });
    
    // Try different Jace URLs
    const jaceUrls = [
      'http://localhost:8081/',
      'http://localhost:8081/index.html',
      'http://localhost:8080/',
      'file:///Users/zitrono/dev/web/ralph-web/archive/jace-copy/index.html'
    ];
    
    let jaceData = null;
    for (const url of jaceUrls) {
      try {
        await jacePage.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
        const hasContent = await jacePage.evaluate(() => {
          return document.body && document.body.children.length > 0 && !document.title.includes('Error');
        });
        
        if (hasContent) {
          console.log(`✅ Jace reference found at: ${url}`);
          jaceData = await jacePage.evaluate(() => {
            const nav = document.querySelector('nav');
            const header = document.querySelector('header');
            const element = nav || header;
            
            if (!element) {
              return { error: 'No nav or header found' };
            }
            
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            const parentStyles = element.parentElement ? window.getComputedStyle(element.parentElement) : null;
            
            return {
              found: true,
              elementType: element.tagName.toLowerCase(),
              position: styles.position,
              marginTop: styles.marginTop,
              paddingTop: styles.paddingTop,
              top: styles.top,
              boundingTop: rect.top,
              height: rect.height,
              parentMarginTop: parentStyles ? parentStyles.marginTop : 'N/A',
              parentPaddingTop: parentStyles ? parentStyles.paddingTop : 'N/A',
              bodyMarginTop: window.getComputedStyle(document.body).marginTop,
              bodyPaddingTop: window.getComputedStyle(document.body).paddingTop
            };
          });
          break;
        }
      } catch (e) {
        console.log(`❌ Failed to load ${url}: ${e.message}`);
      }
    }
    
    if (!jaceData || !jaceData.found) {
      console.log('⚠️ Could not find Jace reference site. Please ensure it\'s running:');
      console.log('   cd /Users/zitrono/dev/web/ralph-web/tests');
      console.log('   npm run serve:jace');
      return;
    }
    
    // Check Ralph
    console.log('\n🔍 Checking Ralph header gap...');
    const ralphPage = await browser.newPage();
    await ralphPage.setViewport({ width: 1200, height: 800 });
    await ralphPage.goto('http://localhost:4321/ralph-web/', { waitUntil: 'networkidle0' });
    
    const ralphData = await ralphPage.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) {
        return { error: 'No header found' };
      }
      
      const rect = header.getBoundingClientRect();
      const styles = window.getComputedStyle(header);
      const parentStyles = header.parentElement ? window.getComputedStyle(header.parentElement) : null;
      
      return {
        found: true,
        elementType: header.tagName.toLowerCase(),
        position: styles.position,
        marginTop: styles.marginTop,
        paddingTop: styles.paddingTop,
        top: styles.top,
        boundingTop: rect.top,
        height: rect.height,
        parentMarginTop: parentStyles ? parentStyles.marginTop : 'N/A',
        parentPaddingTop: parentStyles ? parentStyles.paddingTop : 'N/A',
        bodyMarginTop: window.getComputedStyle(document.body).marginTop,
        bodyPaddingTop: window.getComputedStyle(document.body).paddingTop
      };
    });
    
    // Compare results
    console.log('\n📊 Comparison Results:');
    console.log('=====================================');
    console.log('Property            | Jace          | Ralph');
    console.log('-------------------|---------------|---------------');
    console.log(`Element Type       | ${jaceData.elementType.padEnd(13)} | ${ralphData.elementType}`);
    console.log(`Position           | ${jaceData.position.padEnd(13)} | ${ralphData.position}`);
    console.log(`Margin Top         | ${jaceData.marginTop.padEnd(13)} | ${ralphData.marginTop}`);
    console.log(`Padding Top        | ${jaceData.paddingTop.padEnd(13)} | ${ralphData.paddingTop}`);
    console.log(`Top                | ${jaceData.top.padEnd(13)} | ${ralphData.top}`);
    console.log(`Bounding Top       | ${jaceData.boundingTop.toString().padEnd(13)} | ${ralphData.boundingTop}`);
    console.log(`Height             | ${jaceData.height.toString().padEnd(13)} | ${ralphData.height}`);
    console.log(`Parent Margin Top  | ${jaceData.parentMarginTop.padEnd(13)} | ${ralphData.parentMarginTop}`);
    console.log(`Parent Padding Top | ${jaceData.parentPaddingTop.padEnd(13)} | ${ralphData.parentPaddingTop}`);
    console.log(`Body Margin Top    | ${jaceData.bodyMarginTop.padEnd(13)} | ${ralphData.bodyMarginTop}`);
    console.log(`Body Padding Top   | ${jaceData.bodyPaddingTop.padEnd(13)} | ${ralphData.bodyPaddingTop}`);
    
    console.log('\n📌 Key Findings:');
    if (jaceData.boundingTop === 0 && ralphData.boundingTop > 0) {
      console.log(`❌ Ralph has a ${ralphData.boundingTop}px gap from top, Jace has none`);
      console.log(`   This is caused by Ralph's header margin-top: ${ralphData.marginTop}`);
    } else if (jaceData.boundingTop > 0 && ralphData.boundingTop === 0) {
      console.log(`❌ Jace has a ${jaceData.boundingTop}px gap from top, Ralph has none`);
    } else if (jaceData.boundingTop === ralphData.boundingTop) {
      console.log(`✅ Both have the same gap from top: ${jaceData.boundingTop}px`);
    } else {
      console.log(`⚠️ Different gaps: Jace ${jaceData.boundingTop}px, Ralph ${ralphData.boundingTop}px`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

compareHeaderGap().catch(console.error);