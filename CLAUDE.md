# CLAUDE.md

AI development guide for ralph-web. **LLM-optimized - essential rules only.**

## 🚫 NEVER DO
- Change POM without approval
- Create `.css` files or `<style>` blocks  
- Use hardcoded values instead of design tokens
- Skip TypeScript interfaces or use `any` types
- Modify content without Q&A process (see `/content/general/`)
- Use `!important` or break CSS cascade specificity rules
- **Define same CSS property in multiple locations** (e.g., design tokens + global CSS)
- **Mix global CSS with component styles** - components own their styles
- **Wrap feature components in Section** - they self-manage sections (causes double-wrapping)

## ✅ ALWAYS DO
- Run `npm run validate` before commits
- Maintain 99.9% POM compliance: `cd tests && node unified-test.js ralph`
- Use design tokens: `bg-background`, `text-primary`, etc.
- Follow component structure: `primitives/`, `layout/`, `features/`, `utils/`
- **Check if component has internal Section before wrapping**: `grep -l "Section" src/components/features/*.astro`
- **Use semantic HTML for accessibility only**: `<section id="pricing"><Pricing /></section>`
- **Let feature components self-manage sections**: Hero, Features, etc. include their own Section

## 📁 Architecture
```
src/components/
├── primitives/   # Button, Card, Input, Icon
├── layout/       # Header, Footer, Section  
├── features/     # Hero, FAQ, Pricing
└── utils/        # CookieConsent, LoginModal
```

### Design Tokens
- Colors: `bg-background`, `bg-accent`, `text-primary`, `text-secondary`
- Full list: `src/config/design-system.ts`

### Content Management
- Process: `/content/general/claude.md`
- Never modify `content-specification.md` or `qa-decisions.md` directly

## 🔧 Quick Reference

### Development
```bash
# Start dev server (checks if running, kills any process on 4321, then starts)
curl -s http://localhost:4321/ralph-web/ >/dev/null 2>&1 || (lsof -ti:4321 | xargs kill -9 2>/dev/null; npm run dev)

# Testing & validation
npm run validate                      # Type-check + lint + format
cd tests && node unified-test.js ralph # Test POM compliance (requires dev server running)
npm run build                         # Production build
```

### URLs & Files
- Dev: http://localhost:4321/ralph-web/
- Jace: http://localhost:8081/jace-copy/
- Production: https://zitrono.github.io/ralph-web/
- POM: `tests/jace-ai-site.pom.js`
- Layout: `src/layouts/Layout.astro`
- Design: `src/config/design-system.ts`

## 🎯 Component Template
```astro
---
import type { BaseComponentProps } from '@/types/components';

export interface Props extends BaseComponentProps {
  variant?: 'primary' | 'secondary';
}

const { variant = 'primary', class: className = '', ...rest } = Astro.props;
---

<div class={`component-base ${variant} ${className}`} {...rest}>
  <slot />
</div>
```

## 📊 Quality Gates
- TypeScript: 100% strict mode
- POM: 99.9% success (2,458+ properties)  
- Bundle: JS <500KB, CSS <200KB
- Accessibility: WCAG 2.1 AA (95%+)

## 🚨 POM Rules
- Fix implementation to match POM, never modify POM
- Mobile header: exactly 64px
- Hero CTA: `main button.btn-primary.btn-lg`

## Legacy Reference
- Project: ralph-web → https://zitrono.github.io/ralph-web/
- Jace reference: http://localhost:8081/ (for POM testing)

## Design Tokens Reference
```css
bg-background     /* rgb(40, 40, 40) - main background */
bg-secondary      /* rgb(65, 65, 65) - secondary areas */
bg-card          /* rgb(53, 53, 53) - card backgrounds */
bg-accent        /* rgb(255, 220, 97) - brand yellow */
text-primary     /* rgb(255, 255, 255) - main text */
text-secondary   /* rgba(255, 246, 238, 0.72) - secondary text */
text-muted       /* rgb(156, 163, 175) - muted text */
```

### Key System Files
- `src/config/design-system.ts` - Token definitions
- `src/styles/design-tokens.css` - CSS variables
- `tailwind.config.mjs` - Tailwind integration
- `src/types/components.ts` - TypeScript interfaces

## Requirements Summary
- **Accessibility**: WCAG 2.1 AA, 44px touch targets, ARIA labels
- **Performance**: Bundle <500KB JS, <200KB CSS
- **TypeScript**: Strict mode, BaseComponentProps interface
- **Workflow**: `npm run validate` → `cd tests && node unified-test.js ralph` → commit
- **Utilities**: Use Animation/State/Focus managers from `src/utils/`
