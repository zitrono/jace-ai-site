import puppeteer from 'puppeteer';

async function extractJaceTestimonials() {
  console.log('🔍 Searching for testimonials on jace.ai...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Search for testimonials section
    const testimonialsData = await page.evaluate(() => {
      // Search for testimonials text variations
      const searchTexts = [
        "Jace users save hours every week—read their stories",
        "Jace users save hours every week",
        "read their stories",
        "save hours every week",
        "testimonial",
        "stories"
      ];
      
      let testimonialsSection = null;
      
      // First, log all h2 elements to see what sections exist
      console.log('All H2 elements on page:');
      document.querySelectorAll('h2').forEach(h2 => {
        console.log(`- "${h2.textContent?.trim()}"`);
      });
      
      // Search for testimonials
      for (const searchText of searchTexts) {
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          if (el.textContent?.toLowerCase().includes(searchText.toLowerCase())) {
            // Found potential match! Find parent section
            let parent = el;
            while (parent && parent.tagName !== 'SECTION') {
              parent = parent.parentElement;
            }
            if (parent && parent.querySelector('h2')) {
              testimonialsSection = parent;
              console.log(`Found with search text: "${searchText}"`);
              break;
            }
          }
        }
        if (testimonialsSection) break;
      }
      
      if (!testimonialsSection) {
        return { found: false, message: 'Testimonials section not found' };
      }
      
      // Extract testimonial details
      const data = {
        found: true,
        sectionTitle: testimonialsSection.querySelector('h2')?.textContent?.trim(),
        sectionSubtitle: Array.from(testimonialsSection.querySelectorAll('p')).find(p => p.textContent?.includes(searchText))?.textContent?.trim(),
        testimonials: []
      };
      
      // Find testimonial cards
      const cards = testimonialsSection.querySelectorAll('div[class*="bg-white"], div[class*="card"], blockquote');
      
      cards.forEach(card => {
        const testimonial = {
          text: card.querySelector('p, blockquote')?.textContent?.trim(),
          author: card.querySelector('p:last-child, cite, .author')?.textContent?.trim(),
          role: card.querySelector('.role, .title')?.textContent?.trim(),
          rating: card.querySelectorAll('svg[class*="star"], .star').length
        };
        if (testimonial.text) {
          data.testimonials.push(testimonial);
        }
      });
      
      // Get section styles
      const styles = window.getComputedStyle(testimonialsSection);
      data.styles = {
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        marginTop: styles.marginTop,
        marginBottom: styles.marginBottom
      };
      
      // Get title styles if exists
      const title = testimonialsSection.querySelector('h2');
      if (title) {
        const titleStyles = window.getComputedStyle(title);
        data.titleStyles = {
          fontSize: titleStyles.fontSize,
          fontWeight: titleStyles.fontWeight,
          color: titleStyles.color,
          textAlign: titleStyles.textAlign
        };
      }
      
      return data;
    });
    
    if (testimonialsData.found) {
      console.log('✅ TESTIMONIALS FOUND ON JACE.AI!\n');
      console.log(`📝 Section Title: "${testimonialsData.sectionTitle}"`);
      console.log(`📝 Section Subtitle: "${testimonialsData.sectionSubtitle}"`);
      console.log(`📊 Number of testimonials: ${testimonialsData.testimonials.length}`);
      
      if (testimonialsData.testimonials.length > 0) {
        console.log('\n🗣️ Testimonials found:');
        testimonialsData.testimonials.forEach((t, i) => {
          console.log(`\n${i + 1}. "${t.text?.substring(0, 100)}..."`);
          if (t.author) console.log(`   - ${t.author}`);
        });
      }
      
      console.log('\n🎨 Section Styles:');
      console.log(`  Background: ${testimonialsData.styles.backgroundColor}`);
      console.log(`  Padding: ${testimonialsData.styles.padding}`);
      
      if (testimonialsData.titleStyles) {
        console.log('\n🎨 Title Styles:');
        console.log(`  Font Size: ${testimonialsData.titleStyles.fontSize}`);
        console.log(`  Font Weight: ${testimonialsData.titleStyles.fontWeight}`);
        console.log(`  Color: ${testimonialsData.titleStyles.color}`);
      }
    } else {
      console.log('❌ Testimonials section not found with the search text');
    }
    
    return testimonialsData;
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

extractJaceTestimonials().catch(console.error);