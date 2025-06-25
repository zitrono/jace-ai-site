/**
 * Focus Manager - Centralized focus management utilities for ralph-web
 * 
 * Provides reusable focus management for modals, menus, and overlays with:
 * - Focus trap management
 * - Focus restoration
 * - Keyboard navigation utilities
 * - Consistent escape key handling
 * - Accessibility compliance
 * 
 * @example
 * ```typescript
 * import { FocusManager } from '@/utils/focus-manager';
 * 
 * // Create focus manager for a modal
 * const focusManager = new FocusManager(modalElement);
 * 
 * // Enable focus trap
 * focusManager.enableFocusTrap();
 * 
 * // Store current focus for restoration
 * focusManager.storeFocus();
 * 
 * // Focus first element
 * focusManager.focusFirst();
 * 
 * // Later, restore focus and cleanup
 * focusManager.restoreFocus();
 * focusManager.destroy();
 * ```
 */

import type { StateManager } from './state-manager';

// Focus management types
export interface FocusableElement extends HTMLElement {
  focus(): void;
  blur(): void;
}

export interface FocusManagerOptions {
  /** Whether to automatically focus first element when enabled */
  autoFocus?: boolean;
  /** Whether to include hidden elements in focus trap */
  includeHidden?: boolean;
  /** Custom selector for focusable elements */
  focusableSelector?: string;
  /** Whether to wrap focus (default: true) */
  wrapFocus?: boolean;
  /** Whether to handle escape key (default: true) */
  handleEscape?: boolean;
  /** Callback when escape key is pressed */
  onEscape?: () => void;
  /** Callback when focus trap is activated */
  onActivate?: () => void;
  /** Callback when focus trap is deactivated */
  onDeactivate?: () => void;
}

export interface FocusSnapshot {
  activeElement: Element | null;
  elementId: string | null;
  elementTagName: string | null;
  elementSelector: string | null;
  timestamp: number;
}

export interface KeyboardNavigationOptions {
  /** Direction of navigation */
  direction?: 'forward' | 'backward' | 'first' | 'last';
  /** Whether to wrap at boundaries */
  wrap?: boolean;
  /** Custom element selector */
  selector?: string;
}

/**
 * Default selector for focusable elements
 */
export const DEFAULT_FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input[type="text"]:not([disabled])',
  'input[type="radio"]:not([disabled])',
  'input[type="checkbox"]:not([disabled])',
  'input[type="email"]:not([disabled])',
  'input[type="password"]:not([disabled])',
  'input[type="search"]:not([disabled])',
  'input[type="tel"]:not([disabled])',
  'input[type="url"]:not([disabled])',
  'input[type="number"]:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
  '[contenteditable="true"]:not([disabled])'
].join(', ');

/**
 * Focus Manager - Handles focus trapping and restoration for UI components
 */
export class FocusManager {
  private container: HTMLElement;
  private options: Required<FocusManagerOptions>;
  private isActive: boolean = false;
  private focusSnapshot: FocusSnapshot | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private stateManager: StateManager | null = null;
  private componentId: string | null = null;
  
  constructor(container: HTMLElement, options: FocusManagerOptions = {}) {
    this.container = container;
    this.options = {
      autoFocus: true,
      includeHidden: false,
      focusableSelector: DEFAULT_FOCUSABLE_SELECTOR,
      wrapFocus: true,
      handleEscape: true,
      onEscape: () => {},
      onActivate: () => {},
      onDeactivate: () => {},
      ...options
    };
  }

  /**
   * Set state manager for integration
   */
  public setStateManager(stateManager: StateManager, componentId: string): void {
    this.stateManager = stateManager;
    this.componentId = componentId;
  }

  /**
   * Get all focusable elements within the container
   */
  public getFocusableElements(): FocusableElement[] {
    const elements = this.container.querySelectorAll(this.options.focusableSelector);
    const focusableElements: FocusableElement[] = [];

    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      
      // Skip hidden elements unless includeHidden is true
      if (!this.options.includeHidden && this.isElementHidden(htmlElement)) {
        return;
      }
      
      // Skip disabled elements
      if (htmlElement.hasAttribute('disabled') || htmlElement.getAttribute('aria-disabled') === 'true') {
        return;
      }
      
      focusableElements.push(htmlElement as FocusableElement);
    });

    return focusableElements;
  }

  /**
   * Check if an element is hidden
   */
  private isElementHidden(element: HTMLElement): boolean {
    // Check computed styles
    const styles = window.getComputedStyle(element);
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return true;
    }
    
    // Check if element has zero dimensions
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return true;
    }
    
    // Check for hidden attribute
    if (element.hasAttribute('hidden')) {
      return true;
    }
    
    return false;
  }

  /**
   * Store current focus for later restoration
   */
  public storeFocus(): FocusSnapshot {
    const activeElement = document.activeElement;
    let elementId = null;
    let elementTagName = null;
    let elementSelector = null;

    if (activeElement && activeElement !== document.body) {
      const htmlElement = activeElement as HTMLElement;
      elementId = htmlElement.id || null;
      elementTagName = htmlElement.tagName.toLowerCase();
      
      // Create a more robust selector
      if (elementId) {
        elementSelector = `#${elementId}`;
      } else if (htmlElement.className) {
        const classes = htmlElement.className.split(' ').filter(c => c.length > 0);
        if (classes.length > 0) {
          elementSelector = `${elementTagName}.${classes.join('.')}`;
        }
      } else {
        elementSelector = elementTagName;
      }
    }

    this.focusSnapshot = {
      activeElement,
      elementId,
      elementTagName,
      elementSelector,
      timestamp: Date.now()
    };

    return this.focusSnapshot;
  }

  /**
   * Restore previously stored focus
   */
  public restoreFocus(): boolean {
    if (!this.focusSnapshot) {
      return false;
    }

    const { activeElement, elementId, elementSelector } = this.focusSnapshot;

    // Try to restore focus in order of preference
    let elementToFocus: HTMLElement | null = null;

    // 1. Try original element if still in DOM
    if (activeElement && document.contains(activeElement)) {
      elementToFocus = activeElement as HTMLElement;
    }
    // 2. Try by ID
    else if (elementId) {
      elementToFocus = document.getElementById(elementId);
    }
    // 3. Try by selector
    else if (elementSelector) {
      elementToFocus = document.querySelector(elementSelector) as HTMLElement;
    }

    if (elementToFocus && typeof elementToFocus.focus === 'function') {
      try {
        elementToFocus.focus();
        return true;
      } catch (error) {
        console.warn('Failed to restore focus:', error);
      }
    }

    // Fallback: focus body
    document.body.focus();
    return false;
  }

  /**
   * Focus the first focusable element
   */
  public focusFirst(): boolean {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      try {
        focusableElements[0].focus();
        return true;
      } catch (error) {
        console.warn('Failed to focus first element:', error);
      }
    }
    return false;
  }

  /**
   * Focus the last focusable element
   */
  public focusLast(): boolean {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      try {
        focusableElements[focusableElements.length - 1].focus();
        return true;
      } catch (error) {
        console.warn('Failed to focus last element:', error);
      }
    }
    return false;
  }

  /**
   * Navigate to next/previous focusable element
   */
  public navigate(options: KeyboardNavigationOptions = {}): boolean {
    const { direction = 'forward', wrap = this.options.wrapFocus } = options;
    const focusableElements = this.getFocusableElements();

    if (focusableElements.length === 0) {
      return false;
    }

    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

    let nextIndex: number;
    switch (direction) {
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = focusableElements.length - 1;
        break;
      case 'backward':
        if (currentIndex <= 0) {
          nextIndex = wrap ? focusableElements.length - 1 : 0;
        } else {
          nextIndex = currentIndex - 1;
        }
        break;
      case 'forward':
      default:
        if (currentIndex >= focusableElements.length - 1) {
          nextIndex = wrap ? 0 : focusableElements.length - 1;
        } else {
          nextIndex = currentIndex + 1;
        }
        break;
    }

    try {
      focusableElements[nextIndex].focus();
      return true;
    } catch (error) {
      console.warn('Failed to navigate focus:', error);
      return false;
    }
  }

  /**
   * Enable focus trap
   */
  public enableFocusTrap(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    
    // Store current focus
    this.storeFocus();
    
    // Setup keyboard handler
    this.keydownHandler = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.keydownHandler, { passive: false });
    
    // Auto focus first element if enabled
    if (this.options.autoFocus) {
      // Use requestAnimationFrame to ensure element is ready
      requestAnimationFrame(() => {
        this.focusFirst();
      });
    }
    
    // Call activate callback
    this.options.onActivate();
  }

  /**
   * Disable focus trap
   */
  public disableFocusTrap(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    
    // Remove keyboard handler
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    
    // Call deactivate callback
    this.options.onDeactivate();
  }

  /**
   * Handle keyboard events for focus trap
   */
  private handleKeydown(event: KeyboardEvent): void {
    // Only handle events when focus trap is active
    if (!this.isActive) {
      return;
    }

    // Handle escape key
    if (event.key === 'Escape' && this.options.handleEscape) {
      event.preventDefault();
      this.options.onEscape();
      
      // Integrate with state manager if available
      if (this.stateManager && this.componentId) {
        this.stateManager.setState(this.componentId, { isOpen: false }, { source: 'focus-manager-escape' });
      }
      
      return;
    }

    // Handle tab key for focus trapping
    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  }

  /**
   * Handle tab key for focus trapping
   */
  private handleTabKey(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    if (focusableElements.length === 1) {
      // Single focusable element - prevent default to keep focus
      event.preventDefault();
      return;
    }

    const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
    
    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (currentIndex <= 0) {
        event.preventDefault();
        if (this.options.wrapFocus) {
          focusableElements[focusableElements.length - 1].focus();
        }
      }
    } else {
      // Tab (forward)
      if (currentIndex >= focusableElements.length - 1) {
        event.preventDefault();
        if (this.options.wrapFocus) {
          focusableElements[0].focus();
        }
      }
    }
  }

  /**
   * Check if focus trap is currently active
   */
  public isTrapActive(): boolean {
    return this.isActive;
  }

  /**
   * Get current focus snapshot
   */
  public getFocusSnapshot(): FocusSnapshot | null {
    return this.focusSnapshot ? { ...this.focusSnapshot } : null;
  }

  /**
   * Destroy focus manager and clean up resources
   */
  public destroy(): void {
    this.disableFocusTrap();
    this.focusSnapshot = null;
    this.stateManager = null;
    this.componentId = null;
  }
}

/**
 * Utility functions for focus management
 */
export class FocusUtils {
  /**
   * Check if an element is focusable
   */
  static isFocusable(element: HTMLElement): boolean {
    // Check if element matches focusable selector
    if (!element.matches(DEFAULT_FOCUSABLE_SELECTOR)) {
      return false;
    }

    // Check if element is disabled
    if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false;
    }

    // Check if element is hidden
    const styles = window.getComputedStyle(element);
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return false;
    }

    return true;
  }

  /**
   * Find all focusable elements within a container
   */
  static findFocusableElements(container: HTMLElement, includeHidden: boolean = false): HTMLElement[] {
    const elements = container.querySelectorAll(DEFAULT_FOCUSABLE_SELECTOR);
    const focusableElements: HTMLElement[] = [];

    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      
      if (FocusUtils.isFocusable(htmlElement) || includeHidden) {
        focusableElements.push(htmlElement);
      }
    });

    return focusableElements;
  }

  /**
   * Create a focus trap for a container element
   */
  static createFocusTrap(container: HTMLElement, options?: FocusManagerOptions): FocusManager {
    return new FocusManager(container, options);
  }

  /**
   * Store current focus and return a restoration function
   */
  static storeFocus(): () => boolean {
    const activeElement = document.activeElement as HTMLElement;
    
    return () => {
      if (activeElement && typeof activeElement.focus === 'function') {
        try {
          activeElement.focus();
          return true;
        } catch (error) {
          console.warn('Failed to restore focus:', error);
        }
      }
      return false;
    };
  }

  /**
   * Focus the first focusable element in a container
   */
  static focusFirst(container: HTMLElement): boolean {
    const focusableElements = FocusUtils.findFocusableElements(container);
    if (focusableElements.length > 0) {
      try {
        focusableElements[0].focus();
        return true;
      } catch (error) {
        console.warn('Failed to focus first element:', error);
      }
    }
    return false;
  }

  /**
   * Focus the last focusable element in a container
   */
  static focusLast(container: HTMLElement): boolean {
    const focusableElements = FocusUtils.findFocusableElements(container);
    if (focusableElements.length > 0) {
      try {
        focusableElements[focusableElements.length - 1].focus();
        return true;
      } catch (error) {
        console.warn('Failed to focus last element:', error);
      }
    }
    return false;
  }
}

/**
 * Keyboard navigation manager for components with arrow key navigation
 */
export class KeyboardNavigationManager {
  private container: HTMLElement;
  private selector: string;
  private currentIndex: number = -1;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private isActive: boolean = false;

  constructor(container: HTMLElement, selector: string = DEFAULT_FOCUSABLE_SELECTOR) {
    this.container = container;
    this.selector = selector;
  }

  /**
   * Enable keyboard navigation
   */
  public enable(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.keydownHandler = this.handleKeydown.bind(this);
    this.container.addEventListener('keydown', this.keydownHandler, { passive: false });
  }

  /**
   * Disable keyboard navigation
   */
  public disable(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    if (this.keydownHandler) {
      this.container.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown(event: KeyboardEvent): void {
    const elements = Array.from(this.container.querySelectorAll(this.selector)) as HTMLElement[];
    
    if (elements.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.currentIndex = Math.min(this.currentIndex + 1, elements.length - 1);
        elements[this.currentIndex].focus();
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        elements[this.currentIndex].focus();
        break;
        
      case 'Home':
        event.preventDefault();
        this.currentIndex = 0;
        elements[this.currentIndex].focus();
        break;
        
      case 'End':
        event.preventDefault();
        this.currentIndex = elements.length - 1;
        elements[this.currentIndex].focus();
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.currentIndex >= 0 && elements[this.currentIndex]) {
          elements[this.currentIndex].click();
        }
        break;
    }
  }

  /**
   * Set current focused element index
   */
  public setCurrentIndex(index: number): void {
    const elements = Array.from(this.container.querySelectorAll(this.selector));
    if (index >= 0 && index < elements.length) {
      this.currentIndex = index;
    }
  }

  /**
   * Get current focused element index
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Destroy and clean up
   */
  public destroy(): void {
    this.disable();
    this.currentIndex = -1;
  }
}

/**
 * Export commonly used utilities
 */
// Already exported as class declarations above

/**
 * Export default focus manager factory
 */
export default {
  create: (container: HTMLElement, options?: FocusManagerOptions) => new FocusManager(container, options),
  utils: FocusUtils,
  keyboard: (container: HTMLElement, selector?: string) => new KeyboardNavigationManager(container, selector)
};