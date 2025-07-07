/**
 * Shared authentication form logic
 * Handles form validation, submission, loading states, and error handling
 */

export interface AuthFormElements {
  form: HTMLFormElement;
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  togglePasswordBtn: HTMLButtonElement;
  eyeIcon: SVGElement;
  errorMessage: HTMLElement;
  errorText: HTMLElement;
  loginButton: HTMLButtonElement;
  loginButtonText: HTMLElement;
  loginSpinner: HTMLElement;
  rememberMeCheckbox?: HTMLInputElement;
}

export class AuthFormHandler {
  private elements: AuthFormElements;
  private isSubmitting = false;

  constructor(elements: AuthFormElements) {
    this.elements = elements;
    this.setupEventListeners();
    this.injectStyles();
  }

  private injectStyles(): void {
    // Check if styles already exist
    if (!document.getElementById('auth-form-styles')) {
      const style = document.createElement('style');
      style.id = 'auth-form-styles';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private setupEventListeners(): void {
    // Password visibility toggle
    this.elements.togglePasswordBtn?.addEventListener('click', () => {
      this.togglePasswordVisibility();
    });

    // Hide error message when user starts typing
    [this.elements.usernameInput, this.elements.passwordInput].forEach((input) => {
      input?.addEventListener('input', () => {
        this.hideError();
      });
    });

    // Form submission
    this.elements.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  private togglePasswordVisibility(): void {
    const isPassword = this.elements.passwordInput.type === 'password';
    this.elements.passwordInput.type = isPassword ? 'text' : 'password';

    // Update eye icon
    this.elements.eyeIcon.innerHTML = isPassword
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
  }

  private showError(message: string): void {
    this.elements.errorText.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');
  }

  private hideError(): void {
    if (!this.elements.errorMessage.classList.contains('hidden')) {
      this.elements.errorMessage.classList.add('hidden');
    }
  }

  private setLoadingState(loading: boolean): void {
    this.isSubmitting = loading;

    if (loading) {
      this.elements.loginButton.disabled = true;
      this.elements.loginButtonText.classList.add('opacity-0');
      this.elements.loginSpinner.classList.remove('hidden');
    } else {
      this.elements.loginButton.disabled = false;
      this.elements.loginButtonText.classList.remove('opacity-0');
      this.elements.loginSpinner.classList.add('hidden');
    }
  }

  private async handleSubmit(): Promise<void> {
    if (this.isSubmitting) return;

    const username = this.elements.usernameInput.value.trim();
    const password = this.elements.passwordInput.value;

    // Basic validation
    if (!username || !password) {
      this.showError('Please enter both username and password.');
      return;
    }

    // Show loading state
    this.setLoadingState(true);

    try {
      // Simulate authentication with delay (1.5-2.5 seconds)
      const delay = Math.random() * 1000 + 1500;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Always return authentication error for demo purposes
      throw new Error('Invalid username or password. Please check your credentials and try again.');
    } catch (error) {
      // Show error
      this.showError((error as Error).message || 'Invalid username or password. Please try again.');

      // Hide loading state
      this.setLoadingState(false);

      // Shake animation on button
      this.elements.loginButton.classList.add('animate-shake');
      setTimeout(() => {
        this.elements.loginButton.classList.remove('animate-shake');
      }, 500);
    }
  }

  // Public methods for external control
  public reset(): void {
    this.elements.form.reset();
    this.hideError();
    this.setLoadingState(false);
  }

  public focus(): void {
    this.elements.usernameInput?.focus();
  }
}
