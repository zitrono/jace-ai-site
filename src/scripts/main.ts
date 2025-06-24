/**
 * Main Script
 * Initializes all managers and handles global functionality
 */

import { onDOMReady } from './dom-utils';
// import { MobileMenuManager } from './mobile-menu';
import { FAQManager } from './faq-toggle';
import { CookieConsentManager } from './cookie-consent';
import { ModalManager } from './modal-manager';

class AppManager {
  // private mobileMenu: MobileMenuManager;
  private faqManager: FAQManager;
  private cookieConsent: CookieConsentManager;
  private modalManager: ModalManager;

  constructor() {
    // this.mobileMenu = new MobileMenuManager();
    this.faqManager = new FAQManager();
    this.cookieConsent = new CookieConsentManager();
    this.modalManager = new ModalManager();
  }

  /**
   * Initialize all application functionality
   */
  public init(): void {
    onDOMReady(() => {
      // Initialize all managers
      // this.mobileMenu.init(); // Using Header.astro's implementation instead
      this.faqManager.init();
      this.cookieConsent.init();
      this.modalManager.init();

      // Set up additional functionality
      this.setupBookDemoButtons();
      this.preloadCriticalResources();

      console.log('Ralph application initialized successfully');
    });
  }

  /**
   * Set up Book a Demo button functionality with event delegation
   */
  private setupBookDemoButtons(): void {
    // Use event delegation for better performance
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (
        target.tagName === 'BUTTON' &&
        (target.textContent?.includes('Book a Demo') || target.textContent?.includes('Book Demo'))
      ) {
        e.preventDefault();
        this.handleBookDemo();
      }
    });
  }

  /**
   * Handle Book a Demo button clicks
   */
  private handleBookDemo(): void {
    const subject = encodeURIComponent('Ralph Demo Request');
    const body = encodeURIComponent(
      'Hello, I would like to schedule a demo of Ralph for my PE firm.'
    );
    const mailtoUrl = `mailto:Konstantin@beneficious.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
  }

  /**
   * Preload critical resources for better performance
   */
  private preloadCriticalResources(): void {
    const criticalImages = ['/ralph-web/ralph_favicon.svg'];

    criticalImages.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Initialize the application
const app = new AppManager();
app.init();

// Export for potential external access
export default app;
