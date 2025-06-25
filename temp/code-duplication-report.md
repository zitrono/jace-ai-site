# Code Duplication Report - Ralph Web

## Executive Summary

After a comprehensive analysis of the ralph-web codebase, I've identified several significant patterns of code duplication across functions, components, event handlers, styles, and business logic. The most critical duplications are in focus management, animation patterns, event handling, and style utility classes.

---

## 1. Function Duplication

### 1.1 Focus Trapping Logic (HIGH PRIORITY)

**Duplicated in:**
- `src/scripts/mobile-menu.ts` (lines 103-135)
- `src/scripts/modal-manager.ts` (lines 121-151) 
- `src/components/features/MobileMenu.astro` (inline script)

**Pattern:**
```typescript
// Identical focus trapping implementation appears 3 times
const focusableElements = container.querySelectorAll(
  'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
);
const firstFocusable = focusableElements[0] as HTMLElement;
const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

// Tab key handling logic is identical
if (e.key === 'Tab') {
  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable?.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable?.focus();
    }
  }
}
```

**Consolidation Opportunity:** Create a shared `FocusManager` utility class.

### 1.2 Animation/Transition Functions

**Duplicated in:**
- `src/scripts/mobile-menu.ts` (showMenu/hideMenu)
- `src/scripts/modal-manager.ts` (showModal/hideModal)
- `src/scripts/cookie-consent.ts` (showBanner/hideBanner)

**Pattern:**
```typescript
// Show animation pattern repeated
element.style.opacity = '0';
element.style.transform = 'translateY(-20px)';
// Force reflow
element.offsetHeight;
// Animate
requestAnimationFrame(() => {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
});
```

**Consolidation Opportunity:** Create an `AnimationUtils` module.

### 1.3 DOM Query Utilities

**Partially duplicated across:**
- Multiple script files use similar safe querying patterns
- `dom-utils.ts` provides utilities but not consistently used

**Pattern:**
```typescript
// Manual null checking repeated instead of using dom-utils
const element = document.querySelector('#id');
if (!element) return;
```

---

## 2. Component Pattern Duplication

### 2.1 Button Component Patterns

**Duplicated button styling in:**
- `src/components/primitives/Button.astro`
- `src/components/features/MobileMenu.astro` (lines 103-121)
- `src/components/layout/Header.astro`
- `src/components/features/CTA.astro`

**Pattern:**
```astro
<!-- Similar button classes repeated -->
class="bg-accent text-accent-text rounded-lg font-medium hover:bg-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-neutral-800"
```

**Consolidation Opportunity:** All buttons should use the `<Button>` primitive component.

### 2.2 Modal/Overlay Patterns

**Duplicated in:**
- `MobileMenu.astro` (mobile menu overlay)
- `LoginModal.astro` (modal overlay)
- Similar overlay backdrop patterns

**Pattern:**
```astro
<!-- Overlay structure repeated -->
<div class="fixed inset-0 z-50" role="dialog" aria-modal="true">
  <div class="absolute inset-0 bg-transparent" aria-hidden="true"></div>
  <div class="panel-content">
    <!-- content -->
  </div>
</div>
```

---

## 3. Event Handler Duplication

### 3.1 Escape Key Handling

**Duplicated in:**
- `src/scripts/mobile-menu.ts` (line 45)
- `src/scripts/modal-manager.ts` (line 23)
- `src/components/features/MobileMenu.astro` (line 291)
- `src/components/features/FAQ.astro`

**Pattern:**
```typescript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) {
    close();
  }
});
```

**Consolidation Opportunity:** Create a shared `KeyboardManager` utility.

### 3.2 Click Outside Handling

**Duplicated in:**
- Mobile menu backdrop click
- Modal backdrop click
- Similar patterns for closing on outside click

**Pattern:**
```typescript
backdrop.addEventListener('click', () => {
  hideElement();
});
```

### 3.3 ARIA Attribute Management

**Duplicated in:**
- `mobile-menu.ts` (aria-expanded)
- `modal-manager.ts` (aria-hidden)
- `faq-toggle.ts` (aria-expanded)

**Pattern:**
```typescript
button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
element.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
```

---

## 4. Style Pattern Duplication

### 4.1 Focus Ring Styles

**Duplicated 18+ times across components:**
```css
focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-neutral-800
```

**Consolidation Opportunity:** Create a Tailwind utility class or component variant.

### 4.2 Transition Classes

**Duplicated patterns:**
```css
transition-colors duration-200
transition-all duration-200
transition-opacity duration-300
```

**Consolidation Opportunity:** Standardize transition utilities.

### 4.3 Button Hover States

**Duplicated hover patterns:**
```css
hover:bg-yellow-300 (for primary)
hover:bg-neutral-500 (for secondary)
hover:bg-neutral-600 (for ghost)
```

### 4.4 Responsive Patterns

**Duplicated responsive utilities:**
```css
hidden lg:block
block lg:hidden
flex lg:hidden
```

---

## 5. Business Logic Duplication

### 5.1 LocalStorage Handling

**Duplicated in:**
- `cookie-consent.ts` (localStorage access with try/catch)
- Similar patterns could emerge in other features

**Pattern:**
```typescript
try {
  localStorage.getItem(key);
} catch (error) {
  console.error('Failed to access localStorage:', error);
  return fallback;
}
```

### 5.2 Animation Timing Constants

**Duplicated across files:**
```typescript
private animationDuration = 300; // milliseconds
private animationDuration = 200; // milliseconds
private showDelay = 1000; // milliseconds
```

**Consolidation Opportunity:** Create a shared `ANIMATION_CONSTANTS` config.

### 5.3 Debounce Implementation

**Found in:**
- `web-vitals.ts` (lines 255-264)

**Potential duplication:** If debounce is needed elsewhere, it might be reimplemented.

---

## 6. Validation & Error Handling Patterns

### 6.1 Null Safety Checks

**Pattern repeated throughout:**
```typescript
if (!element) return;
if (!element) {
  console.error('Element not found');
  return;
}
```

**Consolidation Opportunity:** Standardize with `dom-utils.ts` utilities.

### 6.2 Performance Threshold Validation

**In `web-vitals.ts`:**
- Threshold validation logic could be generalized for other metrics

---

## 7. Deprecated Code Issues

### 7.1 Mobile Menu Script

`src/scripts/mobile-menu.ts` is marked as deprecated but:
- Still contains logic that's been reimplemented in `MobileMenu.astro`
- Should be removed to avoid confusion

---

## Recommendations

### High Priority Consolidations

1. **Create `FocusManager` utility class**
   - Extract focus trapping logic
   - Provide reusable focus management methods
   - Handle accessibility consistently

2. **Create `AnimationManager` utility**
   - Standardize show/hide animations
   - Provide consistent timing constants
   - Handle CSS transitions uniformly

3. **Create `KeyboardManager` utility**
   - Centralize keyboard event handling
   - Provide escape key handler
   - Add other common keyboard shortcuts

4. **Standardize component usage**
   - Use `<Button>` primitive everywhere
   - Create reusable overlay/modal components
   - Enforce component hierarchy

5. **Create Tailwind utility classes**
   - `focus-ring` for consistent focus styles
   - `transition-default` for standard transitions
   - `overlay-backdrop` for modal backgrounds

### Medium Priority

6. **Remove deprecated code**
   - Delete `mobile-menu.ts`
   - Clean up unused imports

7. **Standardize event handling**
   - Use `dom-utils.ts` consistently
   - Create event delegation utilities

8. **Create shared constants file**
   - Animation durations
   - Z-index values
   - Breakpoint values

### Low Priority

9. **Consider creating higher-order components**
   - `withFocusTrap` HOC
   - `withEscapeKey` HOC
   - `withClickOutside` HOC

10. **Optimize bundle size**
    - Tree-shake unused utilities
    - Lazy load heavy components

---

## Impact Analysis

### Current Impact
- **Code size**: ~15-20% reduction possible
- **Maintenance**: High - multiple places to update for changes
- **Bug risk**: Medium - inconsistent implementations
- **Developer experience**: Poor - confusion about which pattern to use

### Post-Consolidation Benefits
- **Reduced bundle size**: Estimated 10-15KB savings
- **Improved maintainability**: Single source of truth
- **Better consistency**: Unified behavior across components
- **Enhanced testability**: Test utilities once

---

## Implementation Priority

1. **Week 1**: Focus management and keyboard utilities
2. **Week 2**: Animation utilities and component standardization
3. **Week 3**: Style consolidation and Tailwind utilities
4. **Week 4**: Clean up deprecated code and optimize

This consolidation effort would significantly improve code quality while maintaining all current functionality and POM compliance.