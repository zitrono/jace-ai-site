/**
 * @deprecated - FAQ functionality has been moved to unified animation system
 * This file is preserved for git history and potential future reference
 * DO NOT IMPORT OR USE - Use /src/utils/animation-manager.ts instead
 * 
 * FAQ Toggle Module
 * Handles FAQ accordion functionality with smooth transitions and accessibility
 */

export class FAQManager {
  private animationDuration = 300; // milliseconds

  /**
   * Initialize FAQ functionality
   */
  public init(): void {
    // Set up global functions for inline onclick handlers
    this.setupGlobalFunctions();
  }

  /**
   * Toggle FAQ item open/closed state
   */
  public toggleFAQ(button: HTMLElement): void {
    const content = button.nextElementSibling as HTMLElement;
    const arrow = button.querySelector('svg');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (!content) {
      console.error('FAQ content element not found');
      return;
    }

    if (isExpanded) {
      this.collapseFAQ(button, content, arrow);
    } else {
      this.expandFAQ(button, content, arrow);
    }
  }

  /**
   * Handle keyboard events for FAQ buttons
   */
  public handleFAQKeydown(event: KeyboardEvent, button: HTMLElement): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleFAQ(button);
    }
  }

  /**
   * Expand FAQ item
   */
  private expandFAQ(button: HTMLElement, content: HTMLElement, arrow: Element | null): void {
    // Remove hidden class and set initial state
    content.classList.remove('hidden');
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    // Force browser reflow
    content.offsetHeight;

    // Animate to full height
    content.style.maxHeight = content.scrollHeight + 'px';
    content.style.opacity = '1';

    // Update button state
    arrow?.classList.add('rotate-180');
    button.setAttribute('aria-expanded', 'true');

    // Remove max-height after animation completes
    setTimeout(() => {
      content.style.maxHeight = 'none';
    }, this.animationDuration);
  }

  /**
   * Collapse FAQ item
   */
  private collapseFAQ(button: HTMLElement, content: HTMLElement, arrow: Element | null): void {
    // Set explicit height before collapsing
    content.style.maxHeight = content.scrollHeight + 'px';

    // Force browser reflow
    content.offsetHeight;

    // Animate to zero height
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    // Update button state
    arrow?.classList.remove('rotate-180');
    button.setAttribute('aria-expanded', 'false');

    // Hide element after animation
    setTimeout(() => {
      content.classList.add('hidden');
    }, this.animationDuration);
  }

  /**
   * Set up global functions for compatibility with inline onclick handlers
   */
  private setupGlobalFunctions(): void {
    // Make functions available globally for inline onclick handlers
    (window as any).toggleFAQ = (button: HTMLElement) => this.toggleFAQ(button);
    (window as any).handleFAQKeydown = (event: KeyboardEvent, button: HTMLElement) =>
      this.handleFAQKeydown(event, button);
  }
}
