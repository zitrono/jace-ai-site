# Mobile Menu Fix: Root Cause Analysis and Solutions

## Root Causes Identified

### 1. Z-Index Conflict with Cookie Consent
**Problem**: Cookie consent banner (z-50) conflicts with mobile menu overlay (z-50)
**Impact**: Menu content partially obscured by cookie banner on mobile

### 2. Typography Scale Issues  
**Problem**: Mobile menu using desktop font sizes (24px nav links)
**Expected**: Smaller, mobile-appropriate sizes matching Jace reference

### 3. Menu Panel Animation/Transform Issues
**Problem**: Menu panel has `translate-x-full` causing layout issues
**Expected**: Clean slide-in animation without content jumping

## Proposed Solutions

### Solution 1: Fix Z-Index Hierarchy
```astro
// src/components/layout/Header.astro - Line 180
// Change from z-50 to z-40 for mobile menu
<div 
  id="mobile-menu"
  class="fixed inset-0 z-40 lg:hidden"  // Changed from z-50 to z-40
  data-mobile-menu-overlay
>

// src/components/utils/CookieConsent.astro - Line 50
// Keep cookie consent at z-50 (higher priority)
<div 
  id={id} 
  class={`... fixed inset-x-0 bottom-0 z-50 ${className}`}  // Remains z-50
>
```

### Solution 2: Fix Mobile Menu Typography
```astro
// src/components/layout/Header.astro - Lines 216-236
// Update nav link styles for mobile
<a
  href={navItem.href}
  class="block rounded-base px-3 py-2 text-base font-semibold text-text-primary hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:ring-offset-2 focus:ring-offset-neutral-700"
>
  {navItem.text}
</a>
```

### Solution 3: Fix Menu Panel Animation
```astro
// src/components/layout/Header.astro - Line 186
// Remove translate-x-full from initial state
<div 
  class="fixed right-0 top-0 bottom-0 w-full bg-neutral-700 p-6 shadow-xl transition-transform duration-300 ease-in-out" 
  data-mobile-menu-panel
>
```

### Solution 4: Update Mobile Menu Manager
```typescript
// src/scripts/mobile-menu.ts
// Add proper animation handling
public showMenu(): void {
  if (!this.mobileMenu || !this.mobileMenuPanel) return;

  // Show container
  this.mobileMenu.classList.remove('hidden');
  
  // Force reflow before animation
  raf(() => {
    this.mobileMenu.classList.add('menu-open');
    this.mobileMenuPanel.style.transform = 'translateX(0)';
  });
}

public hideMenu(): void {
  if (!this.mobileMenu || !this.mobileMenuPanel) return;

  // Animate out
  this.mobileMenuPanel.style.transform = 'translateX(100%)';
  
  // Hide after animation
  setTimeout(() => {
    this.mobileMenu.classList.remove('menu-open');
    this.mobileMenu.classList.add('hidden');
  }, this.animationDuration);
}
```

### Solution 5: Add CSS for Proper Stacking Context
```astro
// src/layouts/Layout.astro
<style is:global>
  /* Mobile menu stacking context */
  .menu-open {
    overflow: hidden; /* Prevent body scroll when menu open */
  }
  
  /* Ensure proper z-index hierarchy */
  #mobile-menu {
    z-index: 40; /* Below cookie consent */
  }
  
  #cookie-banner {
    z-index: 50; /* Above mobile menu */
  }
  
  /* Mobile menu panel initial state */
  [data-mobile-menu-panel] {
    transform: translateX(100%);
  }
  
  /* Mobile menu open state */
  .menu-open [data-mobile-menu-panel] {
    transform: translateX(0);
  }
</style>
```

## Implementation Priority

1. **High Priority**: Fix z-index conflict (Solutions 1 & 5)
2. **High Priority**: Fix typography scale (Solution 2) 
3. **Medium Priority**: Fix animation issues (Solutions 3 & 4)

## Testing Steps

1. Open mobile viewport (375x667)
2. Click hamburger menu
3. Verify menu opens without cookie banner overlap
4. Verify text sizes match Jace reference
5. Verify smooth slide-in animation
6. Test with cookie banner visible and hidden

## Expected Results

- Mobile menu displays cleanly below cookie consent
- Typography matches mobile-appropriate sizes
- Smooth animations without layout jumps
- Consistent experience across devices