/**
 * Modal Management Module
 * Handles modal display, focus trapping, and accessibility
 */

import { queryElement, addEventListenerSafe } from './dom-utils';

export class ModalManager {
  private activeModal: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;

  /**
   * Initialize modal functionality
   */
  public init(): void {
    // Set up login button event listeners
    this.setupLoginButtons();

    // Set up global function for compatibility
    this.setupGlobalFunctions();

    // Handle escape key globally
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.hideModal();
      }
    });
  }

  /**
   * Set up login button event listeners
   */
  private setupLoginButtons(): void {
    const loginButton = queryElement<HTMLElement>('#login-button');
    const mobileLoginButton = queryElement<HTMLElement>('#mobile-login-button');

    addEventListenerSafe(loginButton, 'click', () => this.showLoginModal());
    addEventListenerSafe(mobileLoginButton, 'click', () => this.showLoginModal());
  }

  /**
   * Show login modal (placeholder implementation)
   */
  public showLoginModal(): void {
    // For now, this is a placeholder - in a real implementation,
    // this would show an actual login modal
    console.log('Login modal would be shown here');

    // Dispatch custom event for potential analytics
    const event = new CustomEvent('loginModalRequested');
    document.dispatchEvent(event);

    // Placeholder: For now, we'll just redirect to a contact form
    // In the future, this could open a proper login modal
    this.showContactModal();
  }

  /**
   * Show a generic modal
   */
  public showModal(modalId: string): void {
    const modal = queryElement<HTMLElement>(`#${modalId}`);
    if (!modal) {
      console.error(`Modal with ID ${modalId} not found`);
      return;
    }

    // Store reference to previously focused element
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Show modal
    this.activeModal = modal;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element in modal
    this.focusFirstElement(modal);

    // Set up focus trapping
    this.trapFocus(modal);
  }

  /**
   * Hide the currently active modal
   */
  public hideModal(): void {
    if (!this.activeModal) return;

    this.activeModal.classList.add('hidden');
    this.activeModal.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to previously focused element
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }

    this.activeModal = null;
  }

  /**
   * Focus the first focusable element in modal
   */
  private focusFirstElement(modal: HTMLElement): void {
    const focusableElements = modal.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  /**
   * Trap focus within modal for accessibility
   */
  private trapFocus(modal: HTMLElement): void {
    const focusableElements = modal.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
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
    };

    modal.addEventListener('keydown', handleTabKey);
  }

  /**
   * Show contact modal (placeholder for login functionality)
   */
  private showContactModal(): void {
    // This is a placeholder implementation
    // In a real application, this would show a proper modal
    const message = 'Login functionality coming soon! For now, please contact us directly.';

    if (confirm(message + '\n\nWould you like to send us an email?')) {
      window.location.href =
        'mailto:Konstantin@beneficious.com?subject=Login Request&body=Hello, I would like to access Ralph.';
    }
  }

  /**
   * Set up global functions for compatibility
   */
  private setupGlobalFunctions(): void {
    (window as any).showLoginModal = () => this.showLoginModal();
  }
}
