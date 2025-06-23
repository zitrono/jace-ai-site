// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  
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
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu || e.target === mobileMenu.firstElementChild) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton?.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// FAQ toggle functionality
window.toggleFAQ = function(button) {
  const content = button.nextElementSibling;
  const arrow = button.querySelector('svg');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    content.classList.add('hidden');
    arrow.classList.remove('rotate-180');
    button.setAttribute('aria-expanded', 'false');
  } else {
    content.classList.remove('hidden');
    arrow.classList.add('rotate-180');
    button.setAttribute('aria-expanded', 'true');
  }
};

// Cookie consent functionality
function showCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner && !localStorage.getItem('cookieConsent')) {
    // Show banner after a short delay
    setTimeout(() => {
      banner.style.opacity = '1';
      banner.style.transform = 'translateY(0)';
    }, 1000);
  }
}

function hideCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100vh)';
  }
}

function setCookieConsent(value) {
  localStorage.setItem('cookieConsent', value);
  hideCookieBanner();
}

// Cookie consent event listeners
document.addEventListener('DOMContentLoaded', () => {
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const settingsBtn = document.getElementById('cookie-settings');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => setCookieConsent('accepted'));
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => setCookieConsent('rejected'));
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      console.log('Cookie settings clicked');
      setCookieConsent('settings');
    });
  }

  // Show banner if consent not given
  showCookieBanner();
});