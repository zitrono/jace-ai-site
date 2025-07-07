/**
 * Mobile Menu Manager - Centralized mobile menu control
 * Prevents global scope pollution and manages scroll locking
 */

export class MobileMenuManager {
  private static instance: MobileMenuManager;
  private menu: HTMLElement | null = null;
  private menuButton: HTMLElement | null = null;
  private isOpen = false;

  private constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.setupViewportFix();
  }

  static getInstance(): MobileMenuManager {
    if (!MobileMenuManager.instance) {
      MobileMenuManager.instance = new MobileMenuManager();
    }
    return MobileMenuManager.instance;
  }

  private initializeElements(): void {
    this.menu = document.getElementById('mobile-menu');
    this.menuButton = document.getElementById('mobile-menu-button');
  }

  private setupEventListeners(): void {
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Handle resize to close menu on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.close();
      }
    });
  }

  private setupViewportFix(): void {
    // iOS viewport height fix
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
  }

  open(): void {
    if (!this.menu || window.innerWidth >= 1024) return;

    this.menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;

    if (this.menuButton) {
      this.menuButton.setAttribute('aria-expanded', 'true');
    }
  }

  close(): void {
    if (!this.menu) return;

    this.menu.classList.add('hidden');
    document.body.style.overflow = '';
    this.isOpen = false;

    if (this.menuButton) {
      this.menuButton.setAttribute('aria-expanded', 'false');
    }
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Export singleton instance
export const mobileMenuManager = MobileMenuManager.getInstance();
