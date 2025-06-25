# CSS Transitions Analysis - Mobile Menu Sliding Issue

## Issue Description
When the mobile menu opens, both the main page and the menu slide - the menu slides too far initially then comes back to its place.

## Analysis Date
2025-06-24

## CSS Transitions and Transforms Found

### 1. Mobile Menu Component (`src/components/features/MobileMenu.astro`)

#### Panel Transition Properties
```css
/* Line 60 - Mobile Menu Panel */
class="... transform translate-x-full transition-transform duration-300 ease-in-out z-50"
```
- **Initial state**: `translate-x-full` (100% to the right, off-screen)
- **Transition**: `transition-transform duration-300 ease-in-out`
- **Duration**: 300ms with ease-in-out curve

#### JavaScript Animation Logic
```javascript
// Line 149-151 - Show menu animation
requestAnimationFrame(() => {
  mobileMenuPanel.style.transform = 'translateX(0)';
  // ...
});

// Line 162 - Hide menu animation
mobileMenuPanel.style.transform = 'translateX(100%)';
```

#### Potential Issues Found:
1. **Double Transform Application**: The panel has both a CSS class with `transform translate-x-full` AND JavaScript that sets `style.transform`
2. **will-change Performance Optimization**: Line 146 sets `will-change: transform` which could cause unexpected behavior
3. **No Body Overflow Control**: Comment on line 157 explicitly states "Not setting body overflow to prevent page shift" - this might be causing the page to slide

### 2. Mobile Menu TypeScript Module (`src/scripts/mobile-menu.ts`)

#### Different Animation Approach
```javascript
// Lines 55-57 - Show animation
this.mobileMenu.style.opacity = '0';
this.mobileMenu.style.transform = 'translateY(-20px)';

// Lines 61-64 - Trigger animation
raf(() => {
  if (this.mobileMenu) {
    this.mobileMenu.style.opacity = '1';
    this.mobileMenu.style.transform = 'translateY(0)';
  }
});
```

**CONFLICT IDENTIFIED**: This module uses `translateY` (vertical) animation while the Astro component uses `translateX` (horizontal) animation!

### 3. Layout Global Styles (`src/layouts/Layout.astro`)

#### iOS Scroll Prevention Styles
```css
/* Lines 243-253 */
html {
  overflow-x: auto;
  touch-action: pan-y pinch-zoom;
}

body {
  overflow-x: auto;
  touch-action: pan-y pinch-zoom;
  position: relative;
  width: 100%;
}
```
- **Issue**: `overflow-x: auto` allows horizontal scrolling which could cause sliding

#### Header Transition
```css
/* Lines 323-325 */
header {
  transition: all 0.3s ease;
}
```

#### Mobile Menu Transition
```css
/* Lines 495-499 */
#mobile-menu {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}
```

#### FAQ Content Transition
```css
/* Lines 482-487 */
.faq-content {
  transition:
    max-height 0.3s ease-out,
    opacity 0.3s ease-out;
  overflow: hidden;
}
```

### 4. Conflicting Animation Implementations

**Major Conflict Found**: There are THREE different implementations trying to animate the mobile menu:

1. **MobileMenu.astro inline script**: Uses `translateX` horizontally with 300ms duration
2. **mobile-menu.ts module**: Uses `translateY` vertically with 200ms duration  
3. **Layout.astro global styles**: Generic transform transition with 200ms duration

## Root Causes of Sliding Behavior

### 1. **Conflicting Transform Directions**
- The Astro component animates horizontally (`translateX`)
- The TypeScript module animates vertically (`translateY`)
- Both might be running simultaneously causing unexpected movement

### 2. **Missing Overflow Control**
- No `overflow: hidden` on body when menu opens
- `overflow-x: auto` on html/body allows horizontal scrolling
- This allows the entire page to slide when menu panel pushes content

### 3. **Double Transform Application**
- CSS class has `transform translate-x-full`
- JavaScript also sets `transform` property
- This could cause the "slides too far then comes back" behavior

### 4. **Timing Mismatches**
- MobileMenu.astro uses 300ms duration
- Layout.astro mobile menu styles use 200ms duration
- mobile-menu.ts uses 200ms duration
- Different timings could cause jarring animations

### 5. **Fixed Positioning Issues**
```css
/* MobileMenu.astro line 52 */
style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;"
```
The overlay is fixed but the panel inside is absolute, which could cause layout shifts.

## Recommendations

1. **Remove Conflicting Implementations**: Choose one animation approach (horizontal slide from MobileMenu.astro seems correct)
2. **Add Overflow Control**: Set `body { overflow: hidden; }` when menu opens
3. **Fix Transform Conflicts**: Remove the CSS `translate-x-full` class when using JavaScript transforms
4. **Standardize Timing**: Use consistent animation duration across all implementations
5. **Prevent Page Shift**: Add proper fixed positioning to both overlay and panel

## Code Snippets Causing Issues

### Most Likely Culprit #1
```javascript
// MobileMenu.astro line 149-151
requestAnimationFrame(() => {
  mobileMenuPanel.style.transform = 'translateX(0)';
  // ...
});
```
Combined with:
```html
<!-- Line 60 -->
class="... transform translate-x-full transition-transform duration-300 ease-in-out"
```

### Most Likely Culprit #2
```css
/* Layout.astro lines 243-253 */
html {
  overflow-x: auto; /* Should be hidden when menu opens */
}
body {
  overflow-x: auto; /* Should be hidden when menu opens */
}
```

### Most Likely Culprit #3
Multiple scripts trying to control the same menu:
- MobileMenu.astro inline script
- mobile-menu.ts module
- global.ts mobile menu initialization

All three could be fighting for control causing the overshooting behavior.