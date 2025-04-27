/**
 * forms.js - Form handling and validation for FoodShare platform
 * Handles form submissions, validation, and error handling
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set up forms with validation
    initFormValidation();
    
    // Setup form tabs navigation if present
    const formTabs = document.querySelector('.form-tabs');
    if (formTabs) {
        initFormNavigation();
    }
});

/**
 * Initializes form validation
 */
function initFormValidation() {
    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Login form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    // NGO signup form
    const ngoSignupForm = document.getElementById('ngo-signup-form');
    if (ngoSignupForm) {
        ngoSignupForm.addEventListener('submit', handleNGOSignup);
    }
    
    // Donor signup form
    const donorSignupForm = document.getElementById('donor-signup-form');
    if (donorSignupForm) {
        donorSignupForm.addEventListener('submit', handleDonorSignup);
    }
}

/**
 * Initializes form tab navigation
 */
function initFormNavigation() {
    // Next buttons
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get current tab and validate it
            const currentTab = button.closest('.tab-content');
            const isValid = validateFormSection(currentTab);
            
            // If valid, proceed to next tab
            if (isValid) {
                const targetTab = button.getAttribute('data-target');
                showTab(targetTab);
            }
        });
    });
    
    // Previous buttons
    const prevButtons = document.querySelectorAll('.prev-btn');
    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-target');
            showTab(targetTab);
        });
    });
    
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            showTab(targetTab);
        });
    });
}

/**
 * Shows a specific tab and hides others
 * @param {string} tabId - The ID of the tab to show
 */
function showTab(tabId) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target tab
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update active state on tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update progress indicators if they exist
    updateFormProgress(tabId);
}

/**
 * Updates the form progress indicators
 * @param {string} currentTabId - The ID of the current active tab
 */
function updateFormProgress(currentTabId) {
    const progressSteps = document.querySelectorAll('.progress-step');
    if (!progressSteps.length) return;
    
    // Get all tab IDs in order
    const tabIds = Array.from(document.querySelectorAll('.tab-content')).map(tab => tab.id);
    const currentIndex = tabIds.indexOf(currentTabId);
    
    // Update each progress step
    progressSteps.forEach((step, index) => {
        if (index <= currentIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

/**
 * Validates a section of a form
 * @param {HTMLElement} section - The form section to validate
 * @return {boolean} - Whether the section is valid
 */
function validateFormSection(section) {
    let isValid = true;
    
    // Get all required inputs in the section
    const requiredInputs = section.querySelectorAll('input[required], select[required], textarea[required]');
    
    // Clear previous error messages
    const errorMessages = section.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    // Validate each required field
    requiredInputs.forEach(input => {
        // Remove any existing error styling
        input.classList.remove('input-error');
        
        if (!input.value.trim()) {
            isValid = false;
            markFieldAsError(input, 'This field is required');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            markFieldAsError(input, 'Please enter a valid email address');
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
            isValid = false;
            markFieldAsError(input, 'Please enter a valid phone number');
        } else if (input.type === 'password' && input.dataset.minlength && input.value.length < parseInt(input.dataset.minlength)) {
            isValid = false;
            markFieldAsError(input, `Password must be at least ${input.dataset.minlength} characters`);
        }
    });
    
    // Check password confirmation if it exists
    const passwordInput = section.querySelector('input[type="password"]');
    const confirmInput = section.querySelector('input[data-confirm-password]');
    if (passwordInput && confirmInput && passwordInput.value !== confirmInput.value) {
        isValid = false;
        markFieldAsError(confirmInput, 'Passwords do not match');
    }
    
    return isValid;
}

/**
 * Mark a form field as having an error
 * @param {HTMLElement} field - The field with the error
 * @param {string} message - The error message to display
 */
function markFieldAsError(field, message) {
    field.classList.add('input-error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @return {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @return {boolean} - Whether the phone number is valid
 */
function validatePhone(phone) {
    // Allow various phone formats with optional country code
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
}

/**
 * Handles the contact form submission
 * @param {Event} e - The form submission event
 */
function handleContactForm(e) {
    e.preventDefault();
    
    // Validate all fields
    const form = e.target;
    const isValid = validateFormSection(form);
    
    if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Your message has been sent successfully. We\'ll get back to you soon!';
            form.prepend(successMessage);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1500);
    }
}

/**
 * Handles the login form submission
 * @param {Event} e - The form submission event
 */
function handleLoginForm(e) {
    e.preventDefault();
    
    // Validate all fields
    const form = e.target;
    const isValid = validateFormSection(form);
    
    if (isValid) {
        // Get form data
        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;
        const remember = form.querySelector('#remember')?.checked || false;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Call to external auth handler (in auth.js)
        if (typeof loginUser === 'function') {
            loginUser(email, password, remember)
                .then(() => {
                    // Login successful - redirect handled by auth.js
                })
                .catch(error => {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message login-error';
                    errorMessage.textContent = error.message || 'Login failed. Please check your credentials.';
                    form.prepend(errorMessage);
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        } else {
            console.error('Login function not found');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

/**
 * Handles the NGO signup form submission
 * @param {Event} e - The form submission event
 */
function handleNGOSignup(e) {
    e.preventDefault();
    
    // Find all tabs if it's a multi-step form
    const tabs = e.target.querySelectorAll('.tab-content');
    let isValid = true;
    
    // Validate all tabs if multi-step form
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            if (!validateFormSection(tab)) {
                isValid = false;
            }
        });
    } else {
        // Single page form validation
        isValid = validateFormSection(e.target);
    }
    
    if (isValid) {
        // Get form data - assuming FormData API for ease
        const formData = new FormData(e.target);
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Call to external auth handler (in auth.js)
        if (typeof registerNGO === 'function') {
            registerNGO(formData)
                .then(() => {
                    // Registration successful - redirect handled by auth.js
                })
                .catch(error => {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message signup-error';
                    errorMessage.textContent = error.message || 'Registration failed. Please try again.';
                    e.target.prepend(errorMessage);
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        } else {
            console.error('NGO registration function not found');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

/**
 * Handles the Donor signup form submission
 * @param {Event} e - The form submission event
 */
function handleDonorSignup(e) {
    e.preventDefault();
    
    // Find all tabs if it's a multi-step form
    const tabs = e.target.querySelectorAll('.tab-content');
    let isValid = true;
    
    // Validate all tabs if multi-step form
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            if (!validateFormSection(tab)) {
                isValid = false;
            }
        });
    } else {
        // Single page form validation
        isValid = validateFormSection(e.target);
    }
    
    if (isValid) {
        // Get form data - assuming FormData API for ease
        const formData = new FormData(e.target);
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Call to external auth handler (in auth.js)
        if (typeof registerDonor === 'function') {
            registerDonor(formData)
                .then(() => {
                    // Registration successful - redirect handled by auth.js
                })
                .catch(error => {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message signup-error';
                    errorMessage.textContent = error.message || 'Registration failed. Please try again.';
                    e.target.prepend(errorMessage);
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        } else {
            console.error('Donor registration function not found');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// Modal form handling
document.addEventListener('DOMContentLoaded', () => {
    // Modal open buttons
    const modalOpenButtons = document.querySelectorAll('[data-modal]');
    modalOpenButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
});

/**
 * Opens a modal by ID
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Set focus on first input if exists
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => {
                firstInput.focus();
            }, 100);
        }
    }
}

/**
 * Closes a modal element
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}