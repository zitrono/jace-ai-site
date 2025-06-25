/**
 * @deprecated - Global DOM interactions have been moved to centralized state management
 * This file is preserved for git history and potential future reference
 * DO NOT IMPORT OR USE - Components now use /src/utils/state-manager.ts instead
 * 
 * Legacy Global DOM interactions and event handlers
 * Originally handled mobile menu, FAQ, and cookie consent functionality
 */

// Type definitions for global functions (legacy)
declare global {
  interface Window {
    toggleFAQ: (button: HTMLButtonElement) => void;
  }
}

// Legacy warning message
console.warn('global.ts is deprecated. Components now use centralized state management via state-manager.ts');

// Export empty functions for backward compatibility
export function toggleFAQ(): void {
  console.warn('toggleFAQ from global.ts is deprecated. Use component-specific implementations.');
}

export function setCookieConsent(): void {
  console.warn('setCookieConsent from global.ts is deprecated. Use component-specific implementations.');
}

export function showCookieBanner(): void {
  console.warn('showCookieBanner from global.ts is deprecated. Use component-specific implementations.');
}

export function hideCookieBanner(): void {
  console.warn('hideCookieBanner from global.ts is deprecated. Use component-specific implementations.');
}
