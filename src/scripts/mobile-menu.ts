/**
 * Mobile Menu Module
 * Handles mobile menu toggle functionality with smooth animations
 */

import { queryElement, addEventListenerSafe, raf } from './dom-utils';

export class MobileMenuManager {
  private mobileMenuButton: HTMLElement | null;
  private mobileMenuClose: HTMLElement | null;
  private mobileMenu: HTMLElement | null;
  private animationDuration = 200; // milliseconds

  constructor() {
    this.mobileMenuButton = queryElement<HTMLElement>('#mobile-menu-button');
    this.mobileMenuClose = queryElement<HTMLElement>('#mobile-menu-close');
    this.mobileMenu = queryElement<HTMLElement>('#mobile-menu');
  }

  /**
   * Initialize mobile menu event listeners
   */
  public init(): void {
    // Open menu button
    addEventListenerSafe(this.mobileMenuButton, 'click', () => this.showMenu());

    // Close menu button
    addEventListenerSafe(this.mobileMenuClose, 'click', () => this.hideMenu());

    // Close on backdrop click
    if (this.mobileMenu) {
      addEventListenerSafe(this.mobileMenu, 'click', (e) => {
        const target = e.target as HTMLElement;
        if (target === this.mobileMenu || target === this.mobileMenu?.firstElementChild) {
          this.hideMenu();
        }
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.hideMenu();
      }
    });
  }

  /**
   * Show mobile menu with animation
   */
  private showMenu(): void {
    if (!this.mobileMenu) return;

    this.mobileMenu.classList.remove('hidden');
    this.mobileMenu.style.opacity = '0';
    this.mobileMenu.style.transform = 'translateY(-20px)';
    this.mobileMenuButton?.setAttribute('aria-expanded', 'true');

    // Trigger animation on next frame
    raf(() => {
      if (this.mobileMenu) {
        this.mobileMenu.style.opacity = '1';
        this.mobileMenu.style.transform = 'translateY(0)';
      }
    });

    // Trap focus
    this.trapFocus();
  }

  /**
   * Hide mobile menu with animation
   */
  private hideMenu(): void {
    if (!this.mobileMenu) return;

    this.mobileMenu.style.opacity = '0';
    this.mobileMenu.style.transform = 'translateY(-20px)';
    this.mobileMenuButton?.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      if (this.mobileMenu) {
        this.mobileMenu.classList.add('hidden');
      }
    }, this.animationDuration);

    // Return focus to menu button
    this.mobileMenuButton?.focus();
  }

  /**
   * Check if menu is currently open
   */
  private isMenuOpen(): boolean {
    return this.mobileMenu ? !this.mobileMenu.classList.contains('hidden') : false;
  }

  /**
   * Trap focus within mobile menu for accessibility
   */
  private trapFocus(): void {
    if (!this.mobileMenu) return;

    const focusableElements = this.mobileMenu.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstFocusable?.focus();

    // Handle tab key
    this.mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    });
  }
}
