# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Jace AI website project - a comprehensive testing and development environment for maintaining style parity between an original static site and its Astro.js refactor. The project implements advanced visual regression testing using Puppeteer with a Page Object Model (POM) pattern to ensure pixel-perfect consistency across implementations.

## Project Structure

The repository contains two main components:

1. **Astro Site** (`/`) - Modern Astro.js implementation with Tailwind CSS
2. **Testing Suite** (`tests/`) - Comprehensive Puppeteer-based testing with POM validation

## Commands

### Astro Site (Root Directory)
- **Install dependencies**: `npm install`
- **Development server**: `npm run dev` (serves on port 4321)
- **Build for production**: `npm run build` (builds to `docs/` for GitHub Pages)
- **Preview production build**: `npm run preview`

### Testing Suite (`tests/`)
- **Comprehensive POM validation**: `node validate-jace-ai-100.js`
- **Property-level testing**: `node validate-all-properties.js`
- **Visual regression testing**: Various test files available

### Advanced POM Testing
- **Comprehensive POM test (original)**: `node comprehensive-pom-test-original.js`
- **Comprehensive POM test (refactor)**: `node comprehensive-pom-test.js`
- **Simple POM validation**: `node simple-pom-test.js`
- **Enhanced POM validation**: `node validate-enhanced-pom.js`

## Architecture

### Testing Architecture

The project implements a sophisticated testing system using the Page Object Model (POM) pattern:

**Page Object Model (`original-site.pom.js`)**:
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
- Original site runs on port 8000
- Astro refactor runs on port 4321
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
- `tests/original-site.pom.js` - Complete POM with 71 tracked elements
- `tests/comprehensive-pom-test.js` - Full validation suite for refactor
- `tests/comprehensive-pom-test-original.js` - POM validation against original

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