# Mobile Banner Specifications - jace.ai

## Overview
The mobile banner on jace.ai features a transforming header that changes from a transparent full-width bar to a floating glassmorphic container when scrolled.

## Dimensions & Layout

### Viewport
- Width: 430px (iPhone Pro Max)
- Banner behavior triggers after ~80-100px scroll

### Initial State (No Scroll)
- **Container**: 430px × 80px
- **Layout**: Full viewport width, transparent background
- **Padding**: 8px all sides on nav wrapper
- **Inner Content**: 414px × 64px
- **Elements**:
  - Logo: 62px × 36px (26px from left)
  - CTA Button: ~149px × 32px (center)
  - Hamburger: 24px × 24px (32px from right)

### Scrolled State (After ~80px)
- **Container**: 430px × 96px (16px taller)
- **Layout**: Floating container with margins
- **Padding**: 16px all sides (doubled from initial)
- **Inner Content**: 398px × 64px
- **Left/Right Margins**: 16px from viewport edges
- **Border Radius**: 16px (rounded-2xl)

## Visual Effects

### Glassmorphism
- **Backdrop Filter**: blur(40px)
- **Background**: 50% opacity dark (oklab(0.276838 0.0000125393 0.00000554323 / 0.5))
- **Shadow**: shadow-lg for depth

### Transitions
- Smooth animation via `transition-all`
- Properties that animate:
  - Padding: 8px → 16px
  - Border radius: 0px → 16px
  - Background: transparent → semi-transparent with blur
  - Container height: 80px → 96px

## CSS Implementation Details

### Classes Used (Tailwind)
- Initial: `p-2` (8px padding)
- Scrolled: `p-4` (16px padding)
- Border Radius: `rounded-2xl` (16px)
- Blur: `backdrop-blur-2xl` (40px)
- Background: `bg-page-bg/50` (50% opacity)
- Shadow: `shadow-lg`
- Transition: `transition-all`

### Key Measurements Summary
1. **Edge Spacing**: 
   - Initial: 8px → 414px content width
   - Scrolled: 16px → 398px content width
2. **Height Change**: 80px → 96px
3. **Padding Change**: 8px → 16px all sides
4. **Border Radius**: 0px → 16px
5. **Blur Radius**: 0px → 40px

## Native iOS Observations
- Strong frosted glass effect visible in Safari
- Smooth transitions between states
- Content remains readable through blur
- Professional floating header appearance
- No jank or performance issues