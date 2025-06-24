import puppeteer from 'puppeteer';
import fs from 'fs';

async function extractJaceTestimonialsComplete() {
  console.log('🔍 Extracting complete testimonials section from jace.ai...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 },
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://jace.ai', { waitUntil: 'networkidle0' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Scroll to testimonials area
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.8));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Extract complete testimonials data
    const testimonialsData = await page.evaluate(() => {
      // Find all testimonials
      const testimonials = [];
      document.querySelectorAll('figure').forEach((figure) => {
        const blockquote = figure.querySelector('blockquote');
        const figcaption = figure.querySelector('figcaption');

        if (blockquote && figcaption) {
          const quote = blockquote.querySelector('p');
          const authorName = figcaption.querySelector('div:first-child');
          const authorTitle = figcaption.querySelector('div:last-child');

          if (quote) {
            // Get styles for testimonial card
            const figureStyles = window.getComputedStyle(figure);
            const blockquoteStyles = window.getComputedStyle(blockquote);
            const quoteStyles = quote ? window.getComputedStyle(quote) : null;

            testimonials.push({
              content: {
                quote: quote.textContent.trim(),
                author: authorName ? authorName.textContent.trim() : '',
                title:
                  authorTitle && authorTitle !== authorName ? authorTitle.textContent.trim() : '',
              },
              styles: {
                figure: {
                  className: figure.className,
                  backgroundColor: figureStyles.backgroundColor,
                  borderRadius: figureStyles.borderRadius,
                  boxShadow: figureStyles.boxShadow,
                  padding: figureStyles.padding,
                },
                blockquote: {
                  className: blockquote.className,
                  padding: blockquoteStyles.padding,
                  fontSize: blockquoteStyles.fontSize,
                  fontWeight: blockquoteStyles.fontWeight,
                  color: blockquoteStyles.color,
                },
                quote: quoteStyles
                  ? {
                      fontSize: quoteStyles.fontSize,
                      lineHeight: quoteStyles.lineHeight,
                      color: quoteStyles.color,
                    }
                  : null,
              },
            });
          }
        }
      });

      // Find the section containing testimonials
      let sectionData = null;
      const firstFigure = document.querySelector('figure[class*="rounded-2xl"]');
      if (firstFigure) {
        let currentElement = firstFigure;

        // Navigate up to find the section
        while (currentElement) {
          const h2 = currentElement.querySelector ? currentElement.querySelector('h2') : null;
          if (h2 && h2.textContent.includes('Less Email')) {
            const subtitle = Array.from(currentElement.querySelectorAll('p')).find((p) =>
              p.textContent.includes('save hours every week')
            );

            const sectionStyles = window.getComputedStyle(currentElement);
            const h2Styles = window.getComputedStyle(h2);
            const subtitleStyles = subtitle ? window.getComputedStyle(subtitle) : null;

            sectionData = {
              structure: {
                tag: currentElement.tagName,
                className: currentElement.className,
                id: currentElement.id || null,
              },
              content: {
                title: h2.textContent.trim(),
                subtitle: subtitle ? subtitle.textContent.trim() : null,
              },
              styles: {
                section: {
                  backgroundColor: sectionStyles.backgroundColor,
                  padding: sectionStyles.padding,
                  marginTop: sectionStyles.marginTop,
                  marginBottom: sectionStyles.marginBottom,
                },
                title: {
                  fontSize: h2Styles.fontSize,
                  fontWeight: h2Styles.fontWeight,
                  color: h2Styles.color,
                  textAlign: h2Styles.textAlign,
                  marginBottom: h2Styles.marginBottom,
                },
                subtitle: subtitleStyles
                  ? {
                      fontSize: subtitleStyles.fontSize,
                      color: subtitleStyles.color,
                      marginBottom: subtitleStyles.marginBottom,
                    }
                  : null,
              },
            };
            break;
          }
          currentElement = currentElement.parentElement;
        }
      }

      return {
        section: sectionData,
        testimonials: testimonials,
        testimonialsCount: testimonials.length,
      };
    });

    // Save extracted data
    const outputPath = './jace-testimonials-extracted.json';
    fs.writeFileSync(outputPath, JSON.stringify(testimonialsData, null, 2));

    console.log('✅ TESTIMONIALS FOUND ON JACE.AI!');
    console.log(`\n📊 Section: "${testimonialsData.section?.content?.title}"`);
    console.log(`📝 Subtitle: "${testimonialsData.section?.content?.subtitle}"`);
    console.log(`🗣️ Total testimonials: ${testimonialsData.testimonialsCount}`);

    console.log('\n🎨 Section Styles:');
    if (testimonialsData.section?.styles) {
      console.log(`  Background: ${testimonialsData.section.styles.section.backgroundColor}`);
      console.log(`  Padding: ${testimonialsData.section.styles.section.padding}`);
      console.log(`  Title Size: ${testimonialsData.section.styles.title.fontSize}`);
      console.log(`  Title Weight: ${testimonialsData.section.styles.title.fontWeight}`);
    }

    console.log('\n📢 First 3 Testimonials:');
    testimonialsData.testimonials.slice(0, 3).forEach((t, i) => {
      console.log(`\n${i + 1}. "${t.content.quote.substring(0, 80)}..."`);
      console.log(`   - ${t.content.author}`);
      console.log(`   - ${t.content.title}`);
    });

    console.log('\n💾 Full data saved to jace-testimonials-extracted.json');

    return testimonialsData;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Run extraction
extractJaceTestimonialsComplete().catch(console.error);
