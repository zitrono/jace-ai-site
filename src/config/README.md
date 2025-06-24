# Design System Documentation

This directory contains the unified design token system for Ralph Web. The design system provides a single source of truth for all visual design decisions and ensures consistency across the application.

## Files Overview

- **`design-system.ts`** - Core design token definitions with TypeScript interfaces
- **`generate-tokens.ts`** - Utilities for generating CSS variables and Tailwind config
- **`../styles/design-tokens.css`** - Generated CSS custom properties
- **`../../tailwind.config.mjs`** - Tailwind configuration using design tokens

## Token Categories

### Colors

#### Primary Colors

```typescript
colors.primary.yellow; // #FFDC61 - Main brand color
colors.primary.yellowHover; // #FFE580 - Hover state
```

#### Neutral Scale

```typescript
colors.neutral[900]; // #0A0A0A - Darkest
colors.neutral[800]; // #1A1A1A
colors.neutral[700]; // #282828 - Main background
colors.neutral[600]; // #414141 - Secondary surfaces
colors.neutral[500]; // #525252
colors.neutral[400]; // #737373
colors.neutral[300]; // #A3A3A3
colors.neutral[200]; // #D4D4D4
colors.neutral[100]; // #F5F5F5
colors.neutral[50]; // #FAFAFA - Lightest
```

#### Semantic Text Colors

```typescript
colors.text.primary; // #FFFFFF - Primary text
colors.text.secondary; // rgba(255, 246, 238, 0.72) - Secondary text
colors.text.muted; // #9CA3AF - Muted text
colors.text.inverted; // #293044 - Text on yellow background
```

#### Gradients

```typescript
colors.gradients.heroTitle; // Hero title gradient
colors.gradients.purpleYellow; // Purple to yellow gradient
colors.gradients.videoContainer; // Video section gradient
colors.gradients.ctaSection; // CTA section gradient
```

### Typography

```typescript
typography.fontFamily.primary; // ['Geist', 'Inter', 'system-ui', 'sans-serif']
typography.fontSize.xs; // 0.875rem (14px)
typography.fontSize.sm; // 1rem (16px)
typography.fontSize.base; // 1.125rem (18px)
typography.fontSize.lg; // 1.5rem (24px)
typography.fontSize.xl; // 2rem (32px)
typography.fontSize['2xl']; // 2.5rem (40px)
typography.fontSize['3xl']; // 3rem (48px)
typography.fontSize.hero; // 3.75rem (60px)

typography.fontWeight.normal; // 400
typography.fontWeight.medium; // 500
typography.fontWeight.semibold; // 600
typography.fontWeight.bold; // 700

typography.lineHeight.tight; // 1.1
typography.lineHeight.base; // 1.5
typography.lineHeight.relaxed; // 1.75
```

### Spacing

#### Section Spacing

```typescript
spacing.section.sm; // 3rem (48px)
spacing.section.base; // 5rem (80px)
spacing.section.lg; // 8rem (128px)
```

#### Component Spacing

```typescript
spacing.component.xs; // 0.5rem (8px)
spacing.component.sm; // 1rem (16px)
spacing.component.base; // 1.5rem (24px)
spacing.component.lg; // 2rem (32px)
spacing.component.xl; // 3rem (48px)
```

### Border Radius

```typescript
borderRadius.sm; // 0.375rem (6px)
borderRadius.base; // 0.5rem (8px)
borderRadius.lg; // 0.75rem (12px)
borderRadius.xl; // 1rem (16px)
borderRadius.full; // 9999px
```

## Usage Examples

### In Astro Components

#### Using CSS Variables

```css
.my-component {
  background-color: var(--color-neutral-700);
  color: var(--color-text-primary);
  padding: var(--spacing-base);
  border-radius: var(--radius-lg);
}
```

#### Using Tailwind Classes

```html
<div class="bg-neutral-700 text-primary p-base rounded-lg">Content</div>
```

#### Using Design System Gradients

```css
.hero-title {
  background: var(--gradient-hero-title);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### In TypeScript/JavaScript

```typescript
import { designSystem, getToken } from '../config/design-system';

// Direct access
const primaryColor = designSystem.colors.primary.yellow;

// Dynamic token access
const fontSize = getToken('typography.fontSize.hero');
```

## Token Naming Conventions

### CSS Variables

- Colors: `--color-{category}-{name}` and `--color-{category}-{name}-rgb`
- Typography: `--font-{property}-{name}`
- Spacing: `--spacing-{name}` or `--spacing-{category}-{name}`
- Gradients: `--gradient-{kebab-case-name}`

### Tailwind Classes

- Follow Tailwind conventions but using our token names
- Colors: `bg-neutral-700`, `text-primary`
- Typography: `text-hero`, `font-semibold`
- Spacing: `p-base`, `m-lg`, `gap-section-base`

## POM Compatibility

The design system maintains backwards compatibility with POM (Page Object Model) testing requirements through:

1. **POM CSS Variables** - Legacy variable names for existing tests
2. **RGB Color Variants** - Explicit RGB values for POM color matching
3. **Exact Value Preservation** - All POM-required values maintained exactly

### POM Variables

```css
--pom-bg-body: var(--color-neutral-700-rgb);
--pom-text-primary: var(--color-text-primary);
--pom-accent: var(--color-primary-yellow-rgb);
/* ... etc */
```

## Migration Guide

### From Legacy CSS to Design Tokens

#### Before

```css
.component {
  background-color: rgb(40, 40, 40);
  color: #ffffff;
  font-size: 18px;
  padding: 24px;
}
```

#### After

```css
.component {
  background-color: var(--color-neutral-700);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-base);
}
```

### From Tailwind Arbitrary Values to Tokens

#### Before

```html
<div class="bg-[#282828] text-[#FFFFFF] text-[18px] p-[24px]"></div>
```

#### After

```html
<div class="bg-neutral-700 text-primary text-base p-base"></div>
```

## Development Workflow

### Adding New Tokens

1. **Add to design-system.ts**

   ```typescript
   export const designSystem: DesignSystem = {
     colors: {
       // Add new color tokens here
     },
   };
   ```

2. **Regenerate CSS tokens**

   ```bash
   # CSS is currently manually maintained
   # TODO: Add automated generation script
   ```

3. **Update Tailwind config** (automatic via import)

4. **Test POM compliance**
   ```bash
   cd tests && npm run test:ralph
   ```

### Best Practices

1. **Use semantic tokens** - Prefer `text.primary` over `neutral[50]`
2. **Maintain POM compatibility** - Always test changes against POM
3. **Document new tokens** - Update this README when adding tokens
4. **Use TypeScript** - Leverage type safety for token access
5. **Test thoroughly** - Ensure visual regression tests pass

## Troubleshooting

### Common Issues

1. **TypeScript import errors**
   - Ensure `design-system.ts` is properly typed
   - Check file paths in imports

2. **Tailwind not finding tokens**
   - Verify Tailwind config imports design system correctly
   - Check for syntax errors in `tailwind.config.mjs`

3. **POM test failures**
   - Verify POM compatibility variables are correct
   - Check that RGB values match exactly
   - Ensure selector structures haven't changed

4. **CSS variables not working**
   - Verify `design-tokens.css` is imported in Layout.astro
   - Check CSS variable syntax and naming

### Debugging

```typescript
// Get all tokens for debugging
import { getAllTokens } from '../config/generate-tokens';
console.log(getAllTokens());

// Check specific token
import { getToken } from '../config/generate-tokens';
console.log(getToken('colors.primary.yellow'));
```

## Future Improvements

- [ ] Automated CSS generation from TypeScript tokens
- [ ] Design token validation scripts
- [ ] Visual regression testing integration
- [ ] Dark/light theme support
- [ ] Animation and transition tokens
- [ ] Component-specific token sets
