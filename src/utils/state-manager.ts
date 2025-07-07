/**
 * State Manager - Centralized state management for ralph-web
 *
 * Provides centralized state management for UI components with:
 * - Single source of truth for each piece of state
 * - Body scroll lock coordination
 * - State synchronization utilities
 * - Proper cleanup management
 * - Memory leak prevention
 * - Race condition prevention
 *
 * @example
 * ```typescript
 * import { StateManager } from '@/utils/state-manager';
 *
 * // Initialize state manager
 * const stateManager = StateManager.getInstance();
 *
 * // Register component state
 * stateManager.registerState('mobileMenu', { isOpen: false });
 *
 * // Update state
 * stateManager.setState('mobileMenu', { isOpen: true });
 *
 * // Subscribe to state changes
 * const unsubscribe = stateManager.subscribe('mobileMenu', (state) => {
 *   console.log('Mobile menu state:', state);
 * });
 * ```
 */

// State management types
export type StateValue = boolean | string | number | object | null | undefined;

export interface ComponentState {
  [key: string]: StateValue;
}

export interface StateUpdateOptions {
  /** Whether to emit change events */
  silent?: boolean;
  /** Whether to merge with existing state or replace */
  merge?: boolean;
  /** Optional metadata for debugging */
  source?: string;
}

export interface StateSubscription {
  /** Component identifier */
  componentId: string;
  /** Callback function */
  callback: StateChangeCallback;
  /** Cleanup function */
  cleanup: () => void;
}

export type StateChangeCallback = (
  newState: ComponentState,
  oldState: ComponentState,
  source?: string
) => void;

export interface ScrollLockOptions {
  /** Whether to store scroll position for restoration */
  storePosition?: boolean;
  /** Whether to prevent touch scrolling on mobile */
  preventTouch?: boolean;
  /** Custom CSS class to add to body */
  className?: string;
}

// Global state interface for specific UI components
export interface GlobalUIState {
  mobileMenu: {
    isOpen: boolean;
    isAnimating: boolean;
    scrollPosition: number;
  };
  loginModal: {
    isOpen: boolean;
    isAnimating: boolean;
    previousFocus: string | null;
  };
  cookieConsent: {
    isVisible: boolean;
    isAnimating: boolean;
    consentValue: 'accepted' | 'rejected' | 'settings' | null;
  };
  faq: {
    openItems: Set<string>;
    animatingItems: Set<string>;
  };
}

/**
 * Centralized State Manager - Singleton pattern for global state coordination
 */
export class StateManager {
  private static instance: StateManager;
  private states: Map<string, ComponentState> = new Map();
  private subscriptions: Map<string, StateSubscription[]> = new Map();
  private scrollLockStack: string[] = [];
  private storedScrollPosition: number = 0;
  private globalFunctions: Map<string, () => void> = new Map();
  private cleanupQueue: (() => void)[] = [];

  private constructor() {
    this.setupEventListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  /**
   * Register a component's initial state
   */
  public registerState(componentId: string, initialState: ComponentState): void {
    if (this.states.has(componentId)) {
      console.warn(
        `State for component '${componentId}' already registered. Updating with new state.`
      );
    }

    this.states.set(componentId, { ...initialState });

    // Initialize subscription array if not exists
    if (!this.subscriptions.has(componentId)) {
      this.subscriptions.set(componentId, []);
    }
  }

  /**
   * Get current state for a component
   */
  public getState<T extends ComponentState = ComponentState>(componentId: string): T | null {
    const state = this.states.get(componentId);
    return state ? ({ ...state } as T) : null;
  }

  /**
   * Update component state
   */
  public setState(
    componentId: string,
    newState: Partial<ComponentState>,
    options: StateUpdateOptions = {}
  ): void {
    const { silent = false, merge = true, source } = options;

    const currentState = this.states.get(componentId) || {};
    const oldState = { ...currentState };

    const updatedState = merge ? { ...currentState, ...newState } : { ...newState };

    this.states.set(componentId, updatedState);

    if (!silent) {
      this.notifySubscribers(componentId, updatedState, oldState, source);
    }
  }

  /**
   * Subscribe to state changes for a component
   */
  public subscribe(componentId: string, callback: StateChangeCallback): () => void {
    const subscriptions = this.subscriptions.get(componentId) || [];

    const cleanup = () => {
      const index = subscriptions.findIndex((sub) => sub.callback === callback);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
    };

    const subscription: StateSubscription = {
      componentId,
      callback,
      cleanup,
    };

    subscriptions.push(subscription);
    this.subscriptions.set(componentId, subscriptions);

    // Add to cleanup queue
    this.cleanupQueue.push(cleanup);

    return cleanup;
  }

  /**
   * Notify all subscribers of state changes
   */
  private notifySubscribers(
    componentId: string,
    newState: ComponentState,
    oldState: ComponentState,
    source?: string
  ): void {
    const subscriptions = this.subscriptions.get(componentId) || [];

    subscriptions.forEach((subscription) => {
      try {
        subscription.callback(newState, oldState, source);
      } catch (error) {
        console.error(`Error in state change callback for ${componentId}:`, error);
      }
    });
  }

  /**
   * Body scroll lock coordination - only one component controls scroll at a time
   */
  public lockBodyScroll(componentId: string, options: ScrollLockOptions = {}): void {
    const { storePosition = true, preventTouch = true, className = 'scroll-locked' } = options;

    // Store scroll position if this is the first lock
    if (this.scrollLockStack.length === 0 && storePosition) {
      this.storedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    }

    // Add component to lock stack if not already present
    if (!this.scrollLockStack.includes(componentId)) {
      this.scrollLockStack.push(componentId);
    }

    // Apply scroll lock styles
    document.body.classList.add(className);
    document.documentElement.classList.add(className);

    // Store current scroll position in component state
    this.setState(componentId, { scrollPosition: this.storedScrollPosition });

    // Prevent touch scrolling on mobile if requested
    if (preventTouch) {
      document.addEventListener('touchmove', this.preventTouchScroll, { passive: false });
    }

    // Update component state
    this.setState(componentId, { hasScrollLock: true });
  }

  /**
   * Release body scroll lock for a component
   */
  public unlockBodyScroll(componentId: string, options: ScrollLockOptions = {}): void {
    const { className = 'scroll-locked' } = options;

    // Remove component from lock stack
    const index = this.scrollLockStack.indexOf(componentId);
    if (index !== -1) {
      this.scrollLockStack.splice(index, 1);
    }

    // Only unlock if no other components have locks
    if (this.scrollLockStack.length === 0) {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);

      // Remove touch scroll prevention
      document.removeEventListener('touchmove', this.preventTouchScroll);

      // Restore scroll position
      if (this.storedScrollPosition > 0) {
        window.scrollTo(0, this.storedScrollPosition);
        this.storedScrollPosition = 0;
      }
    }

    // Update component state
    this.setState(componentId, { hasScrollLock: false });
  }

  /**
   * Prevent touch scrolling for mobile devices
   */
  private preventTouchScroll = (e: TouchEvent): void => {
    // Allow scrolling within components that should scroll (like mobile menu panels)
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-allow-scroll]') ||
      target.closest('[data-mobile-menu-panel]') ||
      target.closest('.modal-content')
    ) {
      return;
    }

    e.preventDefault();
  };

  /**
   * Check if any component currently has scroll lock
   */
  public isScrollLocked(): boolean {
    return this.scrollLockStack.length > 0;
  }

  /**
   * Get list of components that currently have scroll lock
   */
  public getScrollLockStack(): string[] {
    return [...this.scrollLockStack];
  }

  /**
   * Register a global function (for backward compatibility)
   */
  public registerGlobalFunction(name: string, fn: () => void): void {
    this.globalFunctions.set(name, fn);
    (window as any)[name] = fn;
  }

  /**
   * Unregister a global function
   */
  public unregisterGlobalFunction(name: string): void {
    this.globalFunctions.delete(name);
    delete (window as any)[name];
  }

  /**
   * Batch state updates for performance
   */
  public batchStateUpdates(
    updates: Array<{
      componentId: string;
      state: Partial<ComponentState>;
      options?: StateUpdateOptions;
    }>
  ): void {
    // Suppress notifications during batch
    updates.forEach(({ componentId, state, options }) => {
      this.setState(componentId, state, { ...options, silent: true });
    });

    // Notify all affected components at once
    const affectedComponents = new Set(updates.map((u) => u.componentId));
    affectedComponents.forEach((componentId) => {
      const currentState = this.states.get(componentId) || {};
      this.notifySubscribers(componentId, currentState, {}, 'batch-update');
    });
  }

  /**
   * Reset state for a component
   */
  public resetState(componentId: string, initialState?: ComponentState): void {
    const oldState = this.states.get(componentId) || {};
    const newState = initialState || {};

    this.states.set(componentId, newState);
    this.notifySubscribers(componentId, newState, oldState, 'reset');
  }

  /**
   * Remove component state and subscriptions
   */
  public unregisterComponent(componentId: string): void {
    // Clean up state
    this.states.delete(componentId);

    // Clean up subscriptions
    const subscriptions = this.subscriptions.get(componentId) || [];
    subscriptions.forEach((sub) => sub.cleanup());
    this.subscriptions.delete(componentId);

    // Remove from scroll lock stack
    const index = this.scrollLockStack.indexOf(componentId);
    if (index !== -1) {
      this.unlockBodyScroll(componentId);
    }
  }

  /**
   * Setup global event listeners for cleanup
   */
  private setupEventListeners(): void {
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Clean up on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.cleanup();
      }
    });

    // Handle escape key globally for modal/menu closing
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });
  }

  /**
   * Handle global escape key presses
   */
  private handleEscapeKey(): void {
    // Check for open modals/menus in priority order
    const mobileMenuState = this.getState('mobileMenu');
    if (mobileMenuState?.isOpen) {
      this.setState('mobileMenu', { isOpen: false }, { source: 'escape-key' });
      return;
    }

    const loginModalState = this.getState('loginModal');
    if (loginModalState?.isOpen) {
      this.setState('loginModal', { isOpen: false }, { source: 'escape-key' });
      return;
    }
  }

  /**
   * Clean up all resources
   */
  public cleanup(): void {
    // Release all scroll locks
    this.scrollLockStack.forEach((componentId) => {
      this.unlockBodyScroll(componentId);
    });

    // Clean up all subscriptions
    this.cleanupQueue.forEach((cleanup) => cleanup());
    this.cleanupQueue.length = 0;

    // Unregister global functions
    this.globalFunctions.forEach((_, name) => {
      this.unregisterGlobalFunction(name);
    });

    // Clear all state
    this.states.clear();
    this.subscriptions.clear();
  }

  /**
   * Debug helper - get current state snapshot
   */
  public getStateSnapshot(): Record<string, ComponentState> {
    const snapshot: Record<string, ComponentState> = {};
    this.states.forEach((state, componentId) => {
      snapshot[componentId] = { ...state };
    });
    return snapshot;
  }

  /**
   * Debug helper - get subscription count for a component
   */
  public getSubscriptionCount(componentId: string): number {
    return this.subscriptions.get(componentId)?.length || 0;
  }
}

/**
 * Convenience function to get state manager instance
 */
export function getStateManager(): StateManager {
  return StateManager.getInstance();
}

/**
 * Initialize state manager with default UI component states
 */
export function initializeStateManager(): StateManager {
  const stateManager = StateManager.getInstance();

  // Register default UI component states
  stateManager.registerState('mobileMenu', {
    isOpen: false,
    isAnimating: false,
    scrollPosition: 0,
    hasScrollLock: false,
  });

  stateManager.registerState('loginModal', {
    isOpen: false,
    isAnimating: false,
    previousFocus: null,
    hasScrollLock: false,
  });

  stateManager.registerState('cookieConsent', {
    isVisible: false,
    isAnimating: false,
    consentValue: null,
  });

  stateManager.registerState('faq', {
    openItems: new Set<string>(),
    animatingItems: new Set<string>(),
  });

  return stateManager;
}

// Export singleton instance for direct use
export default StateManager.getInstance();
