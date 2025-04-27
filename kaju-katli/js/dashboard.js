// dashboard.js - Handle dashboard functionality for both donors and distributors
document.addEventListener('DOMContentLoaded', function() {
    // Check which dashboard we're on
    const isDonorDashboard = document.querySelector('.donor-dashboard');
    const isNgoDashboard = document.querySelector('.ngo-dashboard');
    
    if (isDonorDashboard || isNgoDashboard) {
        initializeDashboard();
    }
    
    // Handle dashboard tabs if on preview section of landing page
    const dashboardTabs = document.querySelectorAll('.tab-btn');
    if (dashboardTabs.length > 0) {
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', switchDashboardTab);
        });
    }
});

/**
 * Initialize the dashboard functionality
 */
function initializeDashboard() {
    loadUserProfile();
    initializeSidebar();
    loadDashboardStats();
    initializeNotifications();
    initializeCharts();
    
    // Set up event listeners for dashboard actions
    setupEventListeners();
}

/**
 * Load the user profile data
 */
function loadUserProfile() {
    // In a real application, this would fetch from an API
    const userProfileElement = document.querySelector('.user-profile');
    if (!userProfileElement) return;
    
    // Simulate API data
    const userData = {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        accountType: localStorage.getItem('accountType') || 'donor',
        avatar: localStorage.getItem('userAvatar') || 'assets/img/default-avatar.jpg'
    };
    
    // Update DOM with user data
    if (userProfileElement.querySelector('.profile-name')) {
        userProfileElement.querySelector('.profile-name').textContent = userData.name;
    }
    
    if (userProfileElement.querySelector('.profile-email')) {
        userProfileElement.querySelector('.profile-email').textContent = userData.email;
    }
    
    if (userProfileElement.querySelector('.profile-avatar')) {
        userProfileElement.querySelector('.profile-avatar').src = userData.avatar;
    }
}

/**
 * Initialize the sidebar navigation
 */
function initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.dashboard-content').classList.toggle('expanded');
        });
    }
    
    // Highlight active sidebar item
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function() {
            sidebarLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Load and display dashboard statistics
 */
function loadDashboardStats() {
    const statsContainers = document.querySelectorAll('.stats-card');
    if (statsContainers.length === 0) return;
    
    // Donor dashboard stats (simulated data)
    const donorStats = {
        totalDonations: 28,
        pendingPickups: 3,
        peopleHelped: 420,
        wasteReduced: '625 kg'
    };
    
    // NGO dashboard stats (simulated data)
    const ngoStats = {
        availableDonations: 15,
        scheduledPickups: 4,
        peopleServed: 230,
        foodReceived: '540 kg'
    };
    
    // Determine which stats to use based on the dashboard type
    const isDonorDashboard = document.querySelector('.donor-dashboard');
    const stats = isDonorDashboard ? donorStats : ngoStats;
    
    // Update stats in the DOM
    statsContainers.forEach(container => {
        const statKey = container.dataset.stat;
        if (stats[statKey]) {
            const valueElement = container.querySelector('.stat-value');
            if (valueElement) {
                valueElement.textContent = stats[statKey];
            }
        }
    });
}

/**
 * Initialize the notification system
 */
function initializeNotifications() {
    const notificationBell = document.querySelector('.notification-bell');
    const notificationPanel = document.querySelector('.notification-panel');
    
    if (notificationBell && notificationPanel) {
        notificationBell.addEventListener('click', function(e) {
            e.preventDefault();
            notificationPanel.classList.toggle('show');
            
            // Mark notifications as read when opened
            if (notificationPanel.classList.contains('show')) {
                markNotificationsAsRead();
            }
        });
        
        // Close notifications when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationBell.contains(e.target) && !notificationPanel.contains(e.target)) {
                notificationPanel.classList.remove('show');
            }
        });
        
        // Load notifications
        loadNotifications();
    }
}

/**
 * Load notifications from API (simulated)
 */
function loadNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;
    
    // Simulated notifications data
    const notifications = [
        {
            id: 1,
            type: 'pickup',
            message: 'New pickup request from Community Food Bank',
            time: '10 minutes ago',
            read: false
        },
        {
            id: 2,
            type: 'system',
            message: 'Your account was verified successfully',
            time: '1 hour ago',
            read: false
        },
        {
            id: 3,
            type: 'donation',
            message: 'Your recent donation helped 15 people',
            time: '1 day ago',
            read: true
        }
    ];
    
    // Clear existing notifications
    notificationList.innerHTML = '';
    
    // Add notifications to panel
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        if (!notification.read) {
            notificationItem.classList.add('unread');
        }
        
        notificationItem.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${notification.type === 'pickup' ? 'truck' : notification.type === 'system' ? 'bell' : 'heart'}"></i>
            </div>
            <div class="notification-content">
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        `;
        
        notificationList.appendChild(notificationItem);
    });
    
    // Update notification badge
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
}

/**
 * Mark all notifications as read
 */
function markNotificationsAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });
    
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.classList.remove('show');
    }
}

/**
 * Initialize charts for dashboard
 */
function initializeCharts() {
    // Impact chart
    const impactChart = document.getElementById('impact-chart');
    if (impactChart) {
        const ctx = impactChart.getContext('2d');
        // Simulated data - in a real app, this would come from an API
        renderImpactChart(ctx);
    }
    
    // Donation history chart
    const donationChart = document.getElementById('donation-history');
    if (donationChart) {
        const ctx = donationChart.getContext('2d');
        renderDonationChart(ctx);
    }
    
    // Food distribution chart (for NGOs)
    const distributionChart = document.getElementById('distribution-chart');
    if (distributionChart) {
        const ctx = distributionChart.getContext('2d');
        renderDistributionChart(ctx);
    }
}

/**
 * Render impact chart
 */
function renderImpactChart(ctx) {
    // This is a placeholder. In a real-world scenario, you would use a library like Chart.js
    // Chart.js would be imported in the HTML
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'People Helped',
                    data: [65, 78, 90, 81, 95, 110],
                    borderColor: '#3e95cd',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Impact Over Time'
                }
            }
        });
    } else {
        // Fallback for when Chart.js is not available
        ctx.font = '14px Arial';
        ctx.fillText('Chart.js required to display this chart', 10, 50);
    }
}

/**
 * Render donation history chart
 */
function renderDonationChart(ctx) {
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Food Donated (kg)',
                    data: [12, 19, 3, 5, 15, 22, 8],
                    backgroundColor: '#4CAF50'
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Donation This Week'
                }
            }
        });
    } else {
        ctx.font = '14px Arial';
        ctx.fillText('Chart.js required to display this chart', 10, 50);
    }
}

/**
 * Render food distribution chart for NGOs
 */
function renderDistributionChart(ctx) {
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Bread & Bakery', 'Produce', 'Prepared Meals', 'Dairy', 'Other'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Food Categories Received'
                }
            }
        });
    } else {
        ctx.font = '14px Arial';
        ctx.fillText('Chart.js required to display this chart', 10, 50);
    }
}

/**
 * Handle switching between dashboard tabs in the preview section
 */
function switchDashboardTab(e) {
    e.preventDefault();
    const targetTab = e.target.dataset.tab;
    
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    e.target.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
}

/**
 * Set up event listeners for dashboard actions
 */
function setupEventListeners() {
    // Donation form submission
    const donationForm = document.getElementById('new-donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonationSubmit);
    }
    
    // Availability form for NGOs
    const availabilityForm = document.getElementById('availability-form');
    if (availabilityForm) {
        availabilityForm.addEventListener('submit', handleAvailabilitySubmit);
    }
    
    // Food item reservation buttons
    const reserveButtons = document.querySelectorAll('.reserve-btn');
    reserveButtons.forEach(button => {
        button.addEventListener('click', handleFoodReservation);
    });
    
    // Donation cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-donation');
    cancelButtons.forEach(button => {
        button.addEventListener('click', handleDonationCancel);
    });
    
    // Setup pagination
    setupPagination();
    
    // Setup filter controls
    setupFilters();
}

/**
 * Handle donation form submission
 */
function handleDonationSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const donationData = {
        foodType: formData.get('food-type'),
        quantity: formData.get('quantity'),
        unit: formData.get('unit'),
        expiry: formData.get('expiry'),
        pickupWindow: {
            start: formData.get('pickup-start'),
            end: formData.get('pickup-end')
        },
        notes: formData.get('notes')
    };
    
    // In a real app, you would send this to your backend API
    console.log('Submitting donation:', donationData);
    
    // Simulate successful submission
    showNotification('success', 'Donation posted successfully! Nearby NGOs will be notified.');
    
    // Reset form
    e.target.reset();
    
    // Update dashboard data
    loadDashboardStats();
}

/**
 * Handle availability form submission for NGOs
 */
function handleAvailabilitySubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const availabilityData = {
        days: {
            monday: formData.get('monday') === 'on',
            tuesday: formData.get('tuesday') === 'on',
            wednesday: formData.get('wednesday') === 'on',
            thursday: formData.get('thursday') === 'on',
            friday: formData.get('friday') === 'on',
            saturday: formData.get('saturday') === 'on',
            sunday: formData.get('sunday') === 'on'
        },
        timeWindow: {
            start: formData.get('time-start'),
            end: formData.get('time-end')
        },
        serviceArea: formData.get('service-area'),
        transportCapacity: formData.get('transport-capacity')
    };
    
    // In a real app, you would send this to your backend API
    console.log('Submitting availability:', availabilityData);
    
    // Simulate successful submission
    showNotification('success', 'Availability updated successfully!');
    
    // Update dashboard data
    loadDashboardStats();
}

/**
 * Handle food item reservation
 */
function handleFoodReservation(e) {
    e.preventDefault();
    const donationId = e.target.dataset.id;
    
    // In a real app, you would send a reservation request to your API
    console.log('Reserving donation ID:', donationId);
    
    // Simulate success
    showNotification('success', 'Food item reserved successfully. Contact information has been shared with the donor.');
    
    // Update the UI to reflect the reservation
    e.target.textContent = 'Reserved';
    e.target.classList.remove('btn-primary');
    e.target.classList.add('btn-success');
    e.target.disabled = true;
    
    // Update counts
    loadDashboardStats();
}

/**
 * Handle donation cancellation
 */
function handleDonationCancel(e) {
    e.preventDefault();
    const donationId = e.target.dataset.id;
    
    // Show confirmation dialog
    if (confirm('Are you sure you want to cancel this donation?')) {
        // In a real app, send cancellation request to API
        console.log('Cancelling donation ID:', donationId);
        
        // Remove the donation from the list
        const donationElement = e.target.closest('.donation-item');
        if (donationElement) {
            donationElement.remove();
        }
        
        showNotification('info', 'Donation cancelled successfully.');
        
        // Update stats
        loadDashboardStats();
    }
}

/**
 * Set up pagination controls
 */
function setupPagination() {
    const paginationControls = document.querySelector('.pagination');
    if (!paginationControls) return;
    
    const pageLinks = paginationControls.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all page links
            pageLinks.forEach(pageLink => pageLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // In a real app, this would fetch the next page of data from the API
            // For this example, we'll just simulate a loading state
            const contentArea = document.querySelector('.table-container');
            if (contentArea) {
                contentArea.innerHTML = '<div class="loading">Loading...</div>';
                
                // Simulate loading delay
                setTimeout(() => {
                    loadTableData(parseInt(this.dataset.page));
                }, 500);
            }
        });
    });
}

/**
 * Load table data (simulated)
 */
function loadTableData(page = 1) {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    
    // Different data based on the dashboard type
    const isDonorDashboard = document.querySelector('.donor-dashboard');
    
    // Simulate different data for different pages
    let data;
    
    if (isDonorDashboard) {
        // Donor dashboard - donation history
        data = getDonorTableData(page);
    } else {
        // NGO dashboard - available donations
        data = getNgoTableData(page);
    }
    
    renderTable(tableContainer, data);
}

/**
 * Get data for donor table
 */
function getDonorTableData(page) {
    // Simulated data - in a real app, this would come from an API
    const donorData = [
        {
            id: 101,
            foodType: 'Bakery Products',
            quantity: '5 kg',
            posted: '2025-04-25',
            status: 'Available',
            ngo: '-'
        },
        {
            id: 102,
            foodType: 'Prepared Meals',
            quantity: '12 servings',
            posted: '2025-04-24',
            status: 'Reserved',
            ngo: 'Community Kitchen'
        },
        {
            id: 103,
            foodType: 'Fresh Produce',
            quantity: '8 kg',
            posted: '2025-04-23',
            status: 'Picked Up',
            ngo: 'Food Bank Network'
        },
        {
            id: 104,
            foodType: 'Dairy Products',
            quantity: '3 kg',
            posted: '2025-04-22',
            status: 'Available',
            ngo: '-'
        }
    ];
    
    // Return different subsets based on page
    return donorData.slice((page - 1) * 2, page * 2);
}

/**
 * Get data for NGO table
 */
function getNgoTableData(page) {
    // Simulated data - in a real app, this would come from an API
    const ngoData = [
        {
            id: 201,
            foodType: 'Bakery Products',
            quantity: '10 kg',
            donor: 'Sunshine Bakery',
            location: '2.5 km away',
            pickupWindow: '2-5 PM today'
        },
        {
            id: 202,
            foodType: 'Restaurant Meals',
            quantity: '20 servings',
            donor: 'Green Plate Restaurant',
            location: '4.2 km away',
            pickupWindow: '8-9 PM today'
        },
        {
            id: 203,
            foodType: 'Grocery Items',
            quantity: '15 kg',
            donor: 'Fresh Market',
            location: '1.8 km away',
            pickupWindow: '10-11 AM tomorrow'
        },
        {
            id: 204,
            foodType: 'Canned Goods',
            quantity: '25 units',
            donor: 'Super Store',
            location: '3.0 km away',
            pickupWindow: '3-6 PM tomorrow'
        }
    ];
    
    // Return different subsets based on page
    return ngoData.slice((page - 1) * 2, page * 2);
}

/**
 * Render table with data
 */
function renderTable(container, data) {
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="empty-state">No data available</p>';
        return;
    }
    
    // Create table element
    const table = document.createElement('table');
    table.classList.add('dashboard-table');
    
    // Create table header based on first data item keys
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    Object.keys(data[0]).forEach(key => {
        if (key !== 'id') { // Skip ID column
            const th = document.createElement('th');
            th.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            headerRow.appendChild(th);
        }
    });
    
    // Add actions column
    const actionsHeader = document.createElement('th');
    actionsHeader.textContent = 'Actions';
    headerRow.appendChild(actionsHeader);
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'id') { // Skip ID column
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            }
        });
        
        // Add action buttons
        const actionsTd = document.createElement('td');
        
        // Different actions based on item status
        const isDonorDashboard = document.querySelector('.donor-dashboard');
        
        if (isDonorDashboard) {
            if (item.status === 'Available') {
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'btn btn-sm btn-danger cancel-donation';
                cancelBtn.dataset.id = item.id;
                actionsTd.appendChild(cancelBtn);
            } else {
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'View Details';
                viewBtn.className = 'btn btn-sm btn-info';
                viewBtn.dataset.id = item.id;
                actionsTd.appendChild(viewBtn);
            }
        } else {
            // NGO dashboard actions
            const reserveBtn = document.createElement('button');
            reserveBtn.textContent = 'Reserve';
            reserveBtn.className = 'btn btn-sm btn-primary reserve-btn';
            reserveBtn.dataset.id = item.id;
            actionsTd.appendChild(reserveBtn);
        }
        
        row.appendChild(actionsTd);
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
}

/**
 * Set up filter controls
 */
function setupFilters() {
    const filterForm = document.querySelector('.filter-form');
    if (!filterForm) return;
    
    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get filter values
        const formData = new FormData(e.target);
        const filters = {
            foodType: formData.get('filter-food-type'),
            status: formData.get('filter-status'),
            dateRange: formData.get('filter-date')
        };
        
        // In a real app, this would fetch filtered data from the API
        console.log('Applying filters:', filters);
        
        // Simulate filtering
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.innerHTML = '<div class="loading">Filtering results...</div>';
            
            // Simulate loading delay
            setTimeout(() => {
                loadTableData(1); // Reset to first page with "filtered" data
            }, 500);
        }
    });
    
    // Reset filters button
    const resetButton = filterForm.querySelector('.reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            filterForm.reset();
            
            // Reload data
            const tableContainer = document.querySelector('.table-container');
            if (tableContainer) {
                tableContainer.innerHTML = '<div class="loading">Loading...</div>';
                
                setTimeout(() => {
                    loadTableData(1);
                }, 500);
            }
        });
    }
}

/**
 * Show notification message
 */
function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification-toast', type);
    
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
    
    // Add to page
    const notificationContainer = document.querySelector('.notification-container');
    if (notificationContainer) {
        notificationContainer.appendChild(notification);
    } else {
        // Create container if it doesn't exist
        const container = document.createElement('div');
        container.classList.add('notification-container');
        container.appendChild(notification);
        document.body.appendChild(container);
    }
    
    // Add close button functionality
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// If we're on the dashboard preview section in the landing page
// Initialize tab functionality
window.switchDashboardTab = switchDashboardTab;