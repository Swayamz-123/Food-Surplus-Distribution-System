/**
 * donor.js - Donor-specific functionality for FoodShare platform
 * Handles donation listings, pickup scheduling, and donor analytics
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize donor-specific components
    initDonorForms();
    initDonationListing();
    
    // Initialize analytics if on donor dashboard
    if (document.querySelector('.donor-analytics')) {
        initDonorAnalytics();
    }
    
    // Initialize pickup scheduling if available
    if (document.querySelector('.pickup-schedule')) {
        initPickupScheduling();
    }
});

/**
 * Initializes all donor-specific forms
 */
function initDonorForms() {
    const donationForm = document.getElementById('donation-form');
    
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(donationForm);
            const donationData = {
                foodType: formData.get('food-type'),
                quantity: formData.get('quantity'),
                quantityUnit: formData.get('quantity-unit'),
                expiryDate: formData.get('expiry-date'),
                pickupWindow: {
                    from: formData.get('pickup-from'),
                    to: formData.get('pickup-to')
                },
                description: formData.get('description'),
                specialInstructions: formData.get('special-instructions'),
                allergens: Array.from(document.querySelectorAll('input[name="allergens"]:checked')).map(el => el.value)
            };
            
            // Submit donation data
            submitDonation(donationData);
        });
    }
    
    // Initialize allergen selector if available
    const allergenSelector = document.querySelector('.allergen-selector');
    if (allergenSelector) {
        initAllergenSelector();
    }
}

/**
 * Initializes allergen multi-select functionality
 */
function initAllergenSelector() {
    const commonAllergens = [
        'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 
        'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
    ];
    
    const allergenContainer = document.querySelector('.allergen-checkboxes');
    
    if (allergenContainer) {
        // Create checkboxes for common allergens
        commonAllergens.forEach(allergen => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'allergen-checkbox';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="allergen-${allergen.toLowerCase().replace(' ', '-')}" 
                       name="allergens" value="${allergen}">
                <label for="allergen-${allergen.toLowerCase().replace(' ', '-')}">${allergen}</label>
            `;
            allergenContainer.appendChild(checkboxDiv);
        });
        
        // Add "Other" option with text input
        const otherDiv = document.createElement('div');
        otherDiv.className = 'allergen-checkbox other';
        otherDiv.innerHTML = `
            <input type="checkbox" id="allergen-other" name="allergens" value="other">
            <label for="allergen-other">Other</label>
            <input type="text" id="other-allergen" name="other-allergen" 
                   placeholder="Please specify" class="hidden">
        `;
        allergenContainer.appendChild(otherDiv);
        
        // Show/hide "Other" text input based on checkbox
        const otherCheckbox = document.getElementById('allergen-other');
        const otherInput = document.getElementById('other-allergen');
        
        if (otherCheckbox && otherInput) {
            otherCheckbox.addEventListener('change', () => {
                otherInput.classList.toggle('hidden', !otherCheckbox.checked);
                if (otherCheckbox.checked) {
                    otherInput.focus();
                }
            });
        }
    }
}

/**
 * Initializes donation listing functionality
 */
function initDonationListing() {
    const donationFilterForm = document.querySelector('.donation-filters form');
    
    if (donationFilterForm) {
        donationFilterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(donationFilterForm);
            const filters = {
                status: formData.get('status'),
                dateFrom: formData.get('date-from'),
                dateTo: formData.get('date-to'),
                foodType: formData.get('food-type')
            };
            
            // Apply filters to donation list
            filterDonations(filters);
        });
    }
    
    // Set up donation action buttons
    setupDonationActions();
}

/**
 * Sets up event handlers for donation action buttons
 */
function setupDonationActions() {
    // Delegation for donation action buttons
    document.addEventListener('click', (e) => {
        // Edit donation details
        if (e.target.closest('.btn-edit-donation')) {
            const donationId = e.target.closest('[data-donation-id]').getAttribute('data-donation-id');
            editDonation(donationId);
        }
        
        // Cancel donation listing
        if (e.target.closest('.btn-cancel-donation')) {
            const donationId = e.target.closest('[data-donation-id]').getAttribute('data-donation-id');
            
            if (confirm('Are you sure you want to cancel this donation?')) {
                cancelDonation(donationId);
            }
        }
        
        // View donation details
        if (e.target.closest('.btn-view-donation')) {
            const donationId = e.target.closest('[data-donation-id]').getAttribute('data-donation-id');
            viewDonationDetails(donationId);
        }
    });
}

/**
 * Submits a new donation to the platform
 * @param {Object} donationData - The donation details
 */
function submitDonation(donationData) {
    // Simulate API call
    console.log('Submitting donation:', donationData);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Show success notification
        showNotification('Your donation has been successfully listed!', 'success');
        
        // Reset form
        document.getElementById('donation-form').reset();
        
        // Redirect to donations list or dashboard
        // window.location.href = 'donor-dashboard.html';
    }, 1000);
}

/**
 * Filters the donation list based on selected criteria
 * @param {Object} filters - The filter criteria
 */
function filterDonations(filters) {
    const donationItems = document.querySelectorAll('.donation-item');
    
    console.log('Filtering donations with:', filters);
    
    // In a real application, this might be an API call or client-side filtering
    // For demo purposes, we'll just log the filters
    
    // Reset filter indicators
    const filterIndicators = document.querySelector('.active-filters');
    if (filterIndicators) {
        filterIndicators.innerHTML = '';
        
        // Add filter pills for active filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                const pill = document.createElement('span');
                pill.className = 'filter-pill';
                pill.innerHTML = `${formatFilterName(key)}: ${value} <button class="remove-filter" data-filter="${key}">&times;</button>`;
                filterIndicators.appendChild(pill);
            }
        });
        
        // Set up removal of filters
        document.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                const filterToRemove = btn.getAttribute('data-filter');
                document.querySelector(`[name="${filterToRemove}"]`).value = '';
                donationFilterForm.dispatchEvent(new Event('submit'));
            });
        });
    }
}

/**
 * Formats a filter key into a readable name
 * @param {string} key - The filter key
 * @return {string} - Formatted filter name
 */
function formatFilterName(key) {
    return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Shows the donation edit form for a specific donation
 * @param {string} donationId - The ID of the donation to edit
 */
function editDonation(donationId) {
    console.log(`Editing donation ${donationId}`);
    
    // In a real application, this would fetch the donation data
    // and populate an edit form
    
    // For demo purposes, show a notification
    showNotification(`Editing donation #${donationId}`, 'info');
}

/**
 * Cancels a donation listing
 * @param {string} donationId - The ID of the donation to cancel
 */
function cancelDonation(donationId) {
    console.log(`Cancelling donation ${donationId}`);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Show success notification
        showNotification(`Donation #${donationId} has been cancelled`, 'success');
        
        // Remove the donation from the list
        const donationElement = document.querySelector(`[data-donation-id="${donationId}"]`);
        if (donationElement) {
            donationElement.classList.add('fade-out');
            setTimeout(() => {
                donationElement.remove();
            }, 300);
        }
    }, 1000);
}

/**
 * Shows detailed information about a donation
 * @param {string} donationId - The ID of the donation to view
 */
function viewDonationDetails(donationId) {
    console.log(`Viewing donation ${donationId}`);
    
    // In a real application, this would fetch the detailed donation data
    // and display it in a modal or detail view
    
    // For demo purposes, show a notification
    showNotification(`Viewing details for donation #${donationId}`, 'info');
}

/**
 * Initializes donor analytics charts and statistics
 */
function initDonorAnalytics() {
    // Implementation would depend on the charting library used
    console.log('Initializing donor analytics');
    
    // Example analytics initialization:
    // - Donation history charts
    // - Impact statistics
    // - Category breakdown
    
    // Mock data for charts (in a real app this would come from API)
    const mockData = {
        donationHistory: [
            { month: 'Jan', count: 3, weight: 45 },
            { month: 'Feb', count: 5, weight: 72 },
            { month: 'Mar', count: 4, weight: 53 },
            { month: 'Apr', count: 7, weight: 98 },
            { month: 'May', count: 6, weight: 80 }
        ],
        impactStats: {
            totalDonations: 25,
            peopleFed: 320,
            foodSaved: 348, // in kg
            co2Reduced: 1240 // in kg
        },
        categoryBreakdown: [
            { category: 'Produce', percentage: 35 },
            { category: 'Prepared Meals', percentage: 25 },
            { category: 'Bakery', percentage: 20 },
            { category: 'Dairy', percentage: 12 },
            { category: 'Other', percentage: 8 }
        ]
    };
    
    // Update impact statistics
    updateImpactStats(mockData.impactStats);
    
    // Render charts (implementation would depend on chart library)
    // renderDonationHistoryChart(mockData.donationHistory);
    // renderCategoryChart(mockData.categoryBreakdown);
}

/**
 * Updates the impact statistics display
 * @param {Object} stats - The impact statistics
 */
function updateImpactStats(stats) {
    // Update stats counters
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(`stat-${key}`);
        if (element) {
            // Animate counter
            animateCounter(element, 0, value);
        }
    });
}

/**
 * Animates a counter from start to end value
 * @param {HTMLElement} element - The element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 */
function animateCounter(element, start, end) {
    const duration = 1000; // ms
    const frameDuration = 16; // ms
    const totalFrames = Math.round(duration / frameDuration);
    const increment = (end - start) / totalFrames;
    
    let currentFrame = 0;
    let currentValue = start;
    
    const animate = () => {
        currentFrame++;
        currentValue += increment;
        
        element.textContent = Math.round(currentValue).toLocaleString();
        
        if (currentFrame < totalFrames) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end.toLocaleString();
        }
    };
    
    animate();
}

/**
 * Initializes pickup scheduling functionality
 */
function initPickupScheduling() {
    const pickupCalendar = document.querySelector('.pickup-calendar');
    
    if (pickupCalendar) {
        // Implementation would depend on calendar library used
        console.log('Initializing pickup scheduling');
        
        // Set up time slot selection
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                // Toggle selection
                if (!slot.classList.contains('unavailable')) {
                    slot.classList.toggle('selected');
                }
            });
        });
        
        // Set up pickup schedule submission
        const scheduleForm = document.getElementById('schedule-form');
        if (scheduleForm) {
            scheduleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Gather selected time slots
                const selectedSlots = Array.from(document.querySelectorAll('.time-slot.selected'))
                    .map(slot => {
                        return {
                            date: slot.getAttribute('data-date'),
                            time: slot.getAttribute('data-time')
                        };
                    });
                
                // Submit schedule
                submitPickupSchedule(selectedSlots);
            });
        }
    }
}

/**
 * Submits a pickup schedule
 * @param {Array} selectedSlots - The selected time slots
 */
function submitPickupSchedule(selectedSlots) {
    console.log('Submitting pickup schedule:', selectedSlots);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Show success notification
        showNotification('Your pickup schedule has been updated', 'success');
    }, 1000);
}