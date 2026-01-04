// form-handler.js - Form validation and submission handler for VK IT Solutions

class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.addRealTimeValidation();
        }
    }

    // Email validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Phone validation (Indian format)
    validatePhone(phone) {
        const re = /^[6-9]\d{9}$/;
        return re.test(phone.replace(/[\s\-]/g, ''));
    }

    // Name validation
    validateName(name) {
        return name.trim().length >= 2;
    }

    // Message validation
    validateMessage(message) {
        return message.trim().length >= 10;
    }

    // Show error message
    showError(input, message) {
        const formGroup = input.parentElement;
        let errorDiv = formGroup.querySelector('.error-message');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#FF1493';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '0.25rem';
            formGroup.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        input.style.borderColor = '#FF1493';
    }

    // Clear error message
    clearError(input) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');

        if (errorDiv) {
            errorDiv.remove();
        }

        input.style.borderColor = 'rgba(0, 212, 255, 0.3)';
    }

    // Add real-time validation
    addRealTimeValidation() {
        const nameInput = this.form.querySelector('#name');
        const emailInput = this.form.querySelector('#email');
        const phoneInput = this.form.querySelector('#phone');
        const messageInput = this.form.querySelector('#message');

        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                if (!this.validateName(nameInput.value)) {
                    this.showError(nameInput, 'Please enter a valid name (at least 2 characters)');
                } else {
                    this.clearError(nameInput);
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (!this.validateEmail(emailInput.value)) {
                    this.showError(emailInput, 'Please enter a valid email address');
                } else {
                    this.clearError(emailInput);
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                if (phoneInput.value && !this.validatePhone(phoneInput.value)) {
                    this.showError(phoneInput, 'Please enter a valid 10-digit Indian phone number');
                } else {
                    this.clearError(phoneInput);
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', () => {
                if (!this.validateMessage(messageInput.value)) {
                    this.showError(messageInput, 'Message must be at least 10 characters long');
                } else {
                    this.clearError(messageInput);
                }
            });
        }
    }

    // Validate entire form
    validateForm() {
        const nameInput = this.form.querySelector('#name');
        const emailInput = this.form.querySelector('#email');
        const phoneInput = this.form.querySelector('#phone');
        const messageInput = this.form.querySelector('#message');

        let isValid = true;

        // Clear all errors
        [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
            if (input) this.clearError(input);
        });

        // Validate name
        if (!this.validateName(nameInput.value)) {
            this.showError(nameInput, 'Please enter a valid name');
            isValid = false;
        }

        // Validate email
        if (!this.validateEmail(emailInput.value)) {
            this.showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone (if provided)
        if (phoneInput.value && !this.validatePhone(phoneInput.value)) {
            this.showError(phoneInput, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        // Validate message
        if (!this.validateMessage(messageInput.value)) {
            this.showError(messageInput, 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    // Show loading state
    showLoading(button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    // Hide loading state
    hideLoading(button) {
        button.disabled = false;
        button.innerHTML = 'Send Message <i class="fas fa-paper-plane" style="margin-left: 0.5rem;"></i>';
    }

    // Show success message
    showSuccess() {
        // Create success modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 14, 39, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 20, 147, 0.1));
            border: 2px solid rgba(0, 212, 255, 0.5);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            backdrop-filter: blur(10px);
            animation: scaleIn 0.4s ease;
        `;

        modalContent.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--primary-cyan); margin-bottom: 1rem;"></i>
            <h2 style="font-family: 'Orbitron', sans-serif; font-size: 2rem; margin-bottom: 1rem; color: var(--primary-cyan);">
                Message Sent Successfully!
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                Thank you for reaching out to VK IT Solutions. We've received your message and will get back to you within 24 hours.
            </p>
            <button id="closeModal" class="btn btn-primary">
                Close
            </button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Get submit button
        const submitButton = this.form.querySelector('button[type="submit"]');

        // Show loading
        this.showLoading(submitButton);

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Simulate API call (replace with actual API endpoint)
        try {
            // You can replace this with actual API call
            // const response = await fetch('YOUR_API_ENDPOINT', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(data)
            // });

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log data (for development)
            console.log('Form submitted:', data);

            // Hide loading
            this.hideLoading(submitButton);

            // Show success message
            this.showSuccess();

            // Reset form
            this.form.reset();

            // Send email notification (optional - requires backend)
            this.sendEmailNotification(data);

        } catch (error) {
            console.error('Error submitting form:', error);

            // Hide loading
            this.hideLoading(submitButton);

            // Show error message
            alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
        }
    }

    // Send email notification (optional - requires backend)
    async sendEmailNotification(data) {
        // This would typically call your backend API
        // Example using EmailJS or similar service:
        /*
        try {
            await emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                data
            );
        } catch (error) {
            console.error('Error sending email:', error);
        }
        */
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new FormHandler('contactForm');
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}