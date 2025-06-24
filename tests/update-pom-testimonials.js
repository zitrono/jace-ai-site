import fs from 'fs';

// Read extracted testimonials data
const testimonialsData = JSON.parse(fs.readFileSync('./jace-testimonials-extracted.json', 'utf-8'));

console.log('📝 Generating POM updates for testimonials section...\n');

// Generate testimonials POM structure
const testimonialsPOM = {
  // Selectors
  selectors: {
    testimonialsSection: {
      section: 'section:has(h2:has-text("Less Email, More Productivity"))',
      jaceSelector: 'div.mx-auto.max-w-7xl', // The actual container on jace
      title: 'h2',
      subtitle: 'p:has-text("save hours every week")',
      testimonialCards: 'figure',
      testimonialQuote: 'blockquote p',
      testimonialAuthor: 'figcaption div:first-child',
      testimonialTitle: 'figcaption div:last-child',
    },
  },

  // Expected styles from jace.ai
  expectedStyles: {
    testimonialsSection: {
      backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent
      padding: '0px 32px', // From extraction
    },
    testimonialsTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'rgb(255, 220, 97)',
      textAlign: 'center',
    },
    testimonialsSubtitle: {
      fontSize: '48px',
      color: 'rgb(255, 255, 255)',
      marginTop: '16px', // Adjust based on actual
    },
    testimonialCard: {
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: '16px',
      boxShadow: testimonialsData.testimonials[0].styles.figure.boxShadow,
      padding: '24px', // Standard card padding
    },
    testimonialQuote: {
      fontSize: '14px',
      lineHeight: '24px',
      color: 'oklch(0.21 0.034 264.665)', // From jace
    },
    testimonialAuthor: {
      fontWeight: '600',
      color: 'oklch(0.21 0.034 264.665)',
    },
  },

  // Expected content from jace.ai
  expectedContent: {
    title: 'Less Email, More Productivity',
    subtitle: 'Jace users save hours every week—read their stories',
    testimonialCount: 9,
    testimonials: testimonialsData.testimonials.map((t) => ({
      quote: t.content.quote,
      author: t.content.author,
      title: t.content.title,
    })),
  },

  // Validation method to add to POM
  validationMethod: `
  async validateTestimonials() {
    const errors = [];
    
    try {
      // Check if testimonials section exists
      const sectionExists = await this.page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
          h2.textContent.includes('Less Email, More Productivity')
        );
        return !!h2;
      });
      
      if (!sectionExists) {
        errors.push('Testimonials section not found');
        return errors;
      }
      
      // Validate title and subtitle
      const titleText = await this.page.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
          h2.textContent.includes('Less Email, More Productivity')
        );
        return h2 ? h2.textContent.trim() : null;
      });
      
      if (titleText !== this.expectedContent.testimonialsTitle) {
        errors.push(\`Testimonials title mismatch: "\${titleText}" !== "\${this.expectedContent.testimonialsTitle}"\`);
      }
      
      // Validate subtitle
      const subtitleText = await this.page.evaluate(() => {
        const subtitle = Array.from(document.querySelectorAll('p')).find(p => 
          p.textContent.includes('save hours every week')
        );
        return subtitle ? subtitle.textContent.trim() : null;
      });
      
      if (!subtitleText || !subtitleText.includes('save hours every week')) {
        errors.push('Testimonials subtitle missing or incorrect');
      }
      
      // Count testimonials
      const testimonialCount = await this.page.evaluate(() => {
        if (document.querySelector('figure')) {
          // Jace structure
          return document.querySelectorAll('figure').length;
        } else {
          // Ralph structure (card-based)
          return document.querySelectorAll('.card-white').length;
        }
      });
      
      if (this.target === 'jace' && testimonialCount !== 9) {
        errors.push(\`Expected 9 testimonials, found \${testimonialCount}\`);
      }
      
    } catch (error) {
      errors.push(\`Testimonials validation error: \${error.message}\`);
    }
    
    return errors;
  }`,
};

console.log('🎨 Testimonials POM Structure:');
console.log('\nSelectors:');
Object.entries(testimonialsPOM.selectors.testimonialsSection).forEach(([key, value]) => {
  console.log(`  ${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
});

console.log('\n🎨 Expected Styles:');
console.log(`  Section BG: ${testimonialsPOM.expectedStyles.testimonialsSection.backgroundColor}`);
console.log(`  Title Size: ${testimonialsPOM.expectedStyles.testimonialsTitle.fontSize}`);
console.log(`  Title Color: ${testimonialsPOM.expectedStyles.testimonialsTitle.color}`);
console.log(`  Card BG: ${testimonialsPOM.expectedStyles.testimonialCard.backgroundColor}`);

console.log('\n📝 Expected Content:');
console.log(`  Title: "${testimonialsPOM.expectedContent.title}"`);
console.log(`  Subtitle: "${testimonialsPOM.expectedContent.subtitle}"`);
console.log(`  Testimonial Count: ${testimonialsPOM.expectedContent.testimonialCount}`);

console.log('\n✅ POM Updates Needed:');
console.log('1. Update testimonials selectors in POM');
console.log('2. Add testimonials to expectedStyles');
console.log('3. Update validateTestimonials method to validate both jace and ralph');
console.log('4. Ensure ralph testimonials match jace content exactly');

// Save the updates
fs.writeFileSync('./testimonials-pom-updates.json', JSON.stringify(testimonialsPOM, null, 2));
console.log('\n💾 Saved POM updates to testimonials-pom-updates.json');
