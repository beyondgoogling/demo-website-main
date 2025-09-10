/**
 * Payment JavaScript file for Payment Gateway Demo Website
 * Contains payment processing logic and SDK integration points
 */

// Payment Gateway SDK Integration
const PaymentGatewaySDK = {
    // SDK Configuration
    config: {
        apiUrl: 'https://api.your-payment-gateway.com',
        publicKey: 'pk_test_your_public_key_here',
        environment: 'sandbox', // 'sandbox' or 'production'
        supportedMethods: ['mobile-money', 'bank-transfer', 'card', 'rayswap'],
        currency: 'RWF',
        // RaySwap configuration
        rayswap: {
            apiKey: 'rsp_live_c39228a93b10dd0db6ec49e9d382beec7bb9a88a3d1fffd86650d247a16df00a',
            businessId: 'b896c184-4bc9-4eff-8475-25ebd62f7d62',
            baseUrl: 'https://pay.rayswap.exchange'
        }
    },

    /**
     * Initialize the payment gateway SDK
     * @param {Object} options - Configuration options
     */
    init: function(options = {}) {
        this.config = { ...this.config, ...options };
        console.log('Payment Gateway SDK initialized with config:', this.config);
        
        // Load and initialize RaySwap SDK
        this.loadSDKScript().catch(error => {
            console.error('Failed to load RaySwap SDK:', error);
        });
        
        return this;
    },

    /**
     * Load RaySwap SDK script dynamically
     */
    loadSDKScript: function() {
        return new Promise((resolve, reject) => {
            console.log('Loading RaySwap SDK...');
            
            // Check if RaySwap SDK is already loaded
            if (typeof window.RaySwap !== 'undefined') {
                console.log('RaySwap SDK already loaded');
                this.initializeRaySwapSDK();
                resolve();
                return;
            }
            
            // Create script element to load RaySwap SDK
            const script = document.createElement('script');
            script.src = 'https://pay.rayswap.exchange/rayswap-sdk.js';
            script.async = true;
            
            script.onload = () => {
                console.log('RaySwap SDK loaded successfully');
                this.initializeRaySwapSDK();
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('Failed to load RaySwap SDK:', error);
                reject(new Error('Failed to load RaySwap SDK'));
            };
            
            // Append script to document head
            document.head.appendChild(script);
        });
    },

    /**
     * Initialize RaySwap SDK with configuration
     */
    initializeRaySwapSDK: function() {
        if (typeof window.RaySwap !== 'undefined') {
            try {
                window.RaySwap.init({
                    apiKey: this.config.rayswap.apiKey,
                    businessId: this.config.rayswap.businessId,
                    baseUrl: this.config.rayswap.baseUrl,
                    debug: this.config.environment === 'sandbox'
                });
                console.log('RaySwap SDK initialized successfully');
                
                // Test connection after initialization
                this.testSDKConnection();
            } catch (error) {
                console.error('Failed to initialize RaySwap SDK:', error);
                throw error;
            }
        } else {
            throw new Error('RaySwap SDK not available');
        }
    },

    /**
     * Test SDK connection and credentials
     */
    testSDKConnection: function() {
        console.log('🔍 Testing RaySwap SDK Connection...');
        console.log('📋 Configuration:');
        console.log('  - API Key:', this.config.rayswap.apiKey ? this.config.rayswap.apiKey.substring(0, 20) + '...' : 'Not set');
        console.log('  - Business ID:', this.config.rayswap.businessId || 'Not set');
        console.log('  - Base URL:', this.config.rayswap.baseUrl || 'Not set');
        console.log('  - Environment:', this.config.environment);
        
        // Check if RaySwap object is available
        if (typeof window.RaySwap !== 'undefined') {
            console.log('✅ RaySwap SDK loaded successfully');
            
            // Check if SDK has required methods
            const requiredMethods = ['init', 'openPayment'];
            const availableMethods = requiredMethods.filter(method => typeof window.RaySwap[method] === 'function');
            
            console.log('📦 Available SDK methods:', availableMethods);
            
            if (availableMethods.length === requiredMethods.length) {
                console.log('✅ All required SDK methods are available');
            } else {
                console.warn('⚠️ Some SDK methods are missing:', requiredMethods.filter(m => !availableMethods.includes(m)));
            }
            
            // Test basic SDK functionality
            try {
                if (typeof window.RaySwap.getVersion === 'function') {
                    console.log('📦 SDK Version:', window.RaySwap.getVersion());
                }
                
                if (typeof window.RaySwap.isReady === 'function') {
                    console.log('🔄 SDK Ready Status:', window.RaySwap.isReady());
                }
                
                console.log('✅ SDK Connection Test Completed Successfully');
            } catch (error) {
                console.error('❌ SDK Connection Test Failed:', error);
            }
        } else {
            console.error('❌ RaySwap SDK not loaded');
        }
    },

    /**
     * Create payment session
     * @param {Object} paymentData - Payment information
     * @returns {Promise} Payment session promise
     */
    createPaymentSession: function(paymentData) {
        return new Promise((resolve, reject) => {
            console.log('Creating payment session with data:', paymentData);
            
            // Simulate API call to create payment session
            setTimeout(() => {
                const sessionData = {
                    sessionId: 'sess_' + Date.now(),
                    paymentUrl: 'https://checkout.your-payment-gateway.com/pay/' + Date.now(),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
                    status: 'pending'
                };
                
                console.log('Payment session created:', sessionData);
                resolve(sessionData);
            }, 1500);
        });
    },

    /**
     * Process RaySwap payment
     * @param {Object} paymentData - Payment data including amount, currency, customer info
     * @param {Object} callbacks - Success, cancel, and error callbacks
     * @param {Object} options - Additional options like theme
     * @returns {Promise} Payment result promise
     */
    processRaySwapPayment: function(paymentData, callbacks = {}, options = {}) {
        return new Promise((resolve, reject) => {
            if (typeof window.RaySwap === 'undefined') {
                const error = new Error('RaySwap SDK not loaded');
                console.error(error.message);
                if (callbacks.onError) callbacks.onError(error);
                reject(error);
                return;
            }

            try {
                // Set default options
                const defaultOptions = {
                    theme: 'light'
                };
                const finalOptions = { ...defaultOptions, ...options };

                // Set default callbacks
                const defaultCallbacks = {
                    onSuccess: (sessionId) => {
                        console.log('RaySwap payment successful:', sessionId);
                        resolve(sessionId);
                    },
                    onCancel: () => {
                        console.log('RaySwap payment cancelled');
                        resolve(null);
                    },
                    onError: (error) => {
                        console.error('RaySwap payment error:', error);
                        reject(error);
                    }
                };
                const finalCallbacks = { ...defaultCallbacks, ...callbacks };

                // Open RaySwap payment modal
                window.RaySwap.openPayment(paymentData, finalCallbacks, finalOptions);
            } catch (error) {
                console.error('Error opening RaySwap payment:', error);
                if (callbacks.onError) callbacks.onError(error);
                reject(error);
            }
        });
    },

    /**
     * Process payment with selected method
     * @param {string} method - Payment method
     * @param {Object} paymentDetails - Payment details
     * @returns {Promise} Payment result promise
     */
    processPayment: function(method, paymentDetails) {
        return new Promise((resolve, reject) => {
            console.log(`Processing ${method} payment:`, paymentDetails);
            
            try {
                if (method === 'rayswap') {
                    return this.processRaySwapPayment(paymentDetails).then(resolve).catch(reject);
                }
            
            // Simulate payment processing based on method
            const processingTime = this.getProcessingTime(method);
            
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                const isSuccess = Math.random() > 0.1;
                
                if (isSuccess) {
                    const result = {
                        success: true,
                        transactionId: PaymentGatewayDemo.Utils.generateTransactionId(),
                        method: method,
                        amount: paymentDetails.amount,
                        currency: paymentDetails.currency,
                        status: 'completed',
                        timestamp: new Date().toISOString(),
                        reference: 'REF-' + Date.now()
                    };
                    
                    console.log('Payment successful:', result);
                    resolve(result);
                } else {
                    const error = {
                        success: false,
                        error: 'payment_failed',
                        message: 'Payment could not be processed. Please try again.',
                        code: 'E001'
                    };
                    
                    console.log('Payment failed:', error);
                    reject(error);
                }
            }, processingTime);
            } catch (error) {
                console.error('Unexpected error in processPayment:', error);
                reject({
                    success: false,
                    error: 'unexpected_error',
                    message: 'An unexpected error occurred during payment processing',
                    code: 'E005',
                    originalError: error.message
                });
            }
        });
    },

    /**
     * Process RaySwap cryptocurrency payment
     * @param {Object} paymentDetails - Payment details
     * @returns {Promise} Payment result promise
     */
    processRaySwapPayment: function(paymentDetails) {
        return new Promise((resolve, reject) => {
            if (typeof RaySwap === 'undefined') {
                reject({
                    success: false,
                    error: 'rayswap_unavailable',
                    message: 'RaySwap SDK not loaded',
                    code: 'E002'
                });
                return;
            }

            const paymentData = {
                amount: paymentDetails.amount,
                currency: paymentDetails.currency || 'RWF',
                description: paymentDetails.product?.name || 'Premium Software License',
                customerEmail: paymentDetails.email,
                customerName: paymentDetails.name,
                redirectUrl: window.location.origin + '/thankyou.html'
            };

            console.log('PaymentData being passed to RaySwap.openPayment():', paymentData);

            RaySwap.openPayment(
                paymentData,
                {
                    onSuccess: (sessionId) => {
                        console.log('RaySwap payment successful. Session:', sessionId);
                        resolve({
                            success: true,
                            transactionId: sessionId || 'RAYSWAP_' + Date.now(),
                            method: 'rayswap',
                            amount: paymentDetails.amount,
                            currency: paymentDetails.currency || 'RWF',
                            status: 'completed',
                            timestamp: new Date().toISOString(),
                            reference: 'RAYSWAP-' + Date.now()
                        });
                    },
                    onCancel: () => {
                        console.log('RaySwap payment cancelled');
                        reject({
                            success: false,
                            error: 'payment_cancelled',
                            message: 'Payment was cancelled by user',
                            code: 'E003'
                        });
                    },
                    onError: (error) => {
                        console.error('RaySwap payment error:', error);
                        reject({
                            success: false,
                            error: 'rayswap_error',
                            message: error?.message || 'Cryptocurrency payment failed. Please try again.',
                            code: 'E004'
                        });
                    }
                },
                {
                    theme: 'light'
                }
            );
        });
    },

    /**
     * Get processing time based on payment method
     * @param {string} method - Payment method
     * @returns {number} Processing time in milliseconds
     */
    getProcessingTime: function(method) {
        const times = {
            'mobile-money': 3000,
            'bank-transfer': 5000,
            'card': 2000
        };
        return times[method] || 3000;
    },

    /**
     * Verify payment status
     * @param {string} transactionId - Transaction ID to verify
     * @returns {Promise} Verification result
     */
    verifyPayment: function(transactionId) {
        return new Promise((resolve) => {
            console.log('Verifying payment:', transactionId);
            
            setTimeout(() => {
                const result = {
                    transactionId: transactionId,
                    status: 'completed',
                    verified: true,
                    timestamp: new Date().toISOString()
                };
                
                console.log('Payment verified:', result);
                resolve(result);
            }, 1000);
        });
    }
};

// Payment Form Handler
const PaymentFormHandler = {
    /**
     * Initialize payment form
     */
    init: function() {
        this.bindEvents();
        this.loadPaymentMethods();
    },

    /**
     * Bind form events
     */
    bindEvents: function() {
        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', this.onPaymentMethodChange.bind(this));
        });

        // Form submission
        const proceedBtn = document.getElementById('proceedPaymentBtn');
        if (proceedBtn && !window.RAYSWAP_INLINE_CHECKOUT) {
            proceedBtn.addEventListener('click', this.onProceedPayment.bind(this));
        }
    },

    /**
     * Handle payment method change
     * @param {Event} event - Change event
     */
    onPaymentMethodChange: function(event) {
        const selectedMethod = event.target.value;
        console.log('Payment method selected:', selectedMethod);
        
        // Show/hide relevant form fields
        this.showPaymentForm(selectedMethod);
        
        // Track selection
        PaymentGatewayDemo.Analytics.trackEvent('select', 'payment_method', selectedMethod);
    },

    /**
     * Show payment form for selected method
     * @param {string} method - Selected payment method
     */
    showPaymentForm: function(method) {
        const formContainer = document.getElementById('payment-form-container');
        const sdkIntegrationPoint = document.getElementById('sdk-integration-point');
        
        if (!formContainer || !sdkIntegrationPoint) return;
        
        // Show form container
        formContainer.style.display = 'block';
        
        // Generate form based on method
        let formHTML = '';
        
        switch (method) {
            case 'mobile-money':
                formHTML = this.generateMobileMoneyForm();
                break;
            case 'bank-transfer':
                formHTML = this.generateBankTransferForm();
                break;
            case 'card':
                formHTML = this.generateCardForm();
                break;
            case 'rayswap':
                formHTML = this.generateRaySwapForm();
                break;
            default:
                formHTML = '<p>Please select a payment method.</p>';
        }
        
        sdkIntegrationPoint.innerHTML = formHTML;
        
        // Initialize form validation
        this.initializeFormValidation();
    },

    /**
     * Generate mobile money form
     * @returns {string} Form HTML
     */
    generateMobileMoneyForm: function() {
        return `
            <div class="payment-form-fields">
                <div class="form-group">
                    <label for="momo-provider">Mobile Money Provider</label>
                    <select id="momo-provider" required>
                        <option value="">Select Provider</option>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="airtel">Airtel Money</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="momo-phone">Phone Number</label>
                    <input type="tel" id="momo-phone" placeholder="07XXXXXXXX" required>
                </div>
                <div class="sdk-note">
                    <p>📱 You will receive a prompt on your phone to complete the payment</p>
                </div>
            </div>
        `;
    },

    /**
     * Generate bank transfer form
     * @returns {string} Form HTML
     */
    generateBankTransferForm: function() {
        return `
            <div class="payment-form-fields">
                <div class="form-group">
                    <label for="bank-name">Bank Name</label>
                    <select id="bank-name" required>
                        <option value="">Select Bank</option>
                        <option value="bnr">Bank of Kigali</option>
                        <option value="equity">Equity Bank</option>
                        <option value="cogebanque">Cogebanque</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="account-number">Account Number</label>
                    <input type="text" id="account-number" placeholder="Enter account number" required>
                </div>
                <div class="sdk-note">
                    <p>🏦 Bank transfer instructions will be provided after confirmation</p>
                </div>
            </div>
        `;
    },

    /**
     * Generate card payment form
     * @returns {string} Form HTML
     */
    generateCardForm: function() {
        return `
            <div class="payment-form-fields">
                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="card-expiry">Expiry Date</label>
                        <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label for="card-cvv">CVV</label>
                        <input type="text" id="card-cvv" placeholder="123" maxlength="4" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="card-name">Cardholder Name</label>
                    <input type="text" id="card-name" placeholder="John Doe" required>
                </div>
                <div class="sdk-note">
                    <p>💳 Your card information is secure and encrypted</p>
                </div>
            </div>
        `;
    },

    /**
     * Generate RaySwap cryptocurrency payment form
     * @returns {string} Form HTML
     */
    generateRaySwapForm: function() {
        const productData = PaymentGatewayDemo.DataManager.load('selectedProduct', {});
        const amountRWF = productData.price || 4000;
        
        return `
            <div class="payment-form-fields">
                <div class="form-group">
                    <label for="customer-email">Email Address</label>
                    <input type="email" id="customer-email" placeholder="your@email.com" required>
                </div>
                <div class="form-group">
                    <label for="customer-name">Full Name</label>
                    <input type="text" id="customer-name" placeholder="John Doe" required>
                </div>
                <div class="payment-summary">
                    <div class="amount-conversion">
                        <p><strong>Amount:</strong> ${amountRWF.toLocaleString()} RWF</p>
                    </div>
                </div>
                <div class="sdk-note">
                    <p>🔐 Secure cryptocurrency payment via RaySwap</p>
                    <p style="font-size: 14px; color: #6b7280;">Supports Bitcoin, Ethereum, USDT and other major cryptocurrencies</p>
                </div>
            </div>
        `;
    },

    /**
     * Initialize form validation
     */
    initializeFormValidation: function() {
        // Card number formatting
        const cardNumber = document.getElementById('card-number');
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Expiry date formatting
        const cardExpiry = document.getElementById('card-expiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Phone number validation
        const momoPhone = document.getElementById('momo-phone');
        if (momoPhone) {
            momoPhone.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value;
            });
        }
    },

    /**
     * Handle proceed payment button click
     * @param {Event} event - Click event
     */
    onProceedPayment: function(event) {
        event.preventDefault();
        
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        // Validate form
        const validation = this.validateForm(selectedMethod.value);
        if (!validation.isValid) {
            return;
        }

        // Get payment data
        const paymentData = this.collectPaymentData(selectedMethod.value);
        
        // Process payment
        this.processPayment(selectedMethod.value, paymentData);
    },

    /**
     * Validate form based on payment method
     * @param {string} method - Payment method
     * @returns {Object} Validation result
     */
    validateForm: function(method) {
        const errors = [];
        
        switch (method) {
            case 'mobile-money':
                const phoneNumber = document.getElementById('momo-phone')?.value;
                const provider = document.getElementById('momo-provider')?.value;
                
                if (!phoneNumber || phoneNumber.length < 10) {
                    errors.push('Please enter a valid phone number');
                }
                if (!provider) {
                    errors.push('Please select a mobile money provider');
                }
                break;
                
            case 'bank-transfer':
                const accountNumber = document.getElementById('account-number')?.value;
                const bankName = document.getElementById('bank-name')?.value;
                
                if (!accountNumber || accountNumber.length < 8) {
                    errors.push('Please enter a valid account number');
                }
                if (!bankName) {
                    errors.push('Please select a bank');
                }
                break;
                
            case 'card':
                const cardNumber = document.getElementById('card-number')?.value;
                const expiryDate = document.getElementById('card-expiry')?.value;
                const cvv = document.getElementById('card-cvv')?.value;
                const cardName = document.getElementById('card-name')?.value;
                
                if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
                    errors.push('Please enter a valid card number');
                }
                if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
                    errors.push('Please enter a valid expiry date (MM/YY)');
                }
                if (!cvv || cvv.length < 3) {
                    errors.push('Please enter a valid CVV');
                }
                if (!cardName || cardName.length < 2) {
                    errors.push('Please enter the cardholder name');
                }
                break;
                
            case 'rayswap':
                const email = document.getElementById('customer-email')?.value;
                const name = document.getElementById('customer-name')?.value;
                
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    errors.push('Please enter a valid email address');
                }
                if (!name || name.length < 2) {
                    errors.push('Please enter your full name');
                }
                break;
        }
        
        if (errors.length > 0) {
            alert(errors.join('\n'));
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Collect payment data from form
     * @param {string} method - Payment method
     * @returns {Object} Payment data
     */
    collectPaymentData: function(method) {
        const productData = PaymentGatewayDemo.DataManager.load('selectedProduct', {});
        
        const baseData = {
            amount: productData.price || 4000,
            currency: 'RWF',
            method: method,
            product: productData
        };

        // Add method-specific data
        switch (method) {
            case 'mobile-money':
                baseData.provider = document.getElementById('momo-provider')?.value;
                baseData.phone = document.getElementById('momo-phone')?.value;
                break;
            case 'bank-transfer':
                baseData.bank = document.getElementById('bank-name')?.value;
                baseData.account = document.getElementById('account-number')?.value;
                break;
            case 'card':
                baseData.cardNumber = document.getElementById('card-number')?.value;
                baseData.cardExpiry = document.getElementById('card-expiry')?.value;
                baseData.cardCvv = document.getElementById('card-cvv')?.value;
                baseData.cardName = document.getElementById('card-name')?.value;
                break;
            case 'rayswap':
                baseData.email = document.getElementById('customer-email')?.value;
                baseData.name = document.getElementById('customer-name')?.value;
                break;
        }

        return baseData;
    },

    /**
     * Process payment
     * @param {string} method - Payment method
     * @param {Object} paymentData - Payment data
     */
    processPayment: function(method, paymentData) {
        const proceedBtn = document.getElementById('proceedPaymentBtn');
        
        // Clear any previous errors
        if (typeof PaymentGatewayDemo !== 'undefined' && PaymentGatewayDemo.ErrorHandler) {
            PaymentGatewayDemo.ErrorHandler.clearErrors();
        }
        
        // Show loading state
        PaymentGatewayDemo.Utils.showButtonLoading(proceedBtn, 'Processing Payment...');
        
        // Track payment attempt
        PaymentGatewayDemo.Analytics.trackEvent('initiate', 'payment', method);
        
        // Process payment using SDK
        PaymentGatewaySDK.processPayment(method, paymentData)
            .then(result => {
                // Payment successful
                console.log('Payment completed successfully:', result);
                
                // Store payment result
                const paymentResult = {
                    ...result,
                    method: method,
                    product: paymentData.product,
                    timestamp: new Date().toISOString()
                };
                
                PaymentGatewayDemo.DataManager.save('paymentData', paymentResult);
                
                // Track success
                PaymentGatewayDemo.Analytics.trackEvent('complete', 'payment', method);
                
                // Redirect to success page
                window.location.href = 'thankyou.html';
            })
            .catch(error => {
                // Payment failed
                console.error('Payment failed:', error);
                
                // Hide loading state
                PaymentGatewayDemo.Utils.hideButtonLoading(proceedBtn);
                
                // Show detailed error message
                const errorMessage = this.getDetailedErrorMessage(error);
                
                // Clear any previous errors
                if (typeof PaymentGatewayDemo !== 'undefined' && PaymentGatewayDemo.ErrorHandler) {
                    PaymentGatewayDemo.ErrorHandler.clearErrors();
                    PaymentGatewayDemo.ErrorHandler.showUserError(errorMessage);
                } else {
                    alert(errorMessage);
                }
                
                // Track failure
                PaymentGatewayDemo.Analytics.trackEvent('fail', 'payment', method);
            });
    },

    /**
     * Get detailed error message for better user experience
     * @param {Object} error - Error object
     * @returns {string} User-friendly error message
     */
    getDetailedErrorMessage: function(error) {
        console.log('Processing error:', error);
        
        // Handle different error types
        if (!error) {
            return 'An unknown error occurred. Please try again.';
        }
        
        // Check for specific error codes
        if (error.code) {
            switch (error.code) {
                case 'E001':
                    return 'Payment processing failed. Please check your payment details and try again.';
                case 'E002':
                    return 'RaySwap payment service is currently unavailable. Please try a different payment method.';
                case 'E003':
                    return 'Payment was cancelled. You can try again when ready.';
                case 'E004':
                    return 'Cryptocurrency payment failed. Please check your wallet and try again.';
                case 'E005':
                    return 'An unexpected error occurred during payment processing. Please try again or contact support.';
                default:
                    return error.message || 'Payment failed with error code: ' + error.code;
            }
        }
        
        // Check for specific error types
        if (error.error) {
            switch (error.error) {
                case 'rayswap_unavailable':
                    return 'RaySwap payment service is not available. Please try a different payment method.';
                case 'payment_cancelled':
                    return 'Payment was cancelled by user.';
                case 'rayswap_error':
                    return 'Cryptocurrency payment failed: ' + (error.message || 'Please try again.');
                case 'payment_failed':
                    return 'Payment could not be processed. Please verify your payment details and try again.';
                default:
                    return 'Payment failed: ' + (error.message || error.error);
            }
        }
        
        // Handle network errors
        if (error.name === 'NetworkError' || error.message?.includes('network')) {
            return 'Network connection error. Please check your internet connection and try again.';
        }
        
        // Handle timeout errors
        if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
            return 'Payment request timed out. Please try again.';
        }
        
        // Return the error message if available, otherwise a generic message
        return error.message || 'An unexpected error occurred during payment processing. Please try again.';
    },

    /**
     * Load available payment methods
     */
    loadPaymentMethods: function() {
        console.log('Loading available payment methods...');
        // Here you could fetch available payment methods from your API
        // and dynamically show/hide payment options
    }
};

// Initialize payment functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Payment Gateway SDK
    PaymentGatewaySDK.init();
    
    // Initialize Payment Form Handler
    PaymentFormHandler.init();
    
    console.log('Payment system initialized');
});

// Export for global access
window.PaymentGatewaySDK = PaymentGatewaySDK;
window.PaymentFormHandler = PaymentFormHandler;