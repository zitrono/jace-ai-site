# Mobile Menu JavaScript Analysis

## Issue Description
The mobile menu exhibits two problematic behaviors:
1. **Overshooting Animation**: When opening, the menu slides too far initially then comes back to position
2. **Page Sliding**: The main page also slides during menu animation

## JavaScript Code Analysis

### 1. Multiple Conflicting Implementations Found

#### A. MobileMenu.astro Inline Script (Lines 133-202)
```javascript
const showMenu = () => {
  // Sets will-change for performance
  mobileMenuPanel.style.willChange = 'transform';
  mobileMenu.classList.remove('hidden');

  requestAnimationFrame(() => {
    mobileMenuPanel.style.transform = 'translateX(0)';
    mobileMenuButton.setAttribute('aria-expanded', 'true');
    // Note: Not setting body overflow to prevent page shift
  });
};
```

**Issues Found:**
- Uses `will-change: transform` which can cause unexpected GPU acceleration behavior
- No initial transform state set before animation
- Comment indicates awareness of page shift issue but no overflow control

#### B. Unused TypeScript Implementation (mobile-menu.ts)
```javascript
private showMenu(): void {
  this.mobileMenu.classList.remove('hidden');
  this.mobileMenu.style.opacity = '0';
  this.mobileMenu.style.transform = 'translateY(-20px)';  // Different animation!
  
  raf(() => {
    this.mobileMenu.style.opacity = '1';
    this.mobileMenu.style.transform = 'translateY(0)';
  });
}
```

**Note:** This implementation uses vertical (translateY) animation instead of horizontal (translateX)

#### C. Global Script (global.ts)
```javascript
function initializeMobileMenu(): void {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    mobileMenuButton.setAttribute('aria-expanded', 'true');
  });
}
```

**Note:** Simple toggle without animation

### 2. Animation Timing Issues

#### Initial State Problem
The mobile menu panel has these CSS classes:
```css
transform translate-x-full transition-transform duration-300 ease-in-out
```

But the inline styles set:
```html
style="transform: translateX(100%)"  <!-- Initial state -->
style="transform: translateX(0)"      <!-- Open state -->
```

**Root Cause of Overshooting:**
1. CSS class `translate-x-full` = `translateX(100%)`
2. Inline style also sets `translateX(100%)`
3. When opening, both transforms may be applied momentarily
4. The `will-change: transform` optimization can cause the browser to pre-calculate positions incorrectly

### 3. CSS Transition Conflicts

#### Layout.astro Global Styles (Lines 495-499)
```css
#mobile-menu {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}
```

#### MobileMenu.astro Inline Classes
```css
transition-transform duration-300 ease-in-out
```

**Conflict:** Two different transition durations (200ms vs 300ms) applied to the same element

### 4. Body/HTML Manipulation

**Current Implementation:** No body overflow control
```javascript
// Note: Not setting body overflow to prevent page shift
```

**Modal Manager (modal-manager.ts):** Does control body overflow
```javascript
document.body.style.overflow = 'hidden';  // When showing modal
document.body.style.overflow = '';        // When hiding modal
```

This inconsistency could cause the page sliding issue if modals and mobile menu interact.

### 5. Race Conditions and Event Timing

#### Multiple Animation Frames
```javascript
requestAnimationFrame(() => {
  mobileMenuPanel.style.transform = 'translateX(0)';
  // ...
});
```

Combined with CSS transitions, this creates a complex timing scenario:
1. Remove `hidden` class
2. Wait for next animation frame
3. Apply transform
4. CSS transition takes 300ms
5. `will-change` may cause pre-optimization

## Potential Causes of Issues

### Overshooting Animation
1. **Double Transform Application**: Both CSS class and inline style setting `translateX(100%)`
2. **will-change Side Effects**: GPU acceleration can cause position calculation issues
3. **Conflicting Transition Durations**: 200ms global vs 300ms component-specific
4. **No Initial Transform Reset**: Transform not explicitly set to initial state before animation

### Page Sliding
1. **No Scroll Lock**: Body overflow not controlled during menu animation
2. **Fixed Positioning Issues**: Menu uses `position: fixed` but panel uses `position: absolute`
3. **Viewport Units**: Using `100vw` can include scrollbar width, causing horizontal overflow

## Recommendations

1. **Remove will-change**: It's causing more harm than good for this simple animation
2. **Consistent Transitions**: Use single transition duration (300ms) everywhere
3. **Control Body Overflow**: Add scroll lock during menu open state
4. **Simplify Transform Logic**: Remove duplicate transform declarations
5. **Fix Initial State**: Ensure transform is properly reset before animation starts