/**
 * distributor.js - Distributor/NGO-specific functionality for FoodShare platform
 * Handles food availability searches, pickup management, and distribution analytics
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize distributor-specific components
    initAvailableFoodSearch();
    initPickupManagement();
    
    // Initialize route planning if on route page
    if (document.querySelector('.route-planning')) {
        initRoutePlanning();
    }
    
    // Initialize analytics if on distributor dashboard
    if (document.querySelector('.distribution-analytics')) {
        initDistributionAnalytics();
    }
    
    // Initialize needs assessment form if available
    if (document.getElementById('needs-assessment-form')) {
        initNeedsAssessment();
    }
});

/**
 * Initializes the food search and filtering functionality
 */
function initAvailableFoodSearch() {
    const searchForm = document.getElementById('food-search-form');
    
    if (searchForm) {
        // Set up search form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(searchForm);
            const searchParams = {
                foodType: formData.get('food-type'),
                distance: formData.get('distance'),
                pickupDate: formData.get('pickup-date'),
                minQuantity: formData.get('min-quantity'),
                excludeAllergens: Array.from(document.querySelectorAll('input[name="exclude-allergens"]:checked')).map(el => el.value)
            };
            
            // Perform search
            searchAvailableFood(searchParams);
        });
        
        // Set up distance range slider if available
        const distanceSlider = document.getElementById('distance-range');
        const distanceValue = document.getElementById('distance-value');
        
        if (distanceSlider && distanceValue) {
            distanceSlider.addEventListener('input', () => {
                distanceValue.textContent = `${distanceSlider.value} km`;
            });
        }
    }
    
    // Set up result item interactions
    setupResultInteractions();
}

/**
 * Sets up the food search result interactions
 */
function setupResultInteractions() {
    // Using event delegation for claim buttons
    document.addEventListener('click', (e) => {
        // Claim food button
        if (e.target.closest('.btn-claim-food')) {
            const listingId = e.target.closest('[data-listing-id]').getAttribute('data-listing-id');
            openClaimModal(listingId);
        }
        
        // View details button
        if (e.target.closest('.btn-view-listing')) {
            const listingId = e.target.closest('[data-listing-id]').getAttribute('data-listing-id');
            viewListingDetails(listingId);
        }
        
        // Contact donor button
        if (e.target.closest('.btn-contact-donor')) {
            const donorId = e.target.closest('[data-donor-id]').getAttribute('data-donor-id');
            contactDonor(donorId);
        }
    });
    
    // Handle claim form submission
    const claimForm = document.getElementById('claim-form');
    if (claimForm) {
        claimForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(claimForm);
            const claimData = {
                listingId: formData.get('listing-id'),
                claimQuantity: formData.get('claim-quantity'),
                pickupTime: formData.get('pickup-time'),
                notes: formData.get('claim-notes')
            };
            
            // Submit claim
            submitClaim(claimData);
        });
    }
}

/**
 * Searches for available food based on search parameters
 * @param {Object} searchParams - The search parameters
 */
function searchAvailableFood(searchParams) {
    console.log('Searching for food with parameters:', searchParams);
    
    // In a real application, this would be an API call
    // For demo purposes, we'll simulate a loading state and results
    
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        // Show loading state
        resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Simulate API delay
        setTimeout(() => {
            // Mock results - in a real app these would come from the API
            const mockResults = [
                {
                    id: 'food-101',
                    donorName: 'Green Bistro',
                    foodType: 'Prepared Meals',
                    quantity: '25 meals',
                    expiryDate: '2025-04-28',
                    pickupWindow: '2pm - 5pm today',
                    distance: '1.2 km',
                    description: 'Assorted vegetarian meals from our lunch service.'
                },
                {
                    id: 'food-102',
                    donorName: 'Fresh Bakery',
                    foodType: 'Bakery',
                    quantity: '40 loaves',
                    expiryDate: '2025-04-29',
                    pickupWindow: '8pm - 9pm today',
                    distance: '3.5 km',
                    description: 'Assorted bread loaves and rolls.'
                },
                {
                    id: 'food-103',
                    donorName: 'Metro Supermarket',
                    foodType: 'Produce',
                    quantity: '80 kg',
                    expiryDate: '2025-04-30',
                    pickupWindow: '10am - 12pm tomorrow',
                    distance: '4.2 km',
                    description: 'Mixed fruits and vegetables in good condition.'
                }
            ];
            
            // Display results
            displaySearchResults(mockResults);
        }, 1500);
    }
}

/**
 * Displays search results in the results container
 * @param {Array} results - The search results to display
 */
function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    
    if (resultsContainer) {
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No matching food donations found</h3>
                    <p>Try adjusting your search criteria or check back later.</p>
                </div>
            `;
            return;
        }
        
        // Clear and populate results
        resultsContainer.innerHTML = '';
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'food-listing';
            resultItem.setAttribute('data-listing-id', result.id);
            
            resultItem.innerHTML = `
                <div class="listing-header">
                    <h3>${result.foodType}</h3>
                    <span class="distance"><i class="fas fa-map-marker-alt"></i> ${result.distance}</span>
                </div>
                <div class="listing-details">
                    <p><strong>Quantity:</strong> ${result.quantity}</p>
                    <p><strong>Expires:</strong> ${result.expiryDate}</p>
                    <p><strong>Pickup:</strong> ${result.pickupWindow}</p>
                    <p><strong>Donor:</strong> ${result.donorName}</p>
                    <p>${result.description}</p>
                </div>
                <div class="listing-actions">
                    <button class="btn btn-primary btn-claim-food">Claim</button>
                    <button class="btn btn-secondary btn-view-listing">Details</button>
                </div>
            `;
            
            resultsContainer.appendChild(resultItem);
        });
    }
}

/**
 * Opens the claim modal for a specific food listing
 * @param {string} listingId - The ID of the food listing
 */
function openClaimModal(listingId) {
    console.log(`Opening claim modal for listing ${listingId}`);
    
    // In a real application, this would fetch the listing details
    // and populate the claim modal
    
    // For demo purposes, show a notification
    showNotification(`Opening claim form for food listing #${listingId}`, 'info');
    
    // Get the claim modal
    const claimModal = document.getElementById('claim-modal');
    if (claimModal) {
        // Set the listing ID in the form
        const listingIdInput = claimModal.querySelector('input[name="listing-id"]');
        if (listingIdInput) {
            listingIdInput.value = listingId;
        }
        
        // Display the modal
        claimModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Shows detailed information about a food listing
 * @param {string} listingId - The ID of the listing to view
 */
function viewListingDetails(listingId) {
    console.log(`Viewing listing ${listingId}`);
    
    // In a real application, this would fetch the detailed listing data
    // and display it in a modal or detail view
    
    // For demo purposes, show a notification
    showNotification(`Viewing details for food listing #${listingId}`, 'info');
}

/**
 * Opens the contact form for a specific donor
 * @param {string} donorId - The ID of the donor to contact
 */
function contactDonor(donorId) {
    console.log(`Contacting donor ${donorId}`);
    
    // In a real application, this would open a messaging interface
    // or contact form
    
    // For demo purposes, show a notification
    showNotification(`Opening messaging with donor #${donorId}`, 'info');
}

/**
 * Submits a claim for a food listing
 * @param {Object} claimData - The claim details
 */
function submitClaim(claimData) {
    console.log('Submitting claim:', claimData);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Close the modal
        const claimModal = document.getElementById('claim-modal');
        if (claimModal) {
            claimModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Show success notification
        showNotification('Your claim has been submitted successfully!', 'success');
        
        // Update the claimed item in the list
        const listingElement = document.querySelector(`[data-listing-id="${claimData.listingId}"]`);
        if (listingElement) {
            listingElement.classList.add('claimed');
            
            const actionButtons = listingElement.querySelector('.listing-actions');
            if (actionButtons) {
                actionButtons.innerHTML = `
                    <button class="btn btn-success disabled">Claimed</button>
                    <button class="btn btn-secondary btn-view-listing">Details</button>
                `;
            }
        }
    }, 1000);
}

/**
 * Initializes pickup management functionality
 */
function initPickupManagement() {
    const pickupList = document.querySelector('.pickup-list');
    
    if (pickupList) {
        // Set up pickup status updates
        document.addEventListener('click', (e) => {
            // Update pickup status
            if (e.target.closest('.btn-update-status')) {
                const pickupId = e.target.closest('[data-pickup-id]').getAttribute('data-pickup-id');
                const statusSelect = e.target.closest('.pickup-item').querySelector('.status-select');
                
                if (statusSelect) {
                    updatePickupStatus(pickupId, statusSelect.value);
                }
            }
            
            // Cancel pickup
            if (e.target.closest('.btn-cancel-pickup')) {
                const pickupId = e.target.closest('[data-pickup-id]').getAttribute('data-pickup-id');
                
                if (confirm('Are you sure you want to cancel this pickup?')) {
                    cancelPickup(pickupId);
                }
            }
            
            // View pickup details
            if (e.target.closest('.btn-view-pickup')) {
                const pickupId = e.target.closest('[data-pickup-id]').getAttribute('data-pickup-id');
                viewPickupDetails(pickupId);
            }
        });
    }
}

/**
 * Updates the status of a pickup
 * @param {string} pickupId - The ID of the pickup
 * @param {string} status - The new status
 */
function updatePickupStatus(pickupId, status) {
    console.log(`Updating pickup ${pickupId} status to ${status}`);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Show success notification
        showNotification(`Pickup #${pickupId} status updated to ${status}`, 'success');
        
        // Update the status in the UI
        const pickupElement = document.querySelector(`[data-pickup-id="${pickupId}"]`);
        if (pickupElement) {
            // Remove old status classes
            ['pending', 'in-progress', 'completed', 'cancelled'].forEach(statusClass => {
                pickupElement.classList.remove(statusClass);
            });
            
            // Add new status class
            pickupElement.classList.add(status.toLowerCase().replace(' ', '-'));
        }
    }, 1000);
}

/**
 * Cancels a scheduled pickup
 * @param {string} pickupId - The ID of the pickup to cancel
 */
function cancelPickup(pickupId) {
    console.log(`Cancelling pickup ${pickupId}`);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Show success notification
        showNotification(`Pickup #${pickupId} has been cancelled`, 'success');
        
        // Update the pickup in the list
        const pickupElement = document.querySelector(`[data-pickup-id="${pickupId}"]`);
        if (pickupElement) {
            // Remove old status classes and add cancelled
            ['pending', 'in-progress', 'completed'].forEach(statusClass => {
                pickupElement.classList.remove(statusClass);
            });
            pickupElement.classList.add('cancelled');
            
            // Update status display
            const statusDisplay = pickupElement.querySelector('.status-value');
            if (statusDisplay) {
                statusDisplay.textContent = 'Cancelled';
            }
        }
    }, 1000);
}

/**
 * Shows detailed information about a pickup
 * @param {string} pickupId - The ID of the pickup to view
 */
function viewPickupDetails(pickupId) {
    console.log(`Viewing pickup ${pickupId}`);
    
    // In a real application, this would fetch the detailed pickup data
    // and display it in a modal or detail view
    
    // For demo purposes, show a notification
    showNotification(`Viewing details for pickup #${pickupId}`, 'info');
}

/**
 * Initializes route planning functionality
 */
function initRoutePlanning() {
    console.log('Initializing route planning');
    
    const optimizeRouteBtn = document.getElementById('optimize-route');
    if (optimizeRouteBtn) {
        optimizeRouteBtn.addEventListener('click', () => {
            optimizePickupRoute();
        });
    }
    
    // Initialize drag and drop for pickup ordering
    const pickupsList = document.querySelector('.pickups-list');
    if (pickupsList) {
        // Implementation would depend on the drag/drop library used
        // Here's a simple example of what might be done
        
        // Make list items sortable
        const listItems = pickupsList.querySelectorAll('.pickup-item');
        listItems.forEach(item => {
            item.setAttribute('draggable', true);
            
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.getAttribute('data-pickup-id'));
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });
        
        // Handle dropping
        pickupsList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(pickupsList, e.clientY);
            const dragging = document.querySelector('.dragging');
            
            if (afterElement == null) {
                pickupsList.appendChild(dragging);
            } else {
                pickupsList.insertBefore(dragging, afterElement);
            }
        });
    }
}

/**
 * Determines the element after which to insert the dragged element
 * @param {HTMLElement} container - The container element
 * @param {number} y - The Y position of the mouse
 * @return {HTMLElement|null} - The element after which to insert the dragged element
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.pickup-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Optimizes the pickup route based on locations
 */
function optimizePickupRoute() {
    console.log('Optimizing pickup route');
    
    // Show loading state
    const routeMap = document.querySelector('.route-map');
    if (routeMap) {
        routeMap.innerHTML = '<div class="loading-spinner"></div>';
    }
    
    // In a real application, this would make an API call to
    // a route optimization service with the pickup locations
    
    // For demo purposes, simulate processing
    setTimeout(() => {
        showNotification('Route optimized successfully!', 'success');
        
        // Update the route map (in a real app this would display the optimized route)
        if (routeMap) {
            routeMap.innerHTML = '<div class="route-visualization"><img src="assets/img/optimized-route.jpg" alt="Optimized Route"></div>';
        }
        
        // Update the pickup list order to match the optimized route
        const pickupsList = document.querySelector('.pickups-list');
        if (pickupsList) {
            // This would reorder the pickups based on the optimized route
            // For demo purposes, we'll just highlight them
            const pickupItems = pickupsList.querySelectorAll('.pickup-item');
            pickupItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('highlight');
                    setTimeout(() => {
                        item.classList.remove('highlight');
                    }, 500);
                }, index * 300);
            });
        }
    }, 2000);
}

/**
 * Initializes distribution analytics functionality
 */
function initDistributionAnalytics() {
    console.log('Initializing distribution analytics');
    
    // Load chart data and initialize charts if available
    loadAnalyticsData();
    
    // Set up filter controls
    const filterForm = document.getElementById('analytics-filters');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get filter values
            const formData = new FormData(filterForm);
            const filterParams = {
                startDate: formData.get('start-date'),
                endDate: formData.get('end-date'),
                foodTypes: Array.from(document.querySelectorAll('input[name="food-type"]:checked')).map(el => el.value),
                groupBy: formData.get('group-by')
            };
            
            // Apply filters
            applyAnalyticsFilters(filterParams);
        });
    }
    
    // Initialize export functionality
    const exportBtn = document.getElementById('export-analytics');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportAnalyticsData();
        });
    }
}

/**
 * Loads analytics data and initializes charts
 */
function loadAnalyticsData() {
    const chartsContainer = document.querySelector('.analytics-charts');
    if (!chartsContainer) return;
    
    // Show loading state
    chartsContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    // In a real application, this would be an API call to fetch analytics data
    // For demo purposes, we'll simulate loading with mock data
    setTimeout(() => {
        // Mock data for charts
        const distributionData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [
                {
                    label: 'Prepared Meals',
                    data: [120, 150, 180, 190, 210]
                },
                {
                    label: 'Produce',
                    data: [85, 100, 95, 130, 140]
                },
                {
                    label: 'Bakery',
                    data: [65, 80, 90, 95, 100]
                },
                {
                    label: 'Dairy',
                    data: [40, 50, 55, 60, 65]
                }
            ]
        };
        
        const impactData = {
            totalMeals: 12500,
            totalWeight: 4800,
            peopleServed: 3200,
            wasteReduction: 76
        };
        
        // Display charts and impact metrics
        displayAnalyticsCharts(distributionData, impactData);
    }, 1500);
}

/**
 * Displays analytics charts and impact metrics
 * @param {Object} distributionData - Data for distribution charts
 * @param {Object} impactData - Data for impact metrics
 */
function displayAnalyticsCharts(distributionData, impactData) {
    const chartsContainer = document.querySelector('.analytics-charts');
    if (!chartsContainer) return;
    
    // Clear container
    chartsContainer.innerHTML = '';
    
    // Create impact metrics
    const impactMetrics = document.createElement('div');
    impactMetrics.className = 'impact-metrics';
    impactMetrics.innerHTML = `
        <div class="metric-card">
            <i class="fas fa-utensils"></i>
            <h3>${impactData.totalMeals.toLocaleString()}</h3>
            <p>Meals Distributed</p>
        </div>
        <div class="metric-card">
            <i class="fas fa-weight"></i>
            <h3>${impactData.totalWeight.toLocaleString()} kg</h3>
            <p>Food Distributed</p>
        </div>
        <div class="metric-card">
            <i class="fas fa-users"></i>
            <h3>${impactData.peopleServed.toLocaleString()}</h3>
            <p>People Served</p>
        </div>
        <div class="metric-card">
            <i class="fas fa-recycle"></i>
            <h3>${impactData.wasteReduction}%</h3>
            <p>Waste Reduction</p>
        </div>
    `;
    chartsContainer.appendChild(impactMetrics);
    
    // Create distribution chart
    const distributionChart = document.createElement('div');
    distributionChart.className = 'chart-container';
    distributionChart.innerHTML = `
        <h3>Food Distribution by Month</h3>
        <div class="chart" id="distribution-chart"></div>
    `;
    chartsContainer.appendChild(distributionChart);
    
    // In a real application, we would initialize actual charts here
    // using a library like Chart.js or D3.js
    console.log('Distribution data for charts:', distributionData);
    
    // Simulate charts with a placeholder
    const chartElement = document.getElementById('distribution-chart');
    if (chartElement) {
        chartElement.innerHTML = `<div class="chart-placeholder">Chart visualization would be shown here</div>`;
    }
}

/**
 * Applies filters to analytics data
 * @param {Object} filterParams - The filter parameters
 */
function applyAnalyticsFilters(filterParams) {
    console.log('Applying analytics filters:', filterParams);
    
    // In a real application, this would reload the data with the filters applied
    // For demo purposes, show loading state and then reload with a notification
    
    const chartsContainer = document.querySelector('.analytics-charts');
    if (chartsContainer) {
        // Show loading state
        chartsContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Simulate API call with filters
        setTimeout(() => {
            loadAnalyticsData();
            showNotification('Analytics filters applied successfully', 'success');
        }, 1000);
    }
}

/**
 * Exports analytics data in selected format
 */
function exportAnalyticsData() {
    console.log('Exporting analytics data');
    
    // For demo purposes, show a notification
    showNotification('Preparing analytics export...', 'info');
    
    // Simulate processing
    setTimeout(() => {
        showNotification('Analytics data exported successfully!', 'success');
    }, 1500);
}

/**
 * Initializes needs assessment form functionality
 */
function initNeedsAssessment() {
    console.log('Initializing needs assessment form');
    
    const needsForm = document.getElementById('needs-assessment-form');
    if (needsForm) {
        needsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(needsForm);
            const needsData = {
                serviceArea: formData.get('service-area'),
                peopleServed: formData.get('people-served'),
                foodTypes: Array.from(document.querySelectorAll('input[name="needed-food-types"]:checked')).map(el => el.value),
                storageCapacity: formData.get('storage-capacity'),
                transportCapacity: formData.get('transport-capacity'),
                additionalNeeds: formData.get('additional-needs')
            };
            
            // Submit needs assessment
            submitNeedsAssessment(needsData);
        });
    }
}

/**
 * Submits needs assessment data
 * @param {Object} needsData - The needs assessment data
 */
function submitNeedsAssessment(needsData) {
    console.log('Submitting needs assessment:', needsData);
    
    // In a real application, this would be an API call
    setTimeout(() => {
        // Show success notification
        showNotification('Your needs assessment has been submitted successfully!', 'success');
        
        // Reset form
        const needsForm = document.getElementById('needs-assessment-form');
        if (needsForm) {
            needsForm.reset();
        }
        
        // Show recommendations if available
        displayNeedsRecommendations();
    }, 1500);
}

/**
 * Displays recommendations based on needs assessment
 */
function displayNeedsRecommendations() {
    console.log('Displaying needs recommendations');
    
    const recommendationContainer = document.querySelector('.needs-recommendations');
    if (recommendationContainer) {
        // Show loading state
        recommendationContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Simulate API response
        setTimeout(() => {
            // Display recommendations
            recommendationContainer.innerHTML = `
                <h3>Based on Your Needs</h3>
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <div class="recommendation-content">
                        <h4>Optimize Pickup Schedule</h4>
                        <p>Based on your storage capacity and people served, we recommend scheduling pickups 3 times per week.</p>
                    </div>
                </div>
                <div class="recommendation">
                    <i class="fas fa-map-marked-alt"></i>
                    <div class="recommendation-content">
                        <h4>Expand Service Range</h4>
                        <p>Consider increasing your pickup radius to 5km to access 40% more potential food sources.</p>
                    </div>
                </div>
                <div class="recommendation">
                    <i class="fas fa-warehouse"></i>
                    <div class="recommendation-content">
                        <h4>Storage Solutions</h4>
                        <p>Your needs would benefit from additional refrigeration capacity. Check our partner program for equipment grants.</p>
                    </div>
                </div>
            `;
        }, 1500);
    }
}

/**
 * Shows a notification to the user
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()} Notification: ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <p>${message}</p>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add to the DOM
    const notificationsContainer = document.querySelector('.notifications-container');
    if (notificationsContainer) {
        notificationsContainer.appendChild(notification);
    } else {
        // Create container if it doesn't exist
        const container = document.createElement('div');
        container.className = 'notifications-container';
        container.appendChild(notification);
        document.body.appendChild(container);
    }
    
    // Set up close button
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Auto-remove after a delay
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}