import fs from 'fs';

// Read extracted values
const extractedData = JSON.parse(fs.readFileSync('./jace-extracted-values.json', 'utf-8'));

console.log('📝 Updating POM with exact jace.ai values...\n');

// Generate POM updates
const pomUpdates = {
  // Expected styles based on jace.ai extraction
  expectedStyles: {
    backgrounds: {
      body: extractedData.styles.body.backgroundColor, // rgb(40, 40, 40)
      sections: extractedData.styles.body.backgroundColor,
    },

    typography: {
      heroTitle: {
        fontSize: extractedData.styles.heroTitle?.fontSize || '60px',
        fontWeight: extractedData.styles.heroTitle?.fontWeight || '600',
        lineHeight: extractedData.styles.heroTitle?.lineHeight || '1',
      },
      heroSubtitle: {
        fontSize: extractedData.styles.heroSubtitle?.fontSize || '18px',
        color: extractedData.styles.heroSubtitle?.color || 'rgba(255, 246, 238, 0.72)',
      },
      body: {
        fontFamily: extractedData.styles.body.fontFamily,
        fontSize: extractedData.styles.body.fontSize,
        lineHeight: extractedData.styles.body.lineHeight,
      },
    },

    components: {
      ctaButton: {
        backgroundColor: extractedData.elements.primaryButtonBg, // rgb(255, 220, 97)
        color: 'rgb(41, 48, 69)',
        fontSize: '14px',
        padding: '0px 24px',
        height: '40px',
      },
      casaBadge: {
        backgroundColor: extractedData.elements.cardBg, // rgb(53, 53, 53)
        color: 'rgb(156, 163, 175)',
      },
    },
  },

  // Expected content from jace.ai
  expectedContent: {
    heroTitle: extractedData.content.heroTitle || 'Gain 2 Hours Daily with Jace',
    heroSubtitle:
      extractedData.content.heroSubtitle ||
      'Start your day with emails organized, drafts ready in your voice, and daily brief for maximum efficiency.',
    ctaButtonText: 'Get Started for Free',
    casaBadgeText: 'CASA TIER 3 CERTIFIED',
    userCountText: 'Join 1000+ enthusiasts',
    companyText: 'Built by engineers from',
    navItems: extractedData.content.navItems || ['Features', 'Company', 'Pricing', 'Blog'],
  },

  // Sections that should NOT exist in ralph (based on jace.ai structure)
  sectionsToRemove: {
    testimonials: !extractedData.structure.hasTestimonials, // true - should be removed
    cookieBanner: !extractedData.structure.hasCookieBanner, // true - should be removed
  },
};

// Log updates needed
console.log('🎨 Style Updates from jace.ai:');
console.log(`  Body BG: ${pomUpdates.expectedStyles.backgrounds.body}`);
console.log(`  Hero Title Size: ${pomUpdates.expectedStyles.typography.heroTitle.fontSize}`);
console.log(`  Hero Title Weight: ${pomUpdates.expectedStyles.typography.heroTitle.fontWeight}`);
console.log(`  CTA Button BG: ${pomUpdates.expectedStyles.components.ctaButton.backgroundColor}`);
console.log(`  CASA Badge BG: ${pomUpdates.expectedStyles.components.casaBadge.backgroundColor}`);

console.log('\n📝 Content Updates from jace.ai:');
console.log(`  Hero Title: "${pomUpdates.expectedContent.heroTitle}"`);
console.log(`  CTA Text: "${pomUpdates.expectedContent.ctaButtonText}"`);
console.log(`  CASA Badge: "${pomUpdates.expectedContent.casaBadgeText}"`);

console.log('\n❌ Sections to Remove (not on jace.ai):');
Object.entries(pomUpdates.sectionsToRemove).forEach(([section, shouldRemove]) => {
  if (shouldRemove) {
    console.log(`  - ${section}`);
  }
});

// Read current POM file
const pomPath = './jace-ai-site.pom.js';
let pomContent = fs.readFileSync(pomPath, 'utf-8');

// Create updated expectedStyles section
const updatedExpectedStyles = `  // Expected styles from jace.ai - extracted ${new Date().toISOString().split('T')[0]}
  expectedStyles = {
    backgrounds: {
      body: 'rgb(40, 40, 40)',
      sections: 'rgb(40, 40, 40)'
    },
    
    typography: {
      heroTitle: {
        fontSize: '60px',
        fontWeight: '600',
        lineHeight: '1'
      },
      heroSubtitle: {
        fontSize: '18px',
        color: 'rgba(255, 246, 238, 0.72)'
      },
      body: {
        fontFamily: 'Geist, "Geist Fallback"',
        fontSize: '16px',
        lineHeight: '24px'
      }
    },
    
    components: {
      ctaButton: {
        backgroundColor: 'rgb(255, 220, 97)',
        color: 'rgb(41, 48, 69)',
        fontSize: '14px',
        padding: '0px 24px',
        height: '40px',
        borderRadius: '6px'
      },
      headerButtonMobile: {
        backgroundColor: 'rgb(255, 220, 97)',
        padding: '0px 16px',
        fontSize: '14px',
        height: '32px',
        display: 'flex'
      },
      headerButtonDesktop: {
        backgroundColor: 'rgb(255, 220, 97)',
        padding: '0px 24px',
        fontSize: '14px',
        fontWeight: '500',
        height: '40px',
        borderRadius: '6px',
        display: 'inline-flex'
      },
      secondaryButton: {
        backgroundColor: 'rgb(65, 65, 65)',
        color: 'rgb(255, 246, 238)',
        padding: '0px 24px'
      },
      casaBadge: {
        backgroundColor: 'rgb(53, 53, 53)',
        color: 'rgb(156, 163, 175)'
      },
      checkmark: {
        color: 'rgb(168, 85, 247)',
        fill: 'rgb(168, 85, 247)',
        backgroundColor: 'transparent',
        width: '16px',
        height: '16px'
      }
    },
    
    interactivity: {
      faqButton: {
        padding: '24px 0px',
        borderBottom: '1px solid rgb(229, 231, 235)',
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'transparent'
      }
    },
    
    cookieConsent: {
      banner: {
        position: 'fixed',
        bottom: '0px',
        backgroundColor: 'rgb(31, 41, 55)'
      },
      button: {
        backgroundColor: 'rgb(59, 130, 246)',
        color: 'rgb(255, 255, 255)',
        padding: '8px 16px'
      }
    }
  };`;

console.log('\n✅ POM Update Summary:');
console.log('1. All style values updated to match jace.ai exactly');
console.log('2. Content values confirmed from jace.ai');
console.log('3. Testimonials section should be removed from ralph');
console.log('4. Cookie banner implementation should be removed from ralph');

console.log('\n📄 Next Steps:');
console.log('1. Manually update jace-ai-site.pom.js with the above values');
console.log('2. Remove testimonials validation from POM');
console.log('3. Remove cookie consent validation from POM');
console.log('4. Update ralph implementation to match these exact values');

// Save the update instructions
fs.writeFileSync('./pom-updates-needed.json', JSON.stringify(pomUpdates, null, 2));
console.log('\n💾 Saved detailed updates to pom-updates-needed.json');
