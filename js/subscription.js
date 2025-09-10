/**
 * Subscription JavaScript file for RaySwap Shop
 * Contains subscription plan management and API integration
 */

// Subscription API Configuration
const SUBSCRIPTION_CONFIG = {
    apiUrl: 'https://api.rayswap.exchange',
    apiKey: 'rsp_live_c39228a93b10dd0db6ec49e9d382beec7bb9a88a3d1fffd86650d247a16df00a',
    businessId: 'b896c184-4bc9-4eff-8475-25ebd62f7d62',
    successUrl: window.location.origin + '/subscription-success.html',
    cancelUrl: window.location.origin + '/subscription-cancel.html'
};

// Subscription Manager
const SubscriptionManager = {
    plans: [],
    currencies: [],
    selectedPlan: null,
    
    /**
     * Initialize the subscription manager
     */
    init: function() {
        console.log('Initializing Subscription Manager');
        this.initializeRaySwapSDK();
        this.bindEvents();
        this.loadSubscriptionPlans();
        this.loadSupportedCurrencies();
    },

    /**
     * Initialize RaySwap SDK for direct payments
     */
    initializeRaySwapSDK: function() {
        if (typeof window.RaySwap !== 'undefined' && !window.RaySwap._initialized) {
            try {
                window.RaySwap.init({
                    apiKey: SUBSCRIPTION_CONFIG.apiKey,
                    businessId: SUBSCRIPTION_CONFIG.businessId,
                    baseUrl: 'https://pay.rayswap.exchange',
                    debug: false
                });
                window.RaySwap._initialized = true;
                console.log('RaySwap SDK initialized for subscriptions');
            } catch (error) {
                console.error('Failed to initialize RaySwap SDK:', error);
            }
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Retry button
        const retryButton = document.getElementById('retryButton');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.loadSubscriptionPlans();
            });
        }

        // Modal close events
        const closeModal = document.getElementById('closeModal');
        const cancelSubscription = document.getElementById('cancelSubscription');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeCheckoutModal());
        }
        
        if (cancelSubscription) {
            cancelSubscription.addEventListener('click', () => this.closeCheckoutModal());
        }

        // Form submission
        const subscriptionForm = document.getElementById('subscriptionForm');
        if (subscriptionForm) {
            subscriptionForm.addEventListener('submit', (e) => this.handleSubscriptionSubmit(e));
        }

        // Modal backdrop click
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeCheckoutModal();
                }
            });
        }
    },

    /**
     * Load subscription plans from API
     */
    loadSubscriptionPlans: async function() {
        try {
            this.showLoadingState();
            
            const response = await fetch(`${SUBSCRIPTION_CONFIG.apiUrl}/api/v1/subscriptions/plans`, {
                method: 'GET',
                headers: {
                    'x-api-key': SUBSCRIPTION_CONFIG.apiKey,
                    'x-business-id': SUBSCRIPTION_CONFIG.businessId,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.plans = data.data || [];
            this.renderSubscriptionPlans();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Error loading subscription plans:', error);
            this.showErrorState('Failed to load subscription plans. Please check your connection and try again.');
        }
    },

    /**
     * Load supported currencies for subscriptions
     */
    loadSupportedCurrencies: async function() {
        try {
            const response = await fetch(`${SUBSCRIPTION_CONFIG.apiUrl}/api/v1/subscription-currencies`, {
                method: 'GET',
                headers: {
                    'x-api-key': SUBSCRIPTION_CONFIG.apiKey,
                    'x-business-id': SUBSCRIPTION_CONFIG.businessId,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currencies = data.data || [];
            this.populateTokenSelect();
            
        } catch (error) {
            console.error('Error loading supported currencies:', error);
            // Continue without currencies - user can still proceed
        }
    },

    /**
     * Populate token select dropdown
     */
    populateTokenSelect: function() {
        const tokenSelect = document.getElementById('tokenId');
        if (!tokenSelect || this.currencies.length === 0) return;

        // Clear existing options except the first one
        tokenSelect.innerHTML = '<option value="">Select payment token...</option>';

        this.currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.id;
            option.textContent = `${currency.ticker} (${currency.name}) - ${currency.network.toUpperCase()}`;
            tokenSelect.appendChild(option);
        });
    },

    /**
     * Show loading state
     */
    showLoadingState: function() {
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('errorState').style.display = 'none';
        document.getElementById('plansSection').style.display = 'none';
    },

    /**
     * Hide loading state
     */
    hideLoadingState: function() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('plansSection').style.display = 'block';
    },

    /**
     * Show error state
     */
    showErrorState: function(message) {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('plansSection').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    },

    /**
     * Render subscription plans
     */
    renderSubscriptionPlans: function() {
        const plansGrid = document.getElementById('plansGrid');
        if (!plansGrid) return;

        plansGrid.innerHTML = '';

        if (this.plans.length === 0) {
            plansGrid.innerHTML = '<div class="no-plans"><p>No subscription plans available at the moment.</p></div>';
            return;
        }

        this.plans.forEach(plan => {
            const planCard = this.createPlanCard(plan);
            plansGrid.appendChild(planCard);
        });
    },

    /**
     * Create a plan card element
     */
    createPlanCard: function(plan) {
        const card = document.createElement('div');
        card.className = 'plan-card';
        
        // Determine if this is a popular plan (you can customize this logic)
        const isPopular = plan.prices && plan.prices.some(price => price.isPopular);
        
        card.innerHTML = `
            ${isPopular ? '<div class="plan-badge">Most Popular</div>' : ''}
            <div class="plan-header">
                <h3 class="plan-name">${plan.name}</h3>
                <p class="plan-description">${plan.description || ''}</p>
            </div>
            <div class="plan-pricing">
                ${this.renderPlanPricing(plan.prices || [])}
            </div>
            <div class="plan-features">
                <h4>Features:</h4>
                <ul>
                    ${(plan.features || []).map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="plan-actions">
                <button class="btn btn-primary select-plan-btn" data-plan-id="${plan.uid}">
                    Select Plan
                </button>
            </div>
        `;

        // Add click event for plan selection
        const selectBtn = card.querySelector('.select-plan-btn');
        selectBtn.addEventListener('click', () => this.selectPlan(plan));

        return card;
    },

    /**
     * Render plan pricing information
     */
    renderPlanPricing: function(prices) {
        if (!prices || prices.length === 0) {
            return '<div class="price">Contact for pricing</div>';
        }

        return prices.map(price => {
            const amount = price.unitAmountHuman || price.unitAmount || 'N/A';
            const currency = price.currency || 'USD';
            const interval = price.recurringInterval || 'month';
            
            return `
                <div class="price">
                    <span class="price-amount">${currency} ${amount}</span>
                    <span class="price-interval">per ${interval}</span>
                </div>
            `;
        }).join('');
    },

    /**
     * Select a subscription plan
     */
    selectPlan: function(plan) {
        this.selectedPlan = plan;
        this.showCheckoutModal();
        this.populateSelectedPlanInfo();
        this.setDefaultFormValues();
    },

    /**
     * Show checkout modal
     */
    showCheckoutModal: function() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * Close checkout modal
     */
    closeCheckoutModal: function() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.selectedPlan = null;
        this.resetForm();
    },

    /**
     * Populate selected plan information in modal
     */
    populateSelectedPlanInfo: function() {
        const planInfo = document.getElementById('selectedPlanInfo');
        if (!planInfo || !this.selectedPlan) return;

        const plan = this.selectedPlan;
        const pricing = this.renderPlanPricing(plan.prices || []);

        planInfo.innerHTML = `
            <div class="selected-plan">
                <h4>${plan.name}</h4>
                <div class="selected-plan-pricing">${pricing}</div>
                <p class="selected-plan-description">${plan.description || ''}</p>
            </div>
        `;
    },

    /**
     * Set default form values
     */
    setDefaultFormValues: function() {
        // Set default dates
        const now = new Date();
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

        const nextDueInput = document.getElementById('nextDue');
        const expiryInput = document.getElementById('expiry');

        if (nextDueInput) {
            nextDueInput.value = this.formatDateTimeLocal(nextMonth);
        }
        
        if (expiryInput) {
            expiryInput.value = this.formatDateTimeLocal(nextYear);
        }

        // Set default amounts based on plan pricing
        if (this.selectedPlan && this.selectedPlan.prices && this.selectedPlan.prices.length > 0) {
            const firstPrice = this.selectedPlan.prices[0];
            const amount = firstPrice.unitAmount || firstPrice.unitAmountHuman || 100;
            
            const capAmountInput = document.getElementById('capAmount');
            const maxPerChargeInput = document.getElementById('maxPerCharge');
            
            if (capAmountInput) {
                capAmountInput.value = amount * 12; // Annual cap
            }
            
            if (maxPerChargeInput) {
                maxPerChargeInput.value = amount;
            }
        }
    },

    /**
     * Format date for datetime-local input
     */
    formatDateTimeLocal: function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    /**
     * Reset form
     */
    resetForm: function() {
        const form = document.getElementById('subscriptionForm');
        if (form) {
            form.reset();
        }
    },

    /**
     * Handle subscription form submission
     */
    handleSubscriptionSubmit: async function(event) {
        event.preventDefault();
        
        if (!this.selectedPlan) {
            alert('No plan selected');
            return;
        }

        try {
            this.setSubmitButtonLoading(true);
            
            // Get form data
            const formData = this.getFormData();
            
            // Validate form data
            if (!this.validateFormData(formData)) {
                this.setSubmitButtonLoading(false);
                return;
            }

            // Create checkout session
            const checkoutSession = await this.createCheckoutSession(formData);
            
            // Confirm checkout session
            const confirmationData = await this.confirmCheckoutSession(checkoutSession.checkoutSession.uid, formData);
            
            // Redirect to approval URL
            if (confirmationData && confirmationData.auth && confirmationData.auth.spender) {
                // In a real implementation, you would handle the EIP712 signing here
                // For now, we'll redirect to the success page
                window.location.href = SUBSCRIPTION_CONFIG.successUrl + '?session=' + checkoutSession.checkoutSession.uid;
            }
            
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to create subscription. Please try again.');
            this.setSubmitButtonLoading(false);
        }
    },

    /**
     * Get form data
     */
    getFormData: function() {
        return {
            email: document.getElementById('customerEmail').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            walletAddress: document.getElementById('walletAddress').value,
            tokenId: document.getElementById('tokenId').value,
            capAmount: document.getElementById('capAmount').value,
            maxPerCharge: document.getElementById('maxPerCharge').value,
            periodSeconds: parseInt(document.getElementById('periodSeconds').value),
            nextDue: new Date(document.getElementById('nextDue').value).getTime() / 1000,
            expiry: new Date(document.getElementById('expiry').value).getTime() / 1000
        };
    },

    /**
     * Validate form data
     */
    validateFormData: function(data) {
        if (!data.email || !data.firstName || !data.lastName) {
            alert('Please fill in all required customer information.');
            return false;
        }
        
        if (!data.walletAddress) {
            alert('Please enter your wallet address.');
            return false;
        }
        
        if (!data.tokenId) {
            alert('Please select a payment token.');
            return false;
        }
        
        if (!data.capAmount || !data.maxPerCharge) {
            alert('Please enter subscription limits.');
            return false;
        }
        
        if (!data.periodSeconds || !data.nextDue || !data.expiry) {
            alert('Please complete the billing schedule.');
            return false;
        }
        
        return true;
    },

    /**
     * Create checkout session
     */
    createCheckoutSession: async function(formData) {
        const priceUid = this.selectedPlan.prices && this.selectedPlan.prices.length > 0 
            ? this.selectedPlan.prices[0].uid 
            : this.selectedPlan.uid;

        const requestBody = {
            priceUid: priceUid,
            customer: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName
            },
            successUrl: SUBSCRIPTION_CONFIG.successUrl,
            cancelUrl: SUBSCRIPTION_CONFIG.cancelUrl
        };

        const response = await fetch(`${SUBSCRIPTION_CONFIG.apiUrl}/api/v1/subscriptions/checkout-sessions`, {
            method: 'POST',
            headers: {
                'x-api-key': SUBSCRIPTION_CONFIG.apiKey,
                'x-business-id': SUBSCRIPTION_CONFIG.businessId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create checkout session');
        }

        return await response.json();
    },

    /**
     * Confirm checkout session
     */
    confirmCheckoutSession: async function(checkoutSessionUid, formData) {
        const requestBody = {
            walletAddress: formData.walletAddress,
            tokenId: formData.tokenId,
            limits: {
                capAmount: formData.capAmount,
                maxPerCharge: formData.maxPerCharge
            },
            schedule: {
                periodSeconds: formData.periodSeconds,
                nextDue: formData.nextDue,
                expiry: formData.expiry
            }
        };

        const response = await fetch(`${SUBSCRIPTION_CONFIG.apiUrl}/api/v1/subscriptions/checkout-sessions/${checkoutSessionUid}/confirm`, {
            method: 'POST',
            headers: {
                'x-api-key': SUBSCRIPTION_CONFIG.apiKey,
                'x-business-id': SUBSCRIPTION_CONFIG.businessId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to confirm checkout session');
        }

        return await response.json();
    },

    /**
     * Set submit button loading state
     */
    setSubmitButtonLoading: function(loading) {
        const submitBtn = document.getElementById('submitSubscription');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.SubscriptionManager = SubscriptionManager;
}