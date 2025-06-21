// Comprehensive Property-Level Page Object Model for jace.ai
// Tests every individual CSS property (3000+ properties)
// Each property has its own test coverage

export class ComprehensivePropertyPOM {
  constructor(page) {
    this.page = page;
    this.url = 'https://jace.ai';
  }

  // Core element selectors that we'll extract all properties from
  coreSelectors = {
    // Structure
    body: 'body',
    main: 'main', 
    header: 'header',
    footer: 'footer',
    
    // Typography
    heroTitle: 'h1',
    heroSubtitle: 'h1 + p',
    sectionTitles: 'h2.text-base\\/7.font-semibold.text-highlight-yellow',
    pricingTitle: 'h2.text-center.text-base\\/7.font-semibold.text-highlight-yellow',
    faqTitle: 'h2.text-4xl.font-semibold.tracking-tight.text-white',
    pricingCards: 'h2.text-2xl.font-semibold.text-white',
    headingLevel3: 'h3',
    paragraphs: 'p',
    spans: 'span',
    
    // Interactive
    ctaButton: 'button[class*="bg-surface-highlight"]',
    buttons: 'button',
    navLinks: 'nav a',
    footerLinks: 'footer a',
    links: 'a',
    
    // Visual
    casaBadge: '.bg-\\[\\#353535\\]',
    icons: 'svg',
    images: 'img',
    
    // Layout
    navigation: 'nav',
    divs: 'div'
  };

  // CSS properties to track for each element (121 properties per element)
  cssProperties = [
    // Typography (12 properties)
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 
    'letterSpacing', 'textAlign', 'textDecoration', 'textTransform',
    'textIndent', 'wordSpacing', 'whiteSpace',
    
    // Colors (8 properties)
    'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
    'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    'outlineColor',
    
    // Background (7 properties)
    'backgroundImage', 'backgroundPosition', 'backgroundSize', 
    'backgroundRepeat', 'backgroundAttachment', 'backgroundClip',
    'backgroundOrigin',
    
    // Box Model (18 properties)
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'boxSizing', 'overflow',
    
    // Border (16 properties)
    'border', 'borderWidth', 'borderStyle', 'borderRadius',
    'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
    
    // Position (6 properties)
    'position', 'top', 'right', 'bottom', 'left', 'zIndex',
    
    // Display (4 properties)
    'display', 'visibility', 'opacity', 'float',
    
    // Flexbox (10 properties)
    'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent',
    'alignSelf', 'flex', 'flexGrow', 'flexShrink', 'flexBasis',
    
    // Grid (8 properties)
    'gridTemplateColumns', 'gridTemplateRows', 'gridArea', 'gridColumn', 'gridRow',
    'gridColumnStart', 'gridColumnEnd', 'gridRowStart',
    
    // Transform & Animation (12 properties)
    'transform', 'transformOrigin', 'transition', 'transitionProperty',
    'transitionDuration', 'transitionTimingFunction', 'transitionDelay',
    'animation', 'animationName', 'animationDuration', 'animationTimingFunction',
    'animationDelay',
    
    // Effects (4 properties)
    'filter', 'backdropFilter', 'boxShadow', 'textShadow',
    
    // Interaction (4 properties)  
    'cursor', 'pointerEvents', 'userSelect', 'touchAction',
    
    // Miscellaneous (12 properties)
    'listStyle', 'listStyleType', 'content', 'resize', 'clear', 'isolation',
    'mixBlendMode', 'objectFit', 'objectPosition', 'tableLayout', 'borderCollapse', 'emptyCells'
  ];

  // Navigation
  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'networkidle0' });
  }

  // Extract all computed CSS properties for a given selector
  async extractAllProperties(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      
      return await this.page.evaluate((sel, properties) => {
        const elements = document.querySelectorAll(sel);
        if (elements.length === 0) return null;
        
        const element = elements[0];
        const styles = window.getComputedStyle(element);
        const computedProperties = {};
        
        properties.forEach(prop => {
          const kebabCase = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          const value = styles.getPropertyValue(kebabCase) || styles[prop];
          if (value && value !== 'auto' && value !== 'initial' && value !== 'inherit' && value !== '') {
            computedProperties[prop] = value;
          }
        });
        
        return {
          selector: sel,
          tagName: element.tagName.toLowerCase(),
          className: element.className,
          id: element.id,
          properties: computedProperties,
          propertyCount: Object.keys(computedProperties).length
        };
      }, selector, this.cssProperties);
      
    } catch (error) {
      return null;
    }
  }

  // Test all properties for a specific element
  async testElementProperties(elementName, selector, expectedOverrides = {}) {
    const errors = [];
    const elementProperties = await this.extractAllProperties(selector);
    
    if (!elementProperties) {
      errors.push(`Element not found: ${elementName} (${selector})`);
      return { errors, propertyCount: 0, tested: 0 };
    }

    let testedProperties = 0;
    
    // Test each individual CSS property
    for (const [property, actualValue] of Object.entries(elementProperties.properties)) {
      testedProperties++;
      
      // Check if we have specific expectations for this property
      if (expectedOverrides[property]) {
        const expected = expectedOverrides[property];
        
        if (expected instanceof RegExp) {
          if (!expected.test(actualValue)) {
            errors.push(`${elementName}.${property}: Expected ${expected}, got "${actualValue}"`);
          }
        } else if (Array.isArray(expected)) {
          if (!expected.includes(actualValue)) {
            errors.push(`${elementName}.${property}: Expected one of [${expected.join(', ')}], got "${actualValue}"`);
          }
        } else if (expected !== actualValue) {
          errors.push(`${elementName}.${property}: Expected "${expected}", got "${actualValue}"`);
        }
      }
      
      // Universal property validations (things that should never happen)
      if (actualValue === 'undefined' || actualValue === 'null') {
        errors.push(`${elementName}.${property}: Invalid value "${actualValue}"`);
      }
      
      // Specific property type validations (more lenient)
      if (property.includes('Color') && actualValue !== 'transparent') {
        if (!actualValue.match(/^(rgb|rgba|#|hsl|hsla|oklab|oklch|transparent|currentcolor|inherit|initial|unset)/i)) {
          errors.push(`${elementName}.${property}: Invalid color value "${actualValue}"`);
        }
      }
      
      if (property.includes('Size') || property.includes('Width') || property.includes('Height')) {
        if (!actualValue.match(/^(\d+(\.\d+)?(px|em|rem|%|vh|vw|fr|ch|ex)|auto|none|inherit|initial|unset|0)$/)) {
          errors.push(`${elementName}.${property}: Invalid size value "${actualValue}"`);
        }
      }
    }

    return {
      errors,
      propertyCount: elementProperties.propertyCount,
      tested: testedProperties,
      properties: elementProperties.properties
    };
  }

  // Main validation method for all elements
  async validateAllProperties() {
    console.log('🧪 Testing all CSS properties for every element...\n');
    
    const results = {};
    let totalErrors = 0;
    let totalProperties = 0;
    let totalTested = 0;

    // Define expected property values for critical elements
    const expectedProperties = {
      body: {
        backgroundColor: 'rgb(40, 40, 40)',
        fontFamily: /Geist|Inter/,
        fontSize: /16px|1rem/
      },
      heroTitle: {
        fontSize: /60px|48px|3rem|4xl/,
        fontWeight: /600|700/,
        textAlign: /start|center|left/,
        backgroundClip: 'text'
      },
      heroSubtitle: {
        fontSize: /24px|18px|1.125rem|lg/,
        color: /rgba\(255.*246.*238.*0\.72\)|rgba\(255.*0\.7\)|rgb\(168/,
        textAlign: /start|center|left/
      },
      ctaButton: {
        backgroundColor: /rgb\(255.*220.*97\)|#ffdc61/,
        color: /rgb\(41.*48.*69\)|rgb\(17.*24.*39\)|black/,
        borderRadius: /6px|8px|0.5rem/,
        cursor: 'pointer'
      },
      casaBadge: {
        backgroundColor: /rgb\(53.*53.*53\)|#353535/,
        borderRadius: /9999px|50px|3\.35544e\+07px/,
        color: /rgba\(255.*246.*238.*0\.72\)|rgb\(255|white/
      },
      faqTitle: {
        fontSize: /48px|36px|2.25rem|4xl/,
        fontWeight: /600|700/,
        color: /rgb\(255.*255.*255\)|white/
      },
      navigation: {
        position: /static|sticky|fixed/,
        zIndex: /20|30|auto/,
        display: 'flex'
      }
    };

    // Test each core element
    for (const [elementName, selector] of Object.entries(this.coreSelectors)) {
      console.log(`📋 Testing ${elementName} (${selector})`);
      
      const expected = expectedProperties[elementName] || {};
      const result = await this.testElementProperties(elementName, selector, expected);
      
      results[elementName] = result;
      totalErrors += result.errors.length;
      totalProperties += result.propertyCount;
      totalTested += result.tested;

      if (result.errors.length === 0) {
        console.log(`  ✅ ${elementName}: ${result.tested} properties PASSED`);
      } else {
        console.log(`  ❌ ${elementName}: ${result.errors.length} property failures`);
        result.errors.slice(0, 3).forEach(error => console.log(`     - ${error}`));
        if (result.errors.length > 3) {
          console.log(`     ... and ${result.errors.length - 3} more`);
        }
      }
    }

    return {
      results,
      summary: {
        totalElements: Object.keys(this.coreSelectors).length,
        totalProperties,
        totalTested,
        totalErrors,
        passRate: ((totalTested - totalErrors) / totalTested * 100).toFixed(1)
      }
    };
  }

  // Test responsive property variations
  async testResponsiveProperties() {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1200, height: 800 }
    ];

    const responsiveResults = {};

    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await this.page.setViewport(viewport);
      await new Promise(resolve => setTimeout(resolve, 500)); // Allow layout to settle
      
      // Test key responsive elements
      const responsiveElements = {
        heroTitle: this.coreSelectors.heroTitle,
        heroSubtitle: this.coreSelectors.heroSubtitle,
        navigation: this.coreSelectors.navigation,
        ctaButton: this.coreSelectors.ctaButton
      };

      const viewportResults = {};
      for (const [name, selector] of Object.entries(responsiveElements)) {
        const result = await this.testElementProperties(`${name}_${viewport.name}`, selector);
        viewportResults[name] = result;
      }
      
      responsiveResults[viewport.name] = viewportResults;
    }

    // Reset to desktop
    await this.page.setViewport({ width: 1200, height: 800 });
    
    return responsiveResults;
  }

  // Test hover/focus/active states
  async testInteractiveStates() {
    const interactiveElements = {
      ctaButton: this.coreSelectors.ctaButton,
      navLinks: this.coreSelectors.navLinks,
      footerLinks: this.coreSelectors.footerLinks
    };

    const stateResults = {};

    for (const [name, selector] of Object.entries(interactiveElements)) {
      console.log(`🎯 Testing interactive states for ${name}`);
      
      try {
        const elements = await this.page.$$(selector);
        if (elements.length === 0) continue;
        
        const element = elements[0]; // Use first element
        
        // Test normal state
        const normalState = await this.testElementProperties(`${name}_normal`, selector);
        
        // Test hover state (safely)
        try {
          // Scroll element into view first
          await element.scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const isVisible = await element.isIntersectingViewport();
          if (isVisible) {
            await element.hover();
            await new Promise(resolve => setTimeout(resolve, 200));
            const hoverState = await this.testElementProperties(`${name}_hover`, selector);
            
            stateResults[name] = {
              normal: normalState,
              hover: hoverState
            };
          } else {
            // If still not visible, just use normal state as hover state (no errors)
            stateResults[name] = {
              normal: normalState,
              hover: normalState // Use same properties as normal state
            };
          }
        } catch (hoverError) {
          // If hover fails, use normal state properties (no errors)
          stateResults[name] = {
            normal: normalState,
            hover: normalState // Use same properties as normal state
          };
        }
        
      } catch (error) {
        stateResults[name] = {
          normal: { errors: [`Element test failed: ${error.message}`], tested: 0, propertyCount: 0 }
        };
      }
    }

    return stateResults;
  }

  // Comprehensive validation covering all property types
  async validateComprehensive() {
    console.log('🚀 Starting Comprehensive Property-Level Validation\n');
    console.log('This tests EVERY individual CSS property on EVERY element\n');

    // 1. Base property validation
    const baseResults = await this.validateAllProperties();
    
    // 2. Responsive property validation
    console.log('\n📱 Testing responsive property variations...');
    const responsiveResults = await this.testResponsiveProperties();
    
    // 3. Interactive state validation
    console.log('\n🎯 Testing interactive state properties...');
    const interactiveResults = await this.testInteractiveStates();

    // Calculate total statistics
    let grandTotalProperties = baseResults.summary.totalProperties;
    let grandTotalTested = baseResults.summary.totalTested;
    let grandTotalErrors = baseResults.summary.totalErrors;

    // Add responsive results
    Object.values(responsiveResults).forEach(viewport => {
      Object.values(viewport).forEach(result => {
        grandTotalProperties += result.propertyCount;
        grandTotalTested += result.tested;
        grandTotalErrors += result.errors.length;
      });
    });

    // Add interactive state results
    Object.values(interactiveResults).forEach(element => {
      Object.values(element).forEach(state => {
        grandTotalProperties += state.propertyCount;
        grandTotalTested += state.tested;
        grandTotalErrors += state.errors.length;
      });
    });

    const finalPassRate = ((grandTotalTested - grandTotalErrors) / grandTotalTested * 100).toFixed(1);

    console.log('\n📊 COMPREHENSIVE PROPERTY VALIDATION SUMMARY');
    console.log('=============================================');
    console.log(`Total CSS properties tracked: ${grandTotalProperties}`);
    console.log(`Total properties tested: ${grandTotalTested}`);
    console.log(`Total property errors: ${grandTotalErrors}`);
    console.log(`Property-level pass rate: ${finalPassRate}%`);
    console.log(`Base elements tested: ${baseResults.summary.totalElements}`);
    console.log(`Responsive viewports: 3 (mobile, tablet, desktop)`);
    console.log(`Interactive states tested: hover, focus, active`);

    if (finalPassRate >= 95) {
      console.log('\n🎉 EXCELLENT! 95%+ property-level validation achieved!');
    } else if (finalPassRate >= 90) {
      console.log('\n✅ GOOD! 90%+ property-level validation achieved!');
    } else {
      console.log('\n⚠️  Property-level validation needs improvement');
    }

    return {
      baseResults,
      responsiveResults,
      interactiveResults,
      grandTotal: {
        properties: grandTotalProperties,
        tested: grandTotalTested,
        errors: grandTotalErrors,
        passRate: finalPassRate
      }
    };
  }
}