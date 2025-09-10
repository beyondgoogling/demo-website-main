/**
 * Main JavaScript file for Payment Gateway Demo Website
 * Contains common utilities and shared functionality
 */

// Global configuration
const CONFIG = {
    currency: 'RWF',
    supportEmail: 'support@example.com',
    supportPhone: '+250 123 456 789',
    companyName: 'Payment Gateway Demo',
    rayswap: {
            apiKey: 'rsp_live_c39228a93b10dd0db6ec49e9d382beec7bb9a88a3d1fffd86650d247a16df00a',
            businessId: 'b896c184-4bc9-4eff-8475-25ebd62f7d62',
            baseUrl: 'https://pay.rayswap.exchange'
    }
};

// Utility functions
const Utils = {
    /**
     * Format currency amount
     * @param {number} amount - The amount to format
     * @param {string} currency - Currency code (default: RWF)
     * @returns {string} Formatted currency string
     */
    formatCurrency: function(amount, currency = CONFIG.currency) {
        return `${currency} ${amount.toLocaleString()}`;
    },

    /**
     * Format date for display
     * @param {Date|string} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate: function(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Generate unique transaction ID
     * @returns {string} Transaction ID
     */
    generateTransactionId: function() {
        return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid email
     */
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number (Rwanda format)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid phone
     */
    validatePhone: function(phone) {
        const phoneRegex = /^(\+250|0)?[7][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Show loading state on button
     * @param {HTMLElement} button - Button element
     * @param {string} loadingText - Text to show during loading
     */
    showButtonLoading: function(button, loadingText = 'Loading...') {
        button.dataset.originalText = button.textContent;
        button.textContent = loadingText;
        button.disabled = true;
        button.classList.add('loading');
    },

    /**
     * Hide loading state on button
     * @param {HTMLElement} button - Button element
     */
    hideButtonLoading: function(button) {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
        button.classList.remove('loading');
    },

    /**
     * Smooth scroll to element
     * @param {string} selector - CSS selector of target element
     */
    scrollTo: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Data management functions
const DataManager = {
    /**
     * Save data to localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     * @returns {boolean} Success status
     */
    save: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            return false;
        }
    },

    /**
     * Load data from localStorage with error handling
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Retrieved data or default value
     */
    load: function(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing data from localStorage:', error);
        }
    },

    /**
     * Clear all stored data
     */
    clear: function() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

// Analytics and tracking functions
const Analytics = {
    /**
     * Track page view
     * @param {string} pageName - Name of the page
     */
    trackPageView: function(pageName) {
        console.log(`Page view: ${pageName}`);
        // Here you would integrate with your analytics service
        // Example: gtag('event', 'page_view', { page_title: pageName });
    },

    /**
     * Track user interaction
     * @param {string} action - Action performed
     * @param {string} category - Category of action
     * @param {string} label - Optional label
     */
    trackEvent: function(action, category, label = '') {
        console.log(`Event: ${category} - ${action}${label ? ' - ' + label : ''}`);
        // Here you would integrate with your analytics service
        // Example: gtag('event', action, { event_category: category, event_label: label });
    }
};

// Error handling
const ErrorHandler = {
    /**
     * Log error with context
     * @param {Error|string} error - Error object or message
     * @param {string} context - Context where error occurred
     */
    log: function(error, context = 'Unknown') {
        const errorMessage = error instanceof Error ? error.message : error;
        console.error(`[${context}] Error:`, errorMessage);
        
        // Here you could send errors to a logging service
        // Example: sendToLoggingService({ error: errorMessage, context, timestamp: new Date() });
    },

    /**
     * Show user-friendly error message
     * @param {string} message - Error message to display
     * @param {string} type - Error type (error, warning, info)
     */
    showUserError: function(message, type = 'error') {
        // Log the error for debugging
        console.error('User Error:', message);
        
        // Try to show in a more user-friendly way if possible
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="alert alert-${type}" style="margin: 10px 0; padding: 10px; border-radius: 4px; background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;">
                    <strong>${type === 'error' ? 'Error:' : 'Notice:'}</strong> ${message}
                </div>
            `;
            errorContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback to alert
            alert((type === 'error' ? 'Error: ' : 'Notice: ') + message);
        }
    },
    
    /**
     * Clear any displayed error messages
     */
    clearErrors: function() {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = '';
        }
    }
};

// RaySwap SDK Management
const RaySwapManager = {
    /**
     * Initialize RaySwap SDK
     * @returns {Promise<boolean>} Success status
     */
    initialize: async function() {
        try {
            // Check if RaySwap SDK is available
            if (typeof window.RaySwap === 'undefined') {
                console.error('RaySwap SDK not loaded');
                return false;
            }

            // Check if already initialized
            if (window.RaySwap.isInitialized) {
                console.log('RaySwap SDK already initialized');
                return true;
            }

            // Initialize the SDK
            await window.RaySwap.init({
                baseUrl: CONFIG.rayswap.baseUrl,
                businessId: CONFIG.rayswap.businessId,
                apiKey: CONFIG.rayswap.apiKey
            });

            console.log('RaySwap SDK initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize RaySwap SDK:', error);
            ErrorHandler.log(error, 'RaySwap SDK Initialization');
            return false;
        }
    },

    /**
     * Check if RaySwap SDK is ready
     * @returns {boolean} Ready status
     */
    isReady: function() {
        return typeof window.RaySwap !== 'undefined' && 
               typeof window.RaySwap.init === 'function' && 
               typeof window.RaySwap.openPayment === 'function';
    }
};

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize RaySwap SDK
    RaySwapManager.initialize();
    
    // Track page view
    const pageName = document.title.split(' - ')[0] || 'Unknown Page';
    Analytics.trackPageView(pageName);
    
    // Add click tracking to all buttons
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            Analytics.trackEvent('click', 'button', buttonText);
        });
    });
    
    // Add click tracking to all links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim() || this.href;
            Analytics.trackEvent('click', 'link', linkText);
        });
    });
    
    // Handle back button functionality
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = this.href;
            }
        });
    });
});

// Global error handler
window.addEventListener('error', function(event) {
    ErrorHandler.log(event.error, 'Global Error Handler');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    ErrorHandler.log(event.reason, 'Unhandled Promise Rejection');
    
    // Show user-friendly error for payment-related rejections
    if (event.reason && (event.reason.error === 'payment_failed' || event.reason.message?.includes('payment'))) {
        ErrorHandler.showUserError('Payment processing failed. Please try again.');
    }
});

// Export utilities for use in other scripts
window.PaymentGatewayDemo = {
    Utils,
    DataManager,
    Analytics,
    ErrorHandler,
    RaySwapManager,
    CONFIG
};