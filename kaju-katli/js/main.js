/**
 * main.js - Common functionality for FoodShare platform
 * Includes UI components, navigation, and shared utilities
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize modals
    initModals();
    
    // Initialize tab navigation
    initTabs();
    
    // Initialize dashboard preview (on homepage)
    const dashboardTabs = document.querySelector('.dashboard-tabs');
    if (dashboardTabs) {
        initDashboardPreview();
    }
    
    // Initialize testimonial slider (on homepage)
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        initTestimonialSlider();
    }
});

/**
 * Initializes the mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

/**
 * Initializes modal functionality
 */
function initModals() {
    // Get all modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Setup modal open triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal') || trigger.getAttribute('href');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Setup modal close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    });
    
    // Close modal when clicking outside content
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle login button
    const loginBtns = document.querySelectorAll('.btn-login');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const loginModal = document.getElementById('login');
            if (loginModal) {
                loginModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

/**
 * Initializes tab functionality for forms and content sections
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabContainer = button.closest('.form-tabs, .dashboard-tabs');
            const tabContentContainer = tabContainer.nextElementSibling;
            
            // Get the target tab content
            const targetTab = button.getAttribute('data-tab');
            
            // Deactivate all tabs and contents
            tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Find all tab content elements
            let tabContents;
            if (tabContentContainer.classList.contains('tab-content')) {
                // For dashboard tabs with direct next element being tab content
                tabContents = document.querySelectorAll('.tab-content');
            } else {
                // For form tabs with separate content divs
                tabContents = document.querySelectorAll(`#${targetTab}, .tab-content`);
            }
            
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Activate the selected tab and content
            button.classList.add('active');
            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
    
    // Handle next/prev buttons in multi-step forms
    const navigationButtons = document.querySelectorAll('.next-btn, .prev-btn');
    navigationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
            if (tabBtn) {
                tabBtn.click();
            }
        });
    });
}

/**
 * Initializes the dashboard preview tabs on homepage
 */
function initDashboardPreview() {
    const tabButtons = document.querySelectorAll('.dashboard-tabs .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.dashboard-content .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Add active class to corresponding content
            const tabId = button.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

/**
 * Initializes testimonial slider on homepage
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    // Show initial testimonial
    showTestimonial(currentIndex);
    
    // Set up dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    
    // Auto rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Show selected testimonial
        testimonials[index].style.display = 'block';
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[index].classList.add('active');
    }
}

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add visibility after a short delay (for animation)
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Set up close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

/**
 * Closes a notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
    notification.classList.remove('visible');
    setTimeout(() => {
        notification.remove();
    }, 300); // Match transition time in CSS
}