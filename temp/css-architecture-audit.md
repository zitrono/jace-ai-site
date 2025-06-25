# CSS Architecture Audit Report

## Executive Summary

This audit reveals critical CSS architecture issues that violate the project's established design token system and CSS standards. Key findings include:

- **6 instances of `!important` usage** causing cascade conflicts
- **12+ hardcoded color values** violating design token requirements
- **Multiple inline styles** with hardcoded values in components
- **CSS duplication** across components and global styles
- **Scoping issues** with global styles that should be component-scoped

## 1. CSS Sources Inventory

### Primary CSS Files
- `/src/styles/tailwind.css` - Minimal, only imports Tailwind layers
- `/src/styles/design-tokens.css` - Generated design token CSS variables (154 lines)
- `/src/layouts/Layout.astro` - Global styles block (652 lines, lines 193-652)

### Components with `<style>` Blocks
1. **MobileMenu.astro** (lines 130-186) - Mobile menu animations and layout
2. **Button.astro** (lines 221-251) - POM compatibility styles
3. **Card.astro** (lines 127-161) - POM compatibility styles
4. **Input.astro** (lines 322-346) - Browser normalization styles
5. **CTA.astro** (lines 87-95) - Gradient backgrounds
6. **Video.astro** (lines 63-80) - Section and container styles

### Total CSS Distribution
- **Global CSS**: ~650 lines in Layout.astro
- **Component CSS**: ~200 lines across 6 components
- **Design Tokens**: 154 lines (auto-generated)

## 2. Specificity Conflicts

### Critical `!important` Usage

#### Layout.astro (2 instances)
```css
/* Line 144 - Mobile menu overlay */
.mobile-menu-overlay.hidden {
  display: block !important;
}

/* Lines 607-610 - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

/* Line 617 - Reduced motion */
transition: none !important;
```

#### MobileMenu.astro (1 instance)
```css
/* Lines 478-479 - Mobile CTA button */
.mobile-cta-button {
  font-size: 16px !important;
  white-space: nowrap !important;
}
```

### Competing Selectors
1. **Navigation Links**: Different specificity between `.nav-link` and `.mobile-nav-link`
   - Desktop: `font-weight: 600`
   - Mobile: `font-weight: 500` (different weight for same content)

2. **Button Classes**: Multiple competing button selectors
   - Tailwind utilities vs `.btn-primary` vs inline styles
   - Risk of cascade conflicts when combined

3. **Card Hover States**: Duplicate hover definitions
   - `.card-hover:hover` in component
   - Tailwind `hover:` utilities
   - Potential for conflicting transitions

## 3. Design Token Violations

### Hardcoded Colors in Components

#### MobileMenu.astro (Critical Violations)
```astro
<!-- Line 89 - Hardcoded font size -->
style="font-size: 18px;"

<!-- Line 107 - Multiple hardcoded values -->
style="background-color: rgb(82, 82, 91); color: rgb(255, 255, 255); font-size: 16px; border-radius: 8px; padding: 10px 24px; border: 1px solid rgb(115, 115, 115);"

<!-- Line 116 - Hardcoded colors -->
style="border-radius: 8px; background-color: rgb(255, 220, 97); color: rgb(40, 40, 40);"

<!-- Line 164 - Hardcoded background -->
background-color: rgb(65, 65, 65);
```

#### Hero.astro
```astro
<!-- Hardcoded letter spacing -->
style="letter-spacing: -1.5px;"
```

#### CTA.astro
```css
/* Line 89 - Hardcoded gradient */
background: linear-gradient(135deg, rgb(196, 164, 221), rgb(248, 174, 207), rgb(255, 220, 97));
```

#### Video.astro
```css
/* Lines 65-70 - Hardcoded colors */
background-color: rgb(40, 40, 40);
background: linear-gradient(to right bottom, rgb(37, 99, 235), rgb(13, 148, 136));
```

#### Card.astro
```css
/* Lines 143-154 - Hardcoded colors for white variant */
background-color: rgb(255, 255, 255);
color: rgb(17, 24, 39);
color: rgb(75, 85, 99);
```

### Hardcoded Spacing Values
- Inline padding: `padding: 10px 24px` (should use design tokens)
- Fixed font sizes: `font-size: 18px`, `font-size: 16px`
- Custom letter spacing: `letter-spacing: -1.5px`

## 4. CSS Duplication

### Duplicate Transition Definitions
```css
/* Found in multiple locations */
transition: color 0.2s; /* Appears 2 times */
transition: all 0.3s ease;
transition-duration: 200ms; /* Tailwind utilities */
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1); /* MobileMenu */
```

### Duplicate Focus Styles
- Focus styles defined globally in Layout.astro
- Individual components redefine focus rings
- Inconsistent focus outline implementations

### Duplicate Color Utilities
```css
/* Layout.astro duplicates Tailwind utilities */
.text-secondary { color: var(--pom-text-secondary); }
.text-muted { color: var(--pom-text-muted); }
/* These already exist in design-tokens.css */
```

### Redundant Background Utilities
```css
/* Multiple definitions of same backgrounds */
.bg-primary /* Layout.astro */
.bg-primary-yellow /* design-tokens.css */
background-color: var(--pom-bg-body) /* Various locations */
```

## 5. Scoping Issues

### Global Styles That Should Be Component-Scoped

#### Layout.astro Global Styles
1. **Mobile-specific styles** (lines 307-332)
   - Should be in MobileMenu component
   - Global header modifications affect all pages

2. **FAQ-specific animations** (lines 482-493)
   - Should be in FAQ component
   - Global `.faq-content` and `.faq-arrow` classes

3. **Company logo opacity** (line 459)
   - Should be in Companies component
   - Global `.company-logos-opacity` class

### CSS Leaking Between Components
1. **Button styles** affect all buttons globally via `.btn-primary`
2. **Card hover states** apply to any `.card-hover` element
3. **Mobile menu styles** use global body classes that could conflict

### Missing Encapsulation
- No CSS modules or scoped styles
- Component styles rely on class name uniqueness
- Risk of style conflicts as codebase grows

## 6. Recommendations

### Immediate Actions (High Priority)

1. **Remove ALL `!important` declarations**
   - MobileMenu font-size can use more specific selectors
   - Reduced motion styles can use higher specificity

2. **Replace hardcoded values with design tokens**
   ```astro
   <!-- Instead of -->
   style="background-color: rgb(82, 82, 91);"
   
   <!-- Use -->
   class="bg-neutral-500"
   ```

3. **Consolidate duplicate CSS**
   - Create shared transition utilities
   - Standardize focus styles globally
   - Remove redundant color utilities

### Medium-Term Improvements

1. **Move component-specific styles to components**
   - FAQ animations → FAQ.astro
   - Mobile menu styles → MobileMenu.astro
   - Company logo styles → Companies.astro

2. **Implement CSS naming convention**
   - Use BEM or similar methodology
   - Prefix component classes (e.g., `mobile-menu__panel`)
   - Avoid generic names like `.card`

3. **Create animation utilities**
   ```css
   /* Instead of inline transitions everywhere */
   .transition-colors { transition: color 200ms ease; }
   .transition-transform { transition: transform 300ms ease; }
   ```

### Long-Term Architecture

1. **Consider CSS-in-JS or CSS Modules**
   - True style encapsulation
   - Automatic class name hashing
   - Tree-shaking unused styles

2. **Implement CSS linting**
   - Enforce design token usage
   - Prevent hardcoded values
   - Flag `!important` usage

3. **Create comprehensive design token system**
   - Animation tokens (durations, easings)
   - Shadow tokens
   - Z-index scale

## 7. Critical Violations Summary

### MUST FIX (Violates CLAUDE.md standards):
- ❌ 6 uses of `!important`
- ❌ 12+ hardcoded color values
- ❌ Inline styles with hardcoded values
- ❌ CSS in components beyond POM compatibility
- ❌ Global styles that should be component-scoped

### Performance Impact:
- Unnecessary CSS duplication increases bundle size
- Global styles force browser to check more selectors
- Inline styles prevent effective caching

### Maintenance Risk:
- High risk of cascade conflicts
- Difficult to track style origins
- Violates single source of truth principle

## Conclusion

The current CSS architecture significantly violates the established standards in CLAUDE.md. The most critical issues are the hardcoded values in MobileMenu.astro and the use of `!important` declarations. These must be addressed immediately to maintain code quality and prevent future cascade conflicts.

Priority should be given to:
1. Removing all `!important` declarations
2. Replacing hardcoded colors with design tokens
3. Moving component-specific styles out of Layout.astro
4. Consolidating duplicate CSS patterns

This will bring the codebase back into compliance with the refactoring standards and improve maintainability.