/**
 * Global DOM interactions and event handlers
 * Handles mobile menu, FAQ, and cookie consent functionality
 */

// Type definitions for global functions
declare global {
  interface Window {
    toggleFAQ: (button: HTMLButtonElement) => void;
  }
}

// DOM element type helpers
type ElementWithClasses = HTMLElement & {
  classList: DOMTokenList;
};

/**
 * Mobile menu functionality
 */
function initializeMobileMenu(): void {
  const mobileMenuButton = document.getElementById('mobile-menu-button') as HTMLButtonElement | null;
  const mobileMenuClose = document.getElementById('mobile-menu-close') as HTMLButtonElement | null;
  const mobileMenu = document.getElementById('mobile-menu') as ElementWithClasses | null;

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      mobileMenuButton.setAttribute('aria-expanded', 'true');
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuButton?.setAttribute('aria-expanded', 'false');
    });
  }

  // Close menu when clicking on backdrop
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === mobileMenu || target === mobileMenu.firstElementChild) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton?.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * FAQ toggle functionality
 * @param button - The FAQ button element that was clicked
 */
function toggleFAQ(button: HTMLButtonElement): void {
  const content = button.nextElementSibling as ElementWithClasses | null;
  const arrow = button.querySelector('svg') as SVGElement | null;
  const isExpanded = button.getAttribute('aria-expanded') === 'true';

  if (!content || !arrow) {
    console.warn('FAQ toggle: Missing required elements');
    return;
  }

  if (isExpanded) {
    content.classList.add('hidden');
    arrow.classList.remove('rotate-180');
    button.setAttribute('aria-expanded', 'false');
  } else {
    content.classList.remove('hidden');
    arrow.classList.add('rotate-180');
    button.setAttribute('aria-expanded', 'true');
  }
}

// Make toggleFAQ available globally for inline event handlers
window.toggleFAQ = toggleFAQ;

/**
 * Cookie consent functionality
 */
type ConsentValue = 'accepted' | 'rejected' | 'settings';

function showCookieBanner(): void {
  const banner = document.getElementById('cookie-banner') as HTMLElement | null;
  
  if (banner && !localStorage.getItem('cookieConsent')) {
    // Show banner after a short delay
    setTimeout(() => {
      banner.style.opacity = '1';
      banner.style.transform = 'translateY(0)';
    }, 1000);
  }
}

function hideCookieBanner(): void {
  const banner = document.getElementById('cookie-banner') as HTMLElement | null;
  
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100vh)';
  }
}

function setCookieConsent(value: ConsentValue): void {
  localStorage.setItem('cookieConsent', value);
  hideCookieBanner();
}

/**
 * Initialize cookie consent event listeners
 */
function initializeCookieConsent(): void {
  const acceptBtn = document.getElementById('cookie-accept') as HTMLButtonElement | null;
  const rejectBtn = document.getElementById('cookie-reject') as HTMLButtonElement | null;
  const settingsBtn = document.getElementById('cookie-settings') as HTMLButtonElement | null;

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => setCookieConsent('accepted'));
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => setCookieConsent('rejected'));
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // Cookie settings - placeholder for future implementation
      setCookieConsent('settings');
    });
  }

  // Show banner if consent not given
  showCookieBanner();
}

/**
 * Initialize all DOM interactions when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeMobileMenu();
  initializeCookieConsent();
});

// Export functions for potential external use
export { toggleFAQ, setCookieConsent, showCookieBanner, hideCookieBanner };