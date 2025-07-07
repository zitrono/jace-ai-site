/**
 * Header Scroll Manager - Handles header scroll behavior
 * Manages glassmorphic effect on scroll without global scope pollution
 */

export class HeaderScrollManager {
  private static instance: HeaderScrollManager;
  private header: HTMLElement | null = null;
  private scrollY = 0;
  private ticking = false;
  private scrollThreshold = 80;

  private constructor() {
    this.initializeHeader();
    this.setupScrollListener();
    this.setupViewportListener();
  }

  static getInstance(): HeaderScrollManager {
    if (!HeaderScrollManager.instance) {
      HeaderScrollManager.instance = new HeaderScrollManager();
    }
    return HeaderScrollManager.instance;
  }

  private initializeHeader(): void {
    this.header = document.querySelector('header');
    if (!this.header) {
      console.warn('Header element not found');
    }
  }

  private updateHeader = (): void => {
    if (!this.header) return;

    if (this.scrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    this.ticking = false;
  };

  private onScroll = (): void => {
    this.scrollY = window.scrollY;

    if (!this.ticking) {
      window.requestAnimationFrame(this.updateHeader);
      this.ticking = true;
    }
  };

  private setupScrollListener(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    // Check initial state
    this.onScroll();
  }

  private setupViewportListener(): void {
    // iOS viewport height fix
    const updateViewportHeight = (): void => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
  }

  // Clean up method for SPA navigation
  destroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}

// Export singleton instance
export const headerScrollManager = HeaderScrollManager.getInstance();
