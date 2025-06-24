# Component Style Guide

This guide documents all components in the Ralph Web project, their interfaces, usage patterns, and design token integration.

## Design Principles

1. **Utility-First CSS**: All components use Tailwind CSS utilities and design tokens
2. **TypeScript Interfaces**: Every component has fully documented props with JSDoc comments
3. **Accessibility**: Components follow WCAG guidelines with proper ARIA attributes
4. **Design Token Integration**: Components use the centralized design system
5. **Responsive Design**: Mobile-first approach with consistent breakpoints

## Design System Integration

All components use the design system tokens defined in `src/config/design-system.ts`:

```typescript
// Colors
bg - background; // Main background
bg - card; // Card backgrounds
text - primary; // Primary text
text - secondary; // Secondary text
text - accent; // Accent text
bg - accent; // Accent background
text - accent - foreground; // Accent foreground

// Spacing
(section - sm, section - base, section - lg); // Section spacing
(card - gap, card - padding); // Card spacing
button - x; // Button padding

// Typography
font - sans; // Primary font family
(text - hero, text - lg, text - base); // Font sizes
```

## Component Categories

### Layout Components

#### Section

**File**: `src/components/layout/Section.astro`
**Purpose**: Consistent section spacing and backgrounds

```astro
<Section spacing="lg" background="primary">
  <h2>Section Content</h2>
</Section>
```

**Props**:

- `spacing`: 'sm' | 'base' | 'lg' - Section padding
- `background`: 'primary' | 'secondary' | 'card' - Background color
- `class`: string - Additional CSS classes

#### Header

**File**: `src/components/layout/Header.astro`
**Purpose**: Site navigation with mobile menu

**Features**:

- Responsive navigation
- Mobile hamburger menu
- CTA integration
- Logo with custom font

#### Footer

**File**: `src/components/layout/Footer.astro`
**Purpose**: Site footer with links and branding

### Primitive Components

#### Button

**File**: `src/components/primitives/Button.astro`
**Purpose**: Consistent button styling and behavior

```astro
<Button variant="primary" size="lg" href="/contact">Get Started</Button>
```

**Props**:

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'base' | 'lg'
- `href`: string - Link destination (optional)
- `type`: 'button' | 'submit' | 'reset'
- `disabled`: boolean
- `onclick`: string - JavaScript handler

**Design Tokens Used**:

- Colors: `bg-accent`, `text-accent-foreground`
- Spacing: `button-x`, `px-6`, `py-3`
- Typography: `text-button`, `font-medium`
- Border: `rounded-button`

#### Card

**File**: `src/components/primitives/Card.astro`
**Purpose**: Consistent card container styling

```astro
<Card variant="elevated" padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

**Props**:

- `variant`: 'default' | 'elevated' | 'outlined'
- `padding`: 'sm' | 'base' | 'lg'
- `background`: 'card' | 'secondary'

#### Input

**File**: `src/components/primitives/Input.astro`
**Purpose**: Form input with consistent styling

```astro
<Input type="email" placeholder="Enter email" label="Email Address" required />
```

#### Icon

**File**: `src/components/primitives/Icon.astro`
**Purpose**: SVG icon rendering with consistent sizing

```astro
<Icon name="menu" size="lg" class="text-white" />
```

### Feature Components

#### Hero

**File**: `src/components/features/Hero.astro`
**Purpose**: Landing page hero section

**Features**:

- Gradient text effects
- Badge certifications
- Primary CTA
- Responsive layout

#### CTA (Call to Action)

**File**: `src/components/features/CTA.astro`
**Purpose**: Conversion-focused sections

#### FAQ

**File**: `src/components/features/FAQ.astro`
**Purpose**: Expandable question/answer sections

**Features**:

- Accordion-style interaction
- Smooth animations
- Keyboard navigation

#### Features

**File**: `src/components/features/Features.astro`
**Purpose**: Product feature showcase

#### TestimonialsNew

**File**: `src/components/features/TestimonialsNew.astro`
**Purpose**: Customer testimonial display

#### Companies

**File**: `src/components/features/Companies.astro`
**Purpose**: Company logo showcase

#### Video

**File**: `src/components/features/Video.astro`
**Purpose**: Video content with gradient overlay

#### Pricing

**File**: `src/components/features/Pricing.astro`
**Purpose**: Pricing table display

### Utility Components

#### CookieConsent

**File**: `src/components/utils/CookieConsent.astro`
**Purpose**: GDPR compliant cookie consent banner

```astro
<CookieConsent position="bottom-left" title="Cookie Preferences" privacyLink="/privacy" />
```

**Features**:

- Configurable positioning
- Smooth show/hide animations
- Accept/reject/settings options

#### LoginModal

**File**: `src/components/utils/LoginModal.astro`
**Purpose**: Beta access modal dialog

**Features**:

- Accessible modal with focus management
- Keyboard navigation (ESC to close, Tab trap)
- Backdrop blur effect
- Email contact integration

#### OptimizedImage

**File**: `src/components/utils/OptimizedImage.astro`
**Purpose**: Performance-optimized image component

```astro
<OptimizedImage
  src={heroImage}
  alt="Platform Dashboard"
  width={1920}
  height={1080}
  loading="eager"
  class="w-full h-auto rounded-lg"
/>
```

**Features**:

- Multiple format support (WebP, AVIF, etc.)
- Responsive sizes
- Lazy loading by default
- Multiple density support

## Styling Conventions

### CSS Class Naming

1. **Utility-First**: Use Tailwind utilities as much as possible
2. **Design Tokens**: Reference design system colors and spacing
3. **Component Classes**: Only for complex interactions or animations
4. **POM Compatibility**: Maintain classes needed for testing

### Color Usage

```astro
<!-- Backgrounds -->
<div class="bg-background">
  <!-- Main page background -->
  <div class="bg-card">
    <!-- Card/container background -->
    <div class="bg-accent">
      <!-- Accent/brand background -->

      <!-- Text -->
      <p class="text-primary">
        <!-- Primary text -->
        <p class="text-secondary">
          <!-- Secondary/muted text -->
          <p class="text-accent">
            <!-- Accent text -->

            <!-- Borders -->
            <div class="border-gray-700">
              <!-- Subtle borders -->
              <div class="border-accent"><!-- Accent borders --></div>
            </div>
          </p>
        </p>
      </p>
    </div>
  </div>
</div>
```

### Spacing Patterns

```astro
<!-- Sections -->
<section class="py-section-base">
  <!-- Standard section padding -->
  <section class="py-section-lg">
    <!-- Large section padding -->

    <!-- Cards -->
    <div class="p-card-padding">
      <!-- Standard card padding -->
      <div class="gap-card-gap">
        <!-- Card grid gaps -->

        <!-- Buttons -->
        <button class="px-button-x"> <!-- Button horizontal padding --></button>
      </div>
    </div>
  </section>
</section>
```

### Typography Scale

```astro
<h1 class="text-hero">
  <!-- Hero titles -->
  <h2 class="text-2xl">
    <!-- Section titles -->
    <p class="text-base">
      <!-- Body text -->
      <small class="text-sm"> <!-- Small text --></small>
    </p>
  </h2>
</h1>
```

## Responsive Design

All components follow mobile-first responsive design:

```astro
<!-- Mobile first, then larger screens -->
<div class="text-sm md:text-base lg:text-lg">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <div class="px-4 md:px-6 lg:px-8"></div>
  </div>
</div>
```

Standard breakpoints:

- `xs: 375px` - Small phones
- `sm: 640px` - Large phones
- `md: 768px` - Tablets
- `lg: 1024px` - Laptops
- `xl: 1280px` - Desktops
- `2xl: 1536px` - Large screens

## Animation Guidelines

Use Tailwind's built-in transitions and custom animations:

```astro
<!-- Transitions -->
<div class="transition-colors duration-200">
  <button class="transition-all duration-300 hover:scale-105">
    <!-- Custom animations -->
    <div class="animate-fade-in">
      <!-- Fade in effect -->
      <div class="animate-slide-down"><!-- Slide down effect --></div>
    </div></button
  >
</div>
```

## Testing Integration

Components maintain CSS classes required for POM (Page Object Model) testing:

- Keep existing class names that tests depend on
- Add `data-testid` attributes for test selectors
- Ensure interactive elements have proper accessibility attributes

## Performance Considerations

1. **Minimal Custom CSS**: Rely on Tailwind's utility classes
2. **Efficient Animations**: Use CSS transforms and opacity for smooth animations
3. **Image Optimization**: Use OptimizedImage component for all media
4. **Bundle Size**: Avoid unnecessary dependencies

## Future Enhancements

1. **Theme Support**: Extend design system for multiple themes
2. **Component Variants**: Add more styling variants as needed
3. **Animation Library**: Integrate more sophisticated animations
4. **Accessibility Audit**: Regular accessibility testing and improvements
