/**
 * auth.js - Authentication functionality for FoodShare platform
 * Handles login, signup, validation, and authentication state
 */

// Store the current user state
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    
    // Set up login form listeners if present
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Set up logout functionality if user is logged in
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

/**
 * Checks the current authentication state
 * Uses localStorage to persist login status
 */
function checkAuthState() {
    const savedUser = localStorage.getItem('foodshare_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
}

/**
 * Updates the UI for a logged-in user
 */
function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const userMenu = document.querySelector('.user-menu');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    
    // Update user name if element exists
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name || currentUser.email;
    }
}

/**
 * Updates the UI for a logged-out user
 */
function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const userMenu = document.querySelector('.user-menu');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (signupBtn) signupBtn.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
}

/**
 * Handles login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Simple validation
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    // In a real app, you would send these credentials to your backend
    // For demo, we'll simulate a successful login
    loginUser({ email, name: email.split('@')[0] }, rememberMe);
    
    // Close modal if it exists
    const modal = document.getElementById('login');
    if (modal) modal.style.display = 'none';
}

/**
 * Logs in a user and updates the UI
 * @param {Object} user - User data
 * @param {boolean} remember - Whether to remember the login
 */
function loginUser(user, remember = false) {
    currentUser = user;
    
    if (remember) {
        localStorage.setItem('foodshare_user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('foodshare_user', JSON.stringify(user));
    }
    
    updateUIForLoggedInUser();
    
    // Redirect to appropriate dashboard
    const userType = user.type || 'donor'; // Default to donor if not specified
    if (userType === 'donor') {
        window.location.href = '/pages/donor-dashboard.html';
    } else {
        window.location.href = '/pages/ngo-dashboard.html';
    }
}

/**
 * Handles user logout
 */
function handleLogout() {
    localStorage.removeItem('foodshare_user');
    sessionStorage.removeItem('foodshare_user');
    currentUser = null;
    updateUIForLoggedOutUser();
    
    // Redirect to home page
    window.location.href = '/index.html';
}

/**
 * Displays an error message
 * @param {string} message - Error message to display
 * @param {string} elementId - ID of element to display error in
 */
function showError(message, elementId = null) {
    if (elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    } else {
        alert(message); // Fallback to alert if no element specified
    }
}

/**
 * Validates an email address format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} Whether password meets requirements
 */
function validatePassword(password) {
    // At least 8 characters, with at least one uppercase, one lowercase, and one number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

/**
 * Redirects to appropriate dashboard based on user type
 */
function redirectToDashboard() {
    if (!currentUser) return;
    
    const userType = currentUser.type || 'donor';
    if (userType === 'donor') {
        window.location.href = '/pages/donor-dashboard.html';
    } else {
        window.location.href = '/pages/ngo-dashboard.html';
    }
}