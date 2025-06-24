# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- Never change pom without my approval
- The project is now named "ralph-web" and publishes to https://zitrono.github.io/ralph-web/
- Package name has been updated from "jace-ai-astro" to "ralph-web"
- **Reference site (Jace)**: http://localhost:8081/ - Static archive for visual parity comparison
  - Required for POM testing and visual validation

## CRITICAL: REFACTORING STANDARDS (2025-06-23)

This project has undergone comprehensive refactoring to enterprise-grade standards. **ALL FUTURE DEVELOPMENT MUST MAINTAIN THESE STANDARDS**:

### ⚡ Architecture Standards (IMMUTABLE)

#### 1. **Component Organization** - NEVER violate this structure:

```
src/components/
├── primitives/   # Button, Card, Input, Icon - reusable UI elements
├── layout/       # Header, Footer, Section - page structure
├── features/     # Hero, FAQ, Pricing - feature-specific components
└── utils/        # CookieConsent, LoginModal - utility components
```

#### 2. **TypeScript Requirements** - ALL components MUST have:

- **Complete interface definitions** extending BaseComponentProps
- **Proper prop destructuring** with TypeScript types
- **JSDoc documentation** with usage examples
- **No any types** - use proper type definitions

#### 3. **CSS Architecture** - ZERO TOLERANCE for violations:

- **100% Utility-First**: Use ONLY Tailwind utilities + design tokens
- **NO custom CSS**: No `<style>` blocks, no components.css
- **Design Token Usage**: All colors/spacing via `bg-background`, `text-primary`, etc.
- **NO inline styles**: Use Tailwind classes or design tokens exclusively

### 🎯 Development Standards (MANDATORY)

#### 4. **File Creation Rules**:

- **NEW COMPONENTS**: Must use component template with full TypeScript interface
- **NO NEW CSS FILES**: Use design tokens and Tailwind utilities only
- **DOCUMENTATION**: Every component needs JSDoc with props and examples
- **INDEX FILES**: Update appropriate index.ts for exports

#### 5. **Code Quality Gates**:

- **Pre-commit validation**: `npm run validate` must pass (type-check + lint + format)
- **POM compliance**: 99.9% property-level success rate required
- **Build success**: `npm run build` must complete without warnings
- **Performance budgets**: All categories must stay within established limits

#### 6. **Performance Standards**:

- **Bundle size limits**: JS <500KB, CSS <200KB, Total <2MB
- **Lighthouse scores**: 95+ in all categories
- **Accessibility**: WCAG 2.1 AA compliance maintained
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1

### 🚨 ABSOLUTELY FORBIDDEN

#### 7. **Never Do These**:

- ❌ Create new `.css` files or add `<style>` blocks
- ❌ Use hardcoded colors/spacing instead of design tokens
- ❌ Add components without TypeScript interfaces
- ❌ Modify the design token system without approval
- ❌ Break POM compliance (must maintain 99.9% success)
- ❌ Add dependencies without performance impact analysis
- ❌ Skip accessibility requirements (ARIA, focus management)
- ❌ Use `any` types or skip TypeScript validation
- ❌ Use `!important` or override CSS cascade without justification
- ❌ Create conflicting class names that break CSS specificity

### 🎨 CSS Cascade Integrity (CRITICAL)

**CSS Cascade Management is Sacred** - Maintain clean, predictable CSS specificity:

#### CSS Best Practices:

1. **Specificity Hierarchy**: Use semantic class names with clear specificity
   - Base classes: `.nav-link` (general styling)
   - Variant classes: `.mobile-nav-link` (specific overrides)
   - State classes: `.is-active`, `.is-open` (temporary states)

2. **Avoid Cascade Conflicts**:
   - Never use `!important` except for utility overrides
   - Create specific classes rather than nested selectors
   - Use design tokens for all values (colors, spacing, etc.)
   - Document any necessary overrides with comments

3. **Class Naming Strategy**:
   - Component-specific: `.component-name`
   - Variant-specific: `.component-name--variant`
   - Context-specific: `.context-component-name`
   - Example: `.nav-link` → `.mobile-nav-link` → `.mobile-nav-link--active`

4. **Style Organization**:
   - Global styles in `Layout.astro` only
   - Component styles via Tailwind utilities
   - Override styles via specific class names
   - No inline styles or style attributes

### 🔧 Development Workflow (REQUIRED)

#### 8. **Every Change Must**:

1. **Start with**: `npm run dev` and verify current state
2. **Check compliance**: Run POM tests before changes
3. **Make changes**: Following architecture standards above
4. **Validate**: `npm run validate` must pass
5. **Test POM**: Re-run POM tests - 99.9% success required
6. **Build verification**: `npm run build` must succeed
7. **Performance check**: `npm run perf:analyze` - budgets maintained

#### 9. **Component Development Template**:

```astro
---
/**
 * ComponentName - Brief description
 * @example
 * <ComponentName variant="primary" size="lg">Content</ComponentName>
 */

import type { BaseComponentProps } from '@/types/components';

export interface Props extends BaseComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  // Document all props with types
}

const { variant = 'primary', size = 'md', class: className = '', ...rest } = Astro.props;
---

<element class={`base-classes variant-${variant} size-${size} ${className}`} {...rest}>
  <slot />
</element>
```

### 📊 Quality Metrics (MAINTAINED)

#### 10. **Success Criteria** - These MUST be maintained:

- ✅ **TypeScript Coverage**: 100% with strict mode
- ✅ **POM Compliance**: 99.9% property-level success (2,458+ properties)
- ✅ **Bundle Performance**: All budgets <50% utilization
- ✅ **Accessibility Score**: 95%+ WCAG 2.1 AA compliance
- ✅ **Build Performance**: <2 second builds
- ✅ **Zero Technical Debt**: No code smells, no duplication
- ✅ **Documentation**: 100% component coverage with examples

**VIOLATION OF THESE STANDARDS IS NOT PERMITTED** - they represent significant engineering investment and must be preserved.

## Content Management (CRITICAL - READ FIRST)

**SINGLE SOURCE OF TRUTH**: All website content management MUST follow the structured documentation system in `/content/general/`:

1. **`content/general/claude.md`** - Content management rules and process (THIS IS THE LAW)
2. **`content/general/content-specification.md`** - Current approved website content (NEVER modify directly)
3. **`content/general/qa-decisions.md`** - Verbatim Q&A history (NEVER modify existing entries)
4. **`content/general/technical-constraints.md`** - POM requirements and template limits (IMMUTABLE)

**MANDATORY PROCESS FOR ALL CONTENT CHANGES**:

- Read `content/general/claude.md` for complete content management protocol
- ALWAYS identify highest-priority content area before suggesting changes
- Present strategic options using Q&A format (never implement directly)
- Wait for explicit approval before any modifications
- Record ALL decisions verbatim in `qa-decisions.md`
- Update `content-specification.md` only after approved Q&A

**NEVER**:

- Modify website content without going through the Q&A process
- Change content-specification.md directly
- Alter existing Q&A entries
- Ignore technical constraints from POM requirements

## POM Testing & Style Compliance

**POM is Sacred**: The POM (jace-ai-site.pom.js) is the single source of truth. NEVER modify styles without verifying against POM.

### Critical Requirements

- **Dev Server**: Tests run against `http://localhost:4321/ralph-web/` - ensure dev server is running
- **Testing**: Run `cd tests && node unified-test.js ralph` before/after any changes
- **Success Criteria**: 189+ elements pass, 3,500+ CSS properties pass
- **Mobile Header**: Exactly 64px height (immutable)
- **Selectors**: Hero CTA: `main button.btn-primary.btn-lg`, Header CTA: `header button.btn-primary`
- **Colors**: Use exact RGB values from POM (see technical-constraints.md)
- **CONTENT POLICY**: POM validates ONLY UI/visual properties (CSS, layout, styling). POM MUST NOT validate text content, copy, or language-specific content. Focus on visual parity, not textual parity.

### Development Server Setup

The POM tests run against the local development server for immediate feedback:

- **Start dev server**: `npm run dev` (must run on port 4321)
- **If port 4321 is occupied**: Kill the process with `lsof -ti:4321 | xargs kill -9` then restart
- **Test URL**: `http://localhost:4321/ralph-web/`
- **Changes reflect immediately**: No build/deploy needed for testing

### POM CSS Validation Rules

**CRITICAL**: Follow ultimate CSS validation approach outlined in `pom-css-rules.md`:

- **Functional Equivalence**: Test structure and reasonable variance, not pixel perfection
- **Tolerance-Based Validation**: Typography ±20px, Colors ±10 RGB, Layout ±16px
- **NO CSS Injection**: Never use `!important`, style injection, or cascade manipulation
- **Reference-First**: Always use Jace as immutable reference for comparison

### Enhanced POM Process (PROVEN EFFECTIVE 2025-06-24)

**Multi-Layer Element Detection**: When validating complex UI components (e.g., mobile menus):
- Identify ALL layers: overlays, backdrops, panels, content containers
- Measure the correct element: panels for width, overlays for transparency
- Reference actual measurements, not assumptions
- Example: Jace mobile menu has transparent overlay + 320px max-width panel

**Visual Property Validation**: Beyond structure, validate visual properties:
- Background colors must match exactly (not just "dark")
- Layout patterns (horizontal vs vertical) must be verified
- Responsive behavior: max-width constraints with full-width fallbacks

**Root Cause Analysis**: When POM tests pass but visual parity fails:
1. Check if measuring correct elements (panel vs backdrop)
2. Verify selector specificity matches implementation
3. Test at multiple viewports for responsive edge cases
4. Use screenshots for visual regression, not just property validation

### Visual Verification

Use Puppeteer MCP for immediate feedback:

```javascript
await puppeteer_screenshot({ name: 'current-state', width: 1200, height: 800 });
await puppeteer_evaluate({
  script: `getComputedStyle(document.querySelector('.btn-primary')).backgroundColor`,
});
```

## Design System Usage (MANDATORY)

### Design Token Architecture

The project uses a unified design token system. **ALL styling MUST use these tokens**:

#### Required Token Usage:

```css
/* Colors - Use these Tailwind classes ONLY */
bg-background     /* rgb(40, 40, 40) - main background */
bg-secondary      /* rgb(65, 65, 65) - secondary areas */
bg-card          /* rgb(53, 53, 53) - card backgrounds */
bg-accent        /* rgb(255, 220, 97) - brand yellow */
text-primary     /* rgb(255, 255, 255) - main text */
text-secondary   /* rgba(255, 246, 238, 0.72) - secondary text */
text-muted       /* rgb(156, 163, 175) - muted text */
```

#### Component Patterns (ENFORCE THESE):

```astro
<!-- ✅ CORRECT: Using design tokens -->
<Button variant="primary" size="lg" class="bg-accent text-accent-text">
  <!-- ❌ WRONG: Custom CSS or hardcoded values -->
  <button style="background: #FFDC61; padding: 12px;">
    <div class="bg-yellow-400"><!-- Don't use arbitrary Tailwind colors --></div></button
  >
</Button>
```

### Design System Files (NEVER MODIFY WITHOUT APPROVAL):

- `src/config/design-system.ts` - Master token definitions
- `src/styles/design-tokens.css` - Generated CSS variables
- `tailwind.config.mjs` - Tailwind integration
- `src/types/components.ts` - TypeScript interfaces

## Component Standards Reference

### Component Interface Requirements:

Every component MUST follow this pattern:

```typescript
export interface Props extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  // Add component-specific props with proper types
}
```

### Accessibility Requirements (NON-NEGOTIABLE):

- **ARIA Labels**: All interactive elements need `aria-label` or `aria-labelledby`
- **Focus Management**: Implement `focus-visible` and keyboard navigation
- **Touch Targets**: Minimum 44px height/width for mobile
- **Screen Reader Support**: Use semantic HTML and `sr-only` text
- **Color Contrast**: WCAG 2.1 AA compliance (4.5:1 ratio minimum)

### Performance Requirements:

- **Client Directives**: Use appropriate Astro islands (`client:visible`, `client:idle`, `client:load`)
- **Bundle Size**: Monitor impact with `npm run perf:analyze`
- **Image Optimization**: Use Astro's Image component for all images
- **Font Loading**: Preload critical fonts, use `font-display: swap`

## Quality Assurance Protocol (MANDATORY)

### Pre-Development Checklist:

```bash
# 1. Check current state
npm run dev  # Verify everything works

# 2. Run baseline tests
cd tests && node unified-test.js ralph  # Must show 99.9% property success

# 3. Check performance baseline
npm run perf:analyze  # All budgets must be within limits
```

### Post-Development Validation (REQUIRED):

```bash
# 1. Code quality validation
npm run validate  # Must pass: type-check + lint + format

# 2. Build verification
npm run build  # Must complete without errors

# 3. POM compliance check
cd tests && node unified-test.js ralph  # Must maintain 99.9% success

# 4. Performance verification
npm run perf:analyze  # Budgets must not exceed limits
```

### Quality Gates (CANNOT BE BYPASSED):

- ✅ **TypeScript**: No compilation errors, strict mode enabled
- ✅ **ESLint**: No errors, warnings reviewed and justified
- ✅ **POM Tests**: 99.9% property-level success rate maintained
- ✅ **Build**: Successful production build with compression
- ✅ **Performance**: All budgets within established limits
- ✅ **Accessibility**: WCAG 2.1 AA compliance maintained

### Emergency Procedures:

If any quality gate fails:

1. **STOP all development immediately**
2. **Revert changes** to last known good state
3. **Analyze failure** with appropriate tools
4. **Fix incrementally** with validation at each step
5. **Re-run full validation** before proceeding

**Remember**: The standards introduced by the comprehensive refactoring represent significant engineering investment. Maintaining them is not optional - it's essential for project success and team productivity.

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

## Project Architecture

**Ralph Web**: AI-Native Private Equity Platform website - Astro.js implementation with Tailwind CSS and comprehensive POM testing for pixel-perfect style parity.

### Development Workflow

1. **Development**: `npm run dev` (port 4321)
2. **Build**: `npm run build` → `docs/` folder
3. **Test**: `cd tests && node unified-test.js ralph`
4. **Deploy**: `git push` → GitHub Pages

### Testing & Servers

- **Ralph**: http://localhost:4321/ralph-web/ (development)
- **Jace Reference**: http://localhost:8081/ (static archive)
- **Production**: https://zitrono.github.io/ralph-web/
- **POM Testing**: 189+ elements, 3,500+ CSS properties validated

## Key Files

- **POM**: `tests/jace-ai-site.pom.js` - Testing definitions
- **Test**: `tests/unified-test.js` - Main test runner
- **Layout**: `src/layouts/Layout.astro` - Global styles
- **Config**: `tailwind.config.mjs`, `package.json`

## Common Issues

- **Font**: Check `@font-face` in Layout.astro, ensure Geist loads
- **Selectors**: Verify POM class expectations match implementation
- **Mobile**: Header must be exactly 64px height
- **Testing**: Always fix implementation to match POM, not vice versa

## Mobile Requirements

- **Header**: Exactly 64px height (immutable)
- **Touch Targets**: Minimum 44px height
- **Menu**: Hamburger menu with overlay on mobile
- **Testing**: Use iOS Simulator MCP tools
- **Compatibility**: 87% mobile compatibility achieved

## Tools

- Use Puppeteer MCP for UI feedback instead of writing scripts

## Terminology

- **jace**: Original reference site (jace.ai)
- **ralph**: Our implementation (https://zitrono.github.io/ralph-web/)

## POM Policy

**Single POM File**: All testing logic in `jace-ai-site.pom.js`

- Ralph/jace selector mappings with `jaceSelector` for differences
- Mark ralph-only elements with `unique: true`
- 121 CSS properties tracked, 189+ elements validated
- Do NOT create new POM or test files
