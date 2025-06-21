// Extract card background colors and Start Saving 90% block from original
import puppeteer from 'puppeteer';

async function extractCardBackgrounds() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('🔍 Extracting card backgrounds from original site...\n');
  
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  
  // 1. Pricing cards (Plus, Pro)
  console.log('💰 Pricing Cards:');
  const pricingCards = await page.evaluate(() => {
    const cards = [];
    const pricing = document.querySelector('#pricing');
    if (pricing) {
      const cardElements = pricing.querySelectorAll('.bg-surface-bg, [class*="rounded"][class*="shadow"], .card');
      cardElements.forEach(card => {
        const heading = card.querySelector('h3, h2');
        if (heading && (heading.textContent.includes('Plus') || heading.textContent.includes('Pro'))) {
          const styles = window.getComputedStyle(card);
          cards.push({
            title: heading.textContent.trim(),
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            border: styles.border,
            borderRadius: styles.borderRadius,
            className: card.className
          });
        }
      });
    }
    return cards;
  });
  console.log(pricingCards);
  
  // 2. Testimonial cards
  console.log('\n💬 Testimonial Cards:');
  const testimonialCards = await page.evaluate(() => {
    const cards = [];
    // Look for cards with testimonial content
    const allCards = document.querySelectorAll('[class*="rounded"][class*="bg-"], .bg-white');
    allCards.forEach(card => {
      const hasQuote = card.textContent.includes('Josh Graham') || 
                      card.textContent.includes('has been a game changer') ||
                      card.querySelector('img[alt*="Josh"]');
      if (hasQuote) {
        const styles = window.getComputedStyle(card);
        cards.push({
          person: 'Josh Graham (or similar)',
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          className: card.className
        });
      }
    });
    return cards;
  });
  console.log(testimonialCards);
  
  // 3. Feature cards (Auto Draft, etc.)
  console.log('\n✨ Feature Cards:');
  const featureCards = await page.evaluate(() => {
    const cards = [];
    // Look for feature cards
    const features = ['Auto-drafts', 'Schedule events', 'Auto-label'];
    features.forEach(feature => {
      const elements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.includes(feature) && 
        (el.className.includes('rounded') || el.className.includes('bg-'))
      );
      
      elements.forEach(el => {
        // Find the card container (parent with background)
        let card = el;
        while (card.parentElement && !window.getComputedStyle(card).backgroundColor.includes('rgb')) {
          card = card.parentElement;
        }
        
        const styles = window.getComputedStyle(card);
        if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          cards.push({
            feature,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            borderRadius: styles.borderRadius,
            className: card.className
          });
        }
      });
    });
    return cards;
  });
  console.log(featureCards);
  
  // 4. Start Saving 90% block
  console.log('\n🎯 Start Saving 90% Block:');
  const savingBlock = await page.evaluate(() => {
    // Look for the element containing this text
    const elements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent.includes('Start saving 90%') && 
      el.textContent.includes('of your email time')
    );
    
    if (elements.length > 0) {
      // Find the container with styling
      let container = elements[0];
      while (container.parentElement) {
        const styles = window.getComputedStyle(container);
        if (styles.backgroundImage !== 'none' || styles.backgroundColor.includes('rgb')) {
          break;
        }
        container = container.parentElement;
      }
      
      const styles = window.getComputedStyle(container);
      const rect = container.getBoundingClientRect();
      
      return {
        found: true,
        text: container.textContent.trim().substring(0, 100),
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        width: rect.width,
        height: rect.height,
        className: container.className,
        tagName: container.tagName
      };
    }
    return { found: false };
  });
  console.log(savingBlock);
  
  // 5. Cookie consent
  console.log('\n🍪 Cookie Consent:');
  const cookieConsent = await page.evaluate(() => {
    const cookie = document.querySelector('[class*="cookie"], #cookie-banner, .cookie-consent');
    if (cookie) {
      const styles = window.getComputedStyle(cookie);
      return {
        found: true,
        display: styles.display,
        visibility: styles.visibility,
        className: cookie.className
      };
    }
    return { found: false };
  });
  console.log(cookieConsent);
  
  await browser.close();
}

extractCardBackgrounds().catch(console.error);