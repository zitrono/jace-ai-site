/**
 * Animation Manager - Unified animation system for ralph-web
 * 
 * Provides consistent animations across all components with:
 * - Standardized 300ms duration
 * - Performance-optimized transforms
 * - Proper cleanup mechanisms
 * - Accessibility considerations
 * - Memory leak prevention
 * 
 * @example
 * ```typescript
 * import { fadeIn, slideUp, createAnimationCleanup } from '@/utils/animation-manager';
 * 
 * const cleanup = fadeIn(element, { duration: 300 });
 * // Later: cleanup() to prevent memory leaks
 * ```
 */

// Animation configuration constants
export const ANIMATION_CONFIG = {
  /** Standard duration for all animations (300ms) */
  DURATION: 300,
  /** Easing function for smooth transitions */
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Reduced motion duration for accessibility */
  REDUCED_MOTION_DURATION: 150,
} as const;

// Animation state tracking for cleanup
const activeAnimations = new WeakMap<Element, AnimationCleanup>();
const activeTimeouts = new Set<number>();

export interface AnimationOptions {
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Callback when animation starts */
  onStart?: () => void;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean;
}

export interface AnimationCleanup {
  /** Cancel the animation and clean up resources */
  cleanup: () => void;
  /** Promise that resolves when animation completes */
  promise: Promise<void>;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get effective duration considering reduced motion preferences
 */
function getEffectiveDuration(duration?: number, respectReducedMotion = true): number {
  const baseDuration = duration ?? ANIMATION_CONFIG.DURATION;
  
  if (respectReducedMotion && prefersReducedMotion()) {
    return ANIMATION_CONFIG.REDUCED_MOTION_DURATION;
  }
  
  return baseDuration;
}

/**
 * Create a cleanup-aware timeout
 */
function createTimeout(callback: () => void, delay: number): number {
  const timeoutId = window.setTimeout(() => {
    activeTimeouts.delete(timeoutId);
    callback();
  }, delay);
  
  activeTimeouts.add(timeoutId);
  return timeoutId;
}

/**
 * Clean up all active timeouts (for emergency cleanup)
 */
export function cleanupAllTimeouts(): void {
  activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  activeTimeouts.clear();
}

/**
 * Prepare element for animation with will-change optimization
 */
function prepareElementForAnimation(element: HTMLElement, properties: string[]): void {
  element.style.willChange = properties.join(', ');
}

/**
 * Clean up element after animation
 */
function cleanupElementAfterAnimation(element: HTMLElement): void {
  element.style.willChange = 'auto';
}

/**
 * Fade in animation
 */
export function fadeIn(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['opacity']);
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.opacity = '1';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Fade out animation
 */
export function fadeOut(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['opacity']);
    element.style.transition = `opacity ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.opacity = '0';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Slide up animation (for FAQ collapse)
 */
export function slideUp(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element with current height
    const currentHeight = element.offsetHeight;
    prepareElementForAnimation(element, ['transform', 'opacity']);
    
    element.style.height = `${currentHeight}px`;
    element.style.overflow = 'hidden';
    element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.transform = 'translateY(-100%)';
      element.style.opacity = '0';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.height = '';
        element.style.overflow = '';
        element.style.transform = '';
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.height = '';
    element.style.overflow = '';
    element.style.transform = '';
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Slide down animation (for FAQ expand)
 */
export function slideDown(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['transform', 'opacity']);
    
    element.style.transform = 'translateY(-100%)';
    element.style.opacity = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.overflow = '';
        element.style.transform = '';
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.overflow = '';
    element.style.transform = '';
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Mobile menu slide in animation
 */
export function mobileMenuSlideIn(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['transform']);
    element.style.transform = 'translateX(100%)';
    element.style.transition = `transform ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.transform = 'translateX(0)';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Mobile menu slide out animation
 */
export function mobileMenuSlideOut(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['transform']);
    element.style.transition = `transform ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.transform = 'translateX(100%)';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Cookie banner slide up animation
 */
export function cookieBannerSlideUp(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['transform', 'opacity']);
    element.style.transform = 'translateY(100%)';
    element.style.opacity = '0';
    element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Cookie banner slide down animation (hide)
 */
export function cookieBannerSlideDown(
  element: HTMLElement | null,
  options: AnimationOptions = {}
): AnimationCleanup {
  if (!element) {
    return {
      cleanup: () => {},
      promise: Promise.resolve(),
    };
  }

  const duration = getEffectiveDuration(options.duration, options.respectReducedMotion);
  const easing = options.easing ?? ANIMATION_CONFIG.EASING;

  // Clean up any existing animation
  const existingCleanup = activeAnimations.get(element);
  if (existingCleanup) {
    existingCleanup.cleanup();
  }

  let timeoutId: number | null = null;
  let resolved = false;

  const promise = new Promise<void>((resolve) => {
    // Prepare element
    prepareElementForAnimation(element, ['transform', 'opacity']);
    element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
    
    // Trigger animation on next frame
    requestAnimationFrame(() => {
      if (resolved) return;
      
      options.onStart?.();
      element.style.transform = 'translateY(100%)';
      element.style.opacity = '0';
      
      // Complete animation
      timeoutId = createTimeout(() => {
        if (resolved) return;
        resolved = true;
        
        cleanupElementAfterAnimation(element);
        element.style.transition = '';
        activeAnimations.delete(element);
        options.onComplete?.();
        resolve();
      }, duration);
    });
  });

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      activeTimeouts.delete(timeoutId);
    }
    
    cleanupElementAfterAnimation(element);
    element.style.transition = '';
    activeAnimations.delete(element);
  };

  const animationCleanup = { cleanup, promise };
  activeAnimations.set(element, animationCleanup);
  
  return animationCleanup;
}

/**
 * Clean up all active animations (for emergency cleanup)
 */
export function cleanupAllAnimations(): void {
  // Clean up all timeouts
  cleanupAllTimeouts();
  
  // Note: WeakMap doesn't support iteration, so we rely on individual cleanup
  // This is intentional for memory efficiency - WeakMap allows garbage collection
  // of elements when they're no longer referenced elsewhere
}

/**
 * Initialize animation system (call on page load)
 */
export function initAnimationSystem(): void {
  // Clean up on page unload to prevent memory leaks
  window.addEventListener('beforeunload', () => {
    cleanupAllAnimations();
  });
  
  // Clean up on page visibility change (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cleanupAllAnimations();
    }
  });
}