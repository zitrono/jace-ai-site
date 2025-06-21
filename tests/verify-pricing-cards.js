// Verify pricing card backgrounds match original exactly
import puppeteer from 'puppeteer';

async function verifyPricingCards() {
  console.log('🎯 Verifying Pricing Card Backgrounds...\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });

  const pricingCards = await page.$$eval('#pricing .card', cards => 
    cards.map(card => {
      const styles = window.getComputedStyle(card);
      const heading = card.querySelector('h3')?.textContent?.trim();
      const button = card.querySelector('button');
      const buttonStyles = button ? window.getComputedStyle(button) : null;
      
      return {
        title: heading,
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        buttonClass: button?.className || '',
        buttonBackground: buttonStyles?.backgroundColor || ''
      };
    })
  );

  console.log('📊 Refactor Pricing Cards:');
  pricingCards.forEach((card, i) => {
    console.log(`${i + 1}. ${card.title}:`);
    console.log(`   Background: ${card.backgroundColor}`);
    console.log(`   Border radius: ${card.borderRadius}`);
    console.log(`   Button class: ${card.buttonClass.includes('btn-secondary') ? 'btn-secondary ✅' : card.buttonClass}`);
    console.log(`   Button background: ${card.buttonBackground}`);
    console.log('');
  });

  // Expected from original
  const expectedBackground = 'rgb(53, 53, 53)';
  const expectedBorderRadius = '24px';

  console.log('✅ Verification Results:');
  let allMatch = true;
  
  pricingCards.forEach((card, i) => {
    if (card.backgroundColor !== expectedBackground) {
      console.log(`❌ ${card.title} background mismatch: ${card.backgroundColor} (expected: ${expectedBackground})`);
      allMatch = false;
    } else {
      console.log(`✅ ${card.title} background matches original`);
    }
    
    if (!card.buttonClass.includes('btn-secondary')) {
      console.log(`❌ ${card.title} button should be btn-secondary`);
      allMatch = false;
    } else {
      console.log(`✅ ${card.title} button is btn-secondary`);
    }
  });

  if (allMatch) {
    console.log('\n🎉 All pricing cards match original specifications!');
  } else {
    console.log('\n❌ Some pricing cards need fixes');
  }

  await browser.close();
  return allMatch;
}

verifyPricingCards().catch(console.error);