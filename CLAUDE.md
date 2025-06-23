# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- Never change pom without my approval
- The project is now named "ralph-web" and publishes to https://zitrono.github.io/ralph-web/
- Package name has been updated from "jace-ai-astro" to "ralph-web"
- Jace.ai local archive: http://localhost:8081/ (static copy with working hamburger menu and FAQ functionality)

## ACTIVE REFACTORING: CSS Architecture & POM Compliance

### Refactoring Imperatives (CRITICAL - READ FIRST)

1. **POM is Sacred**: The POM (jace-ai-site.pom.js) is the single source of truth. NEVER modify styles without verifying against POM.

2. **Visual Verification Required**: After EVERY change:
   - Use Puppeteer MCP to screenshot affected elements
   - Run `node unified-test.js ralph` to verify POM compliance
   - Compare visual output with baseline screenshots

3. **Change One Thing at a Time**: 
   - Make atomic changes (one color, one component, one style rule)
   - Verify immediately with Puppeteer MCP
   - Only proceed if POM tests still pass

4. **POM Constants Must Match Exactly**:
   ```css
   /* These values come from POM expectedStyles */
   --pom-bg-body: rgb(40, 40, 40);          /* NOT #282828 or similar */
   --pom-accent: rgb(255, 220, 97);         /* NOT #FFDC61 */
   --pom-accent-text: rgb(41, 48, 69);     /* NOT #293045 */
   ```

5. **Selector Structure is Critical**:
   - Hero CTA must be: `main button.btn-primary.btn-lg`
   - Header CTA must be: `header button.btn-primary`
   - FAQ buttons must have: `onclick*="toggleFAQ"`

6. **Mobile Requirements are Strict**:
   - Header inner container: exactly 64px height
   - Touch targets: minimum 44px
   - Viewport meta: `width=device-width, initial-scale=1.0, maximum-scale=1.0`

### Refactoring Workflow

1. **Before ANY style change**:
   ```bash
   # Take baseline screenshot with Puppeteer MCP
   # Run POM test to get baseline numbers
   cd tests && node unified-test.js ralph
   ```

2. **Make ONE atomic change**

3. **Immediately verify**:
   ```bash
   # Visual check with Puppeteer MCP
   # Re-run POM test
   cd tests && node unified-test.js ralph
   ```

4. **If ANY test fails**: Revert immediately

### CSS Variable Mapping (From POM expectedStyles)

```css
:root {
  /* Background colors - from POM */
  --pom-bg-body: rgb(40, 40, 40);
  --pom-bg-secondary: rgb(65, 65, 65);
  --pom-bg-card: rgb(53, 53, 53);
  
  /* Text colors - from POM */
  --pom-text-primary: rgb(255, 255, 255);
  --pom-text-secondary: rgba(255, 246, 238, 0.72);
  --pom-text-muted: rgb(156, 163, 175);
  
  /* Accent colors - from POM */
  --pom-accent: rgb(255, 220, 97);
  --pom-accent-text: rgb(41, 48, 69);
  
  /* Button specs - from POM */
  --pom-btn-padding: 0px 24px;
  --pom-btn-height: 40px;
  --pom-btn-radius: 6px;
  
  /* Typography - from POM */
  --pom-font-hero-size: 48px;
  --pom-font-hero-weight: 600;
  --pom-font-subtitle-size: 18px;
}
```

### Component Refactoring Rules

1. **Button Component**: Must produce exact POM selectors
2. **Card Component**: Background must be `rgb(53, 53, 53)`
3. **Section Component**: Must not alter existing spacing
4. **Header Component**: Mobile must be exactly 64px height

### Visual Verification Commands

```javascript
// After changing a color
await puppeteer_evaluate({
  script: `getComputedStyle(document.querySelector('.btn-primary')).backgroundColor`
});

// After changing layout
await puppeteer_screenshot({ name: 'current-state', width: 1200, height: 800 });

// Check specific element
await puppeteer_evaluate({
  script: `
    const el = document.querySelector('${selector}');
    const styles = getComputedStyle(el);
    ({
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      padding: styles.padding,
      borderRadius: styles.borderRadius
    })
  `
});
```

### Files Being Refactored

Priority order:
1. `src/layouts/Layout.astro` - CSS variables and global styles
2. `src/styles/components.css` - Remove !important, consolidate
3. `src/components/Button.astro` - New component (create)
4. `src/components/Card.astro` - New component (create)
5. `src/components/Section.astro` - New component (create)
6. All existing components - Update to use new system

### Success Criteria

- [ ] POM tests: 189/189 elements pass
- [ ] CSS properties: 3,500+ tests pass
- [ ] Zero !important declarations
- [ ] All colors use CSS variables
- [ ] No inline styles (except dynamic)
- [ ] Visual screenshots match baseline

### Do NOT Proceed If

- POM test count drops below current baseline
- Visual differences detected in screenshots
- Any selector structure changes
- Mobile header height changes from 64px

## Project Overview

This is the Ralph Web project (formerly Jace AI website) - a comprehensive testing and development environment for maintaining style parity between an original static site and its Astro.js refactor. The project implements advanced visual regression testing using Puppeteer with a Page Object Model (POM) pattern to ensure pixel-perfect consistency across implementations.

## Project Structure

The repository contains two main components:

1. **Astro Site** (`/`) - Modern Astro.js implementation with Tailwind CSS
2. **Testing Suite** (`tests/`) - Comprehensive Puppeteer-based testing with POM validation

## Commands

### Astro Site (Root Directory)
- **Install dependencies**: `npm install`
- **Development server**: `npm run dev` (serves on port 4321 at /ralph-web/)
- **Build for production**: `npm run build` (builds to `docs/` for GitHub Pages at /ralph-web/)
- **Preview production build**: `npm run preview`
- **GitHub Pages URL**: https://zitrono.github.io/ralph-web/
- **Repository**: https://github.com/zitrono/ralph-web

### Build and Deploy Workflow
1. **Development**: `npm run dev` - Live reload development server
2. **Build**: `npm run build` - Creates production build in `docs/` folder
3. **Test**: `cd tests && npm run test:ralph` - Validates build against POM
4. **Deploy**: `git add docs && git commit && git push` - Deploys to GitHub Pages

### Testing Suite (`tests/`)
- **Main test command**: `npm run test:ralph` or `node unified-test.js ralph`
- **Test jace reference**: `npm run test:jace` or `node unified-test.js jace`
- **Serve jace archive**: `npm run serve:jace` (runs on port 8081)
- **Package name**: ralph-web-tests (formerly jace-ai-tests)

### Legacy Test Files (deprecated - use unified-test.js)
- `node validate-jace-ai-100.js`
- `node validate-all-properties.js`
- `node ios-safari-mobile-pom.js`
- `node mobile-pom-validation.js`
- `node comprehensive-pom-test-original.js`
- `node comprehensive-pom-test.js`
- `node simple-pom-test.js`
- `node validate-enhanced-pom.js`

## Architecture

### Testing Architecture

The project implements a sophisticated testing system using the Page Object Model (POM) pattern:

**Page Object Model (`jace-ai-site.pom.js`)**:
- **71 total elements** tracked across selectors, styles, and content
- **14 CSS selectors** for DOM elements (header, navigation, hero, badges, etc.)
- **47 style properties** covering typography, colors, spacing, gradients, shadows
- **6 content validators** for text content and support features
- **5 validation methods** for complete section testing

**Comprehensive Test Coverage**:
- Validates font families, sizes, weights, and spacing
- Tests color accuracy (backgrounds, text, borders)
- Verifies gradient implementations and visual effects
- Checks layout spacing and component positioning
- Validates interactive elements and navigation

### Build Systems

**Static Site Build (`src/tools/build.js`)**:
- Component assembly system
- Asset organization and copying
- SEO meta tag generation
- Clean, maintainable HTML output

**Astro Build System**:
- Modern Astro.js framework with Tailwind CSS
- Component-based architecture with `.astro` files
- Hot module replacement for development
- Optimized production builds

### Style Parity System

The project maintains style parity between implementations using:

**CSS Custom Properties** (in `src/layouts/Layout.astro`):
```css
:root {
  --original-bg: rgb(40, 40, 40);
  --original-subtitle: rgba(255, 246, 238, 0.72);
  --original-cta-bg: rgb(255, 220, 97);
  /* ... 71 tracked properties */
}
```

**Style Classes** for consistent application:
- `.hero-title-gradient` - Gradient text effects
- `.cta-button-original` - Button styling parity
- `.casa-badge` - Certification badge styling
- `.company-logos-opacity` - Logo transparency
- `.video-gradient` - Video container gradients

## Development Workflow

### POM-Driven Development

1. **POM Validation First**: Always validate the POM against the original site before making changes
   ```bash
   node comprehensive-pom-test-original.js
   ```

2. **Style Implementation**: Update Astro components to match POM expectations
   - Edit `src/layouts/Layout.astro` for global styles
   - Update component files for specific element classes
   - Ensure all elements are covered by comprehensive testing

3. **Comprehensive Testing**: Run full POM validation against refactor
   ```bash
   node comprehensive-pom-test.js
   ```

4. **Iterative Fixes**: Address specific test failures systematically
   - Font family issues: Update font loading and CSS
   - Color mismatches: Verify CSS custom properties
   - Layout problems: Check spacing and positioning classes

### Testing Best Practices

**POM Stability Rule**: Never modify the POM without explicit approval. The POM serves as the source of truth for the original site's appearance.

**Comprehensive Coverage**: Tests must achieve near-100% success rate across all 71 POM elements, not just basic functionality.

**Server Management**: 
- Jace archive runs on port 8081 (via `npm run serve:jace` in tests/)
- Ralph/Astro runs on port 4321 (via `npm run dev` in root)
- Legacy static build runs on port 8000 (if using old build system)
- Ensure proper server startup before running tests

### Style Development Guidelines

**Font Implementation**:
- Use Geist font family with Inter fallback
- Map fonts correctly in CSS `@font-face` declarations
- Ensure computed styles show "Geist" not "Inter"

**Gradient and Visual Effects**:
- Implement exact gradient specifications from POM
- Use `-webkit-background-clip: text` for text gradients
- Set `color: rgba(0, 0, 0, 0)` for transparent gradient text

**Component Styling**:
- Apply POM-specified classes to match selectors
- Use CSS custom properties for consistent values
- Implement responsive behavior while maintaining base styles

## Key Files

### Testing Files
- `tests/jace-ai-site.pom.js` - Single consolidated POM with all selectors and validation methods
- `tests/unified-test.js` - Main test runner for both ralph and jace testing
- `tests/package.json` - Test configuration with ralph-web-tests naming

### Core Implementation Files
- `src/layouts/Layout.astro` - Global styles and CSS custom properties
- `src/components/Hero.astro` - Main landing section
- `src/components/Header.astro` - Navigation and branding
- `tailwind.config.mjs` - Tailwind configuration

### Build and Configuration
- `package.json` - Astro project dependencies and scripts
- `tests/package.json` - Testing dependencies and scripts

## Debugging

### POM Test Failures

**Font Issues**: Most common problem is font family not loading correctly
- Check `@font-face` declarations in Layout.astro
- Verify font loading order and fallbacks
- Ensure CSS specificity with `!important` declarations

**Selector Not Found**: Element selectors failing in tests
- Verify class names match POM expectations (`.border-2`, `.bg-gradient-to-br`)
- Check component templates have correct class applications
- Ensure DOM structure matches original site

**Style Mismatches**: Computed styles not matching POM expectations
- Compare expected vs actual values in test output
- Update CSS custom properties or class definitions
- Check for Tailwind conflicts with custom styles

### Development Server Issues

**Astro Development**:
- Run `npm install` in root directory before first use
- Restart dev server after CSS changes: `npm run dev`
- Check for Tailwind content configuration warnings
- Build outputs to `docs/` folder for GitHub Pages deployment

**Static Site Development**:
- Rebuild after component changes: `npm run build`
- Python server required for local development
- Asset paths must be relative for GitHub Pages compatibility

## Performance Considerations

- **Test Execution**: Comprehensive POM tests take 2-3 minutes
- **Build Times**: Astro builds are faster than static site builds
- **Asset Optimization**: Images and CSS are optimized for production
- **Caching**: Browser caching considerations for development vs production

## Memory of Key Issues

- Font family mapping requires careful CSS implementation with fallbacks
- POM tests are authoritative - always fix implementation to match POM, not vice versa
- Astro dev server needs restart after significant Layout.astro changes
- Gradient text effects require specific CSS properties for cross-browser compatibility
- All 71 POM elements should achieve near-100% test success for complete parity

## Mobile Layout Requirements

### Narrow Viewport (375px width)
- **Header Height**: Inner container must be 64px (reduced padding on mobile)
- **CTA Button**: Hidden in mobile header - only hamburger menu visible
- **Text Alignment**: Hero heading and subtitle centered on mobile
- **Scrolled State**: Header maintains consistent 64px height when scrolled

### Mobile Menu Panel
- **Overlay**: Semi-transparent black background `rgba(0, 0, 0, 0.5)`
- **CTA Buttons**: Side-by-side layout with `flex-row` and `flex-1`
- **Full Screen**: Panel covers entire viewport
- **Background**: All sections use `rgb(40, 40, 40)` base color

### Mobile Testing
- **Narrow Layout Test**: `node mobile-narrow-layout-test.js`
- **Mobile Menu Test**: `node mobile-menu-requirements-test.js`
- **Visual Comparison**: `node mobile-visual-comparison.js`
- All elements and their properties in the unified POM must be covered by the POM tests

## iOS Safari Mobile Testing

### Mobile POM Architecture
- **87% Mobile Compatibility** achieved (13/15 tests passed)
- **70+ Mobile-Specific Selectors** implemented for iOS Safari
- **4 iPhone Models** tested: iPhone SE, 15, 16 Pro, 16 Pro Max
- **Touch Target Validation**: 44px minimum touch target requirements
- **Mobile Menu Interaction**: Hamburger menu expand/collapse testing

### Mobile Testing Commands
- **iOS Simulator Integration**: Uses MCP iOS Simulator tools for device testing
- **Mobile POM Validation**: `node mobile-pom-validation.js` for touch-friendly testing
- **Multi-Device Screenshots**: Automated capture across iPhone models
- **Mobile-Specific Selectors**: Optimized for iOS Safari rendering differences

### Mobile Development Guidelines
**Touch Target Requirements**:
- Minimum 44px height for all interactive elements
- CTA buttons must meet accessibility standards
- Mobile menu items need adequate spacing

**iOS Safari Compatibility**:
- Test with iOS Simulator using MCP integration
- Verify mobile menu functionality (hamburger → expand → close)
- Validate responsive breakpoints on actual device viewports
- Check touch interaction on all CTAs and navigation elements

**Mobile POM Elements**:
- Hero title visibility on small screens
- Mobile navigation hamburger menu
- Touch-friendly CTA buttons
- Video section positioning
- Company logos responsive scaling
- Mobile menu overlay functionality

## Memory of Tools and Techniques

- Use puppeteer mcp for quick UI feedback instead of writing scripts for puppeteer

## Terminology

- **jace**: Original site (jace.ai) - reference implementation for comparison
- **ralph**: Our implementation (https://zitrono.github.io/ralph-web/) - the main project

## POM Selector Mapping

POM uses ralph-centric naming with jace mappings where different:
- Simple string: Same selector for both
- Object with `jaceSelector`: Different selectors
- Object with `unique: true`: Ralph-only, skip jace testing

```javascript
selectors: {
  heroTitle: 'h1',  // same for both
  casaBadge: { selector: '.badge-certification', jaceSelector: '.bg-\\[\\#353535\\]' },
  ralphLogo: { selector: '.text-2xl', unique: true }
}
```

## Testing System

Single test file `unified-test.js` - comprehensive by default:
- `node unified-test.js ralph` - tests ralph (189 elements + 3,500+ CSS properties)
- `node unified-test.js jace` - tests jace (skips unique elements)

All tests validate both high-level elements and individual CSS properties.

## Page Object Model (POM) Policy

**Single POM File**: All selectors, properties, and validation methods are consolidated in `jace-ai-site.pom.js`. This includes:
- Element selectors with ralph/jace mappings
- CSS property definitions (121 properties tracked)
- Mobile-specific requirements
- Validation methods for all test scenarios
- Comprehensive property testing methods

**Do NOT create new POM files**. All POM logic must be added to the existing `jace-ai-site.pom.js` file.

**Policies**:
1. Do not create new test files. All testing logic belongs in unified-test.js or the single POM file.
2. Do not create new POM files. All POM logic belongs in jace-ai-site.pom.js.
3. Use the selector mapping system for ralph/jace differences (selector vs jaceSelector).
4. Mark ralph-only elements with `unique: true`.
5. When implementing Ralph content that deviates from Jace reference, check if the corresponding POM selector needs `unique: true` to avoid test errors.