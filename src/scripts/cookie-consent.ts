/**
 * @deprecated - Cookie consent functionality has been moved to unified animation system
 * This file is preserved for git history and potential future reference
 * DO NOT IMPORT OR USE - Use /src/utils/animation-manager.ts instead
 * 
 * Cookie Consent Module
 * Handles cookie banner display and consent management
 */

import { queryElement, addEventListenerSafe } from './dom-utils';

export type ConsentValue = 'accepted' | 'rejected' | 'settings';

export class CookieConsentManager {
  private banner: HTMLElement | null;
  private acceptBtn: HTMLElement | null;
  private rejectBtn: HTMLElement | null;
  private settingsBtn: HTMLElement | null;
  private storageKey = 'cookieConsent';
  private showDelay = 1000; // milliseconds

  constructor() {
    this.banner = queryElement<HTMLElement>('#cookie-banner');
    this.acceptBtn = queryElement<HTMLElement>('#cookie-accept');
    this.rejectBtn = queryElement<HTMLElement>('#cookie-reject');
    this.settingsBtn = queryElement<HTMLElement>('#cookie-settings');
  }

  /**
   * Initialize cookie consent functionality
   */
  public init(): void {
    // Set up event listeners
    addEventListenerSafe(this.acceptBtn, 'click', () => this.setConsent('accepted'));
    addEventListenerSafe(this.rejectBtn, 'click', () => this.setConsent('rejected'));
    addEventListenerSafe(this.settingsBtn, 'click', () => this.handleSettings());

    // Show banner if consent not given
    if (!this.hasConsent()) {
      this.showBanner();
    }
  }

  /**
   * Check if user has already given consent
   */
  private hasConsent(): boolean {
    try {
      return localStorage.getItem(this.storageKey) !== null;
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      return false;
    }
  }

  /**
   * Show cookie banner with animation
   */
  private showBanner(): void {
    if (!this.banner) return;

    // Show banner after delay
    setTimeout(() => {
      if (this.banner) {
        this.banner.style.opacity = '1';
        this.banner.style.transform = 'translateY(0)';
      }
    }, this.showDelay);
  }

  /**
   * Hide cookie banner with animation
   */
  private hideBanner(): void {
    if (!this.banner) return;

    this.banner.style.opacity = '0';
    this.banner.style.transform = 'translateY(100vh)';
  }

  /**
   * Set cookie consent value
   */
  private setConsent(value: ConsentValue): void {
    try {
      localStorage.setItem(this.storageKey, value);
      this.hideBanner();
      this.onConsentChange(value);
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
  }

  /**
   * Handle cookie settings (placeholder for future implementation)
   */
  private handleSettings(): void {
    // For now, just set consent to 'settings'
    // In the future, this could open a settings modal
    this.setConsent('settings');
  }

  /**
   * Get current consent value
   */
  public getConsent(): ConsentValue | null {
    try {
      return localStorage.getItem(this.storageKey) as ConsentValue | null;
    } catch (error) {
      console.error('Failed to get consent:', error);
      return null;
    }
  }

  /**
   * Callback for when consent changes
   * Can be overridden or extended for analytics integration
   */
  protected onConsentChange(value: ConsentValue): void {
    console.log('Cookie consent updated:', value);

    // Dispatch custom event
    const event = new CustomEvent('cookieConsentChange', {
      detail: { consent: value },
    });
    document.dispatchEvent(event);
  }

  /**
   * Reset consent (useful for testing or user request)
   */
  public resetConsent(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this.showBanner();
    } catch (error) {
      console.error('Failed to reset consent:', error);
    }
  }
}
