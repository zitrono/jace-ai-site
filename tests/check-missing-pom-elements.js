// Check for missing POM elements on original site
import puppeteer from 'puppeteer';

async function checkMissingElements() {
  console.log('🔍 Checking for missing POM elements on jace.ai...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    
    const missingElements = await page.evaluate(() => {
      const results = {};
      
      // 1. FAQ individual questions
      const faqButtons = document.querySelectorAll('button[aria-expanded], [data-state], details summary');
      results.faqQuestions = {
        found: faqButtons.length > 0,
        count: faqButtons.length,
        examples: Array.from(faqButtons).slice(0, 3).map(btn => ({
          text: btn.textContent?.trim().slice(0, 50),
          selector: btn.tagName.toLowerCase() + (btn.className && typeof btn.className === 'string' ? '.' + btn.className.split(' ')[0] : ''),
          ariaExpanded: btn.getAttribute('aria-expanded'),
          dataState: btn.getAttribute('data-state')
        }))
      };
      
      // 2. Special section backgrounds
      const sections = document.querySelectorAll('section');
      results.sectionBackgrounds = Array.from(sections).map((section, i) => {
        const styles = window.getComputedStyle(section);
        return {
          index: i,
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          classes: section.className,
          hasGradient: styles.backgroundImage.includes('gradient')
        };
      }).filter(s => s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.hasGradient);
      
      // 3. Feature cards with rounded corners
      const possibleFeatureCards = document.querySelectorAll('.card, [class*="feature"], [class*="grid"] > div');
      results.featureCards = Array.from(possibleFeatureCards).map(card => {
        const styles = window.getComputedStyle(card);
        return {
          text: card.textContent?.trim().slice(0, 100),
          borderRadius: styles.borderRadius,
          backgroundColor: styles.backgroundColor,
          className: card.className,
          hasRoundedCorners: parseFloat(styles.borderRadius) > 0
        };
      }).filter(card => card.hasRoundedCorners);
      
      // 4. Auto-drafts text
      const autoDraftElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text.includes('auto') && (text.includes('draft') || text.includes('email')) && 
               text.length < 200 && el.children.length < 3;
      });
      results.autoDrafts = autoDraftElements.slice(0, 3).map(el => ({
        text: el.textContent?.trim(),
        tagName: el.tagName,
        className: el.className
      }));
      
      // 5. Mobile/small resolution buttons
      const allButtons = document.querySelectorAll('button, a[class*="btn"], [class*="button"]');
      results.responsiveButtons = Array.from(allButtons).map(btn => {
        const styles = window.getComputedStyle(btn);
        const classes = btn.className || '';
        return {
          text: btn.textContent?.trim().slice(0, 30),
          backgroundColor: styles.backgroundColor,
          className: classes,
          hasMobileClasses: classes.includes('sm:') || classes.includes('md:') || classes.includes('lg:'),
          isYellow: styles.backgroundColor.includes('255') && styles.backgroundColor.includes('220')
        };
      }).filter(btn => btn.isYellow || btn.hasMobileClasses);
      
      // 6. Elements with border radius
      const roundedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const styles = window.getComputedStyle(el);
        return parseFloat(styles.borderRadius) > 4;
      }).slice(0, 10);
      
      results.roundedElements = roundedElements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        borderRadius: window.getComputedStyle(el).borderRadius,
        text: el.textContent?.trim().slice(0, 50)
      }));
      
      return results;
    });
    
    console.log('\n📋 MISSING ELEMENTS ANALYSIS:');
    console.log(JSON.stringify(missingElements, null, 2));
    
    await browser.close();
    return missingElements;
    
  } catch (error) {
    await browser.close();
    console.error('❌ Check failed:', error.message);
    return null;
  }
}

checkMissingElements().then(elements => {
  if (elements) {
    console.log('\n✅ Missing elements check complete');
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`FAQ Questions: ${elements.faqQuestions.found ? elements.faqQuestions.count + ' found' : 'Not found'}`);
    console.log(`Section Backgrounds: ${elements.sectionBackgrounds.length} special backgrounds`);
    console.log(`Feature Cards: ${elements.featureCards.length} rounded cards`);
    console.log(`Auto-drafts text: ${elements.autoDrafts.length} matches`);
    console.log(`Responsive Buttons: ${elements.responsiveButtons.length} found`);
    console.log(`Rounded Elements: ${elements.roundedElements.length} found`);
  }
});