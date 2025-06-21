// Analyze all CSS properties for each element on jace.ai
import puppeteer from 'puppeteer';

const JACE_AI_URL = 'https://jace.ai';

async function analyzeAllProperties() {
  console.log('🔍 Analyzing all CSS properties for comprehensive POM...\n');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(JACE_AI_URL, { waitUntil: 'networkidle0' });
  
  // Core selectors to analyze
  const coreSelectors = [
    // Body and main structure
    'body',
    'main',
    'header',
    'footer',
    'section',
    
    // Typography elements
    'h1',
    'h2',
    'h3',
    'p',
    'span',
    
    // Interactive elements
    'button',
    'a',
    'input',
    
    // Layout elements
    'div',
    'nav',
    
    // Specific jace.ai elements
    'h1', // Hero title
    'h1 + p', // Hero subtitle
    'button[class*="bg-surface-highlight"]', // CTA button
    '.bg-\\[\\#353535\\]', // CASA badge
    'h2.text-base\\/7.font-semibold.text-highlight-yellow', // Section titles
    'h2.text-center.text-base\\/7.font-semibold.text-highlight-yellow', // Pricing title
    'h2.text-4xl.font-semibold.tracking-tight.text-white', // FAQ title
    'h2.text-2xl.font-semibold.text-white', // Pricing cards
    'svg', // Icons
    'img', // Images
    'nav a', // Navigation links
    'footer a' // Footer links
  ];

  const allProperties = [];
  let totalPropertyCount = 0;

  for (const selector of coreSelectors) {
    try {
      console.log(`\n📋 Analyzing selector: ${selector}`);
      
      const elementProperties = await page.evaluate((sel) => {
        const elements = document.querySelectorAll(sel);
        if (elements.length === 0) return null;
        
        const element = elements[0]; // Take first match
        const styles = window.getComputedStyle(element);
        
        // Comprehensive CSS properties to track
        const cssProperties = [
          // Typography
          'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 
          'letterSpacing', 'textAlign', 'textDecoration', 'textTransform',
          'textIndent', 'wordSpacing', 'whiteSpace',
          
          // Colors
          'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
          'borderRightColor', 'borderBottomColor', 'borderLeftColor',
          'outlineColor', 'caretColor',
          
          // Background
          'backgroundImage', 'backgroundPosition', 'backgroundSize', 
          'backgroundRepeat', 'backgroundAttachment', 'backgroundClip',
          'backgroundOrigin',
          
          // Box Model
          'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
          'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
          'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
          
          // Border
          'border', 'borderWidth', 'borderStyle', 'borderRadius',
          'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
          'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
          'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
          'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
          
          // Position
          'position', 'top', 'right', 'bottom', 'left', 'zIndex',
          
          // Display
          'display', 'visibility', 'opacity', 'overflow', 'overflowX', 'overflowY',
          
          // Flexbox
          'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent',
          'alignSelf', 'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'order',
          
          // Grid
          'gridTemplateColumns', 'gridTemplateRows', 'gridArea', 'gridColumn', 'gridRow',
          'gridColumnStart', 'gridColumnEnd', 'gridRowStart', 'gridRowEnd',
          'gridGap', 'columnGap', 'rowGap',
          
          // Transform & Animation
          'transform', 'transformOrigin', 'transition', 'transitionProperty',
          'transitionDuration', 'transitionTimingFunction', 'transitionDelay',
          'animation', 'animationName', 'animationDuration', 'animationTimingFunction',
          'animationDelay', 'animationIterationCount', 'animationDirection',
          'animationFillMode', 'animationPlayState',
          
          // Effects
          'filter', 'backdropFilter', 'boxShadow', 'textShadow',
          
          // Cursor & User Interaction
          'cursor', 'pointerEvents', 'userSelect', 'touchAction',
          
          // Content
          'content', 'quotes', 'counterReset', 'counterIncrement',
          
          // Table
          'tableLayout', 'borderCollapse', 'borderSpacing', 'emptyCells',
          
          // Lists
          'listStyle', 'listStyleType', 'listStylePosition', 'listStyleImage',
          
          // Miscellaneous
          'resize', 'boxSizing', 'float', 'clear', 'isolation', 'mixBlendMode',
          'objectFit', 'objectPosition'
        ];
        
        const computedProperties = {};
        cssProperties.forEach(prop => {
          const value = styles.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase()) || styles[prop];
          if (value && value !== 'auto' && value !== 'initial' && value !== 'inherit') {
            computedProperties[prop] = value;
          }
        });
        
        return {
          selector: sel,
          tagName: element.tagName.toLowerCase(),
          className: element.className,
          properties: computedProperties,
          propertyCount: Object.keys(computedProperties).length
        };
      }, selector);

      if (elementProperties) {
        allProperties.push(elementProperties);
        totalPropertyCount += elementProperties.propertyCount;
        console.log(`  ✅ Found ${elementProperties.propertyCount} properties for ${elementProperties.tagName}.${elementProperties.className || 'no-class'}`);
      } else {
        console.log(`  ❌ No elements found for selector: ${selector}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error analyzing ${selector}: ${error.message}`);
    }
  }

  await browser.close();

  // Summary
  console.log('\n📊 COMPREHENSIVE PROPERTY ANALYSIS SUMMARY');
  console.log('==========================================');
  console.log(`Total selectors analyzed: ${coreSelectors.length}`);
  console.log(`Successful analyses: ${allProperties.length}`);
  console.log(`Total CSS properties found: ${totalPropertyCount}`);
  console.log(`Average properties per element: ${(totalPropertyCount / allProperties.length).toFixed(1)}`);
  
  // Top properties by frequency
  const propertyFrequency = {};
  allProperties.forEach(el => {
    Object.keys(el.properties).forEach(prop => {
      propertyFrequency[prop] = (propertyFrequency[prop] || 0) + 1;
    });
  });
  
  const topProperties = Object.entries(propertyFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);
  
  console.log('\n🔝 Top 20 Most Common Properties:');
  console.log('==================================');
  topProperties.forEach(([prop, count], index) => {
    console.log(`${(index + 1).toString().padStart(2)}: ${prop.padEnd(25)} (${count} elements)`);
  });

  return {
    totalSelectors: coreSelectors.length,
    analyzedElements: allProperties.length,
    totalProperties: totalPropertyCount,
    propertyFrequency,
    detailedResults: allProperties
  };
}

// Run analysis
(async () => {
  try {
    const results = await analyzeAllProperties();
    console.log(`\n🎯 RESULT: Found ${results.totalProperties} individual CSS properties to track and test!`);
  } catch (error) {
    console.error('Analysis failed:', error);
    process.exit(1);
  }
})();