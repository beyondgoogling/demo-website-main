// Shopping Cart Management System
// Handles cart operations, storage, and calculations

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.listeners = [];
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('rayswap_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('rayswap_cart', JSON.stringify(this.items));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add event listener for cart changes
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Notify all listeners of cart changes
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.items));
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                currency: product.currency,
                image: product.image,
                category: product.category,
                quantity: quantity
            });
        }
        
        this.saveCart();
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }

    // Get cart items
    getItems() {
        return this.items;
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveCart();
    }

    // Get cart summary for checkout
    getCheckoutSummary() {
        return {
            items: this.items,
            itemCount: this.getItemCount(),
            total: this.getTotal(),
            currency: this.items.length > 0 ? this.items[0].currency : 'RWF'
        };
    }

    // Validate cart before checkout
    validateCart() {
        if (this.isEmpty()) {
            return { valid: false, message: 'Cart is empty' };
        }
        
        // Check for invalid quantities
        const invalidItems = this.items.filter(item => item.quantity <= 0);
        if (invalidItems.length > 0) {
            return { valid: false, message: 'Invalid quantities in cart' };
        }
        
        return { valid: true, message: 'Cart is valid' };
    }
}

// Cart UI Helper Functions
const CartUI = {
    // Update cart counter in navigation
    updateCartCounter: (count) => {
        const counters = document.querySelectorAll('.cart-counter');
        counters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'inline' : 'none';
        });
    },

    // Show add to cart success message
    showAddToCartMessage: (productName) => {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✓</span>
                <span class="toast-message">${productName} added to cart</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    },

    // Format price for display
    formatPrice: (price, currency = 'RWF') => {
        return `${currency} ${price.toLocaleString()}`;
    },

    // Generate cart item HTML
    generateCartItemHTML: (item) => {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <div class="product-image-placeholder">${item.name.charAt(0)}</div>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-price">${CartUI.formatPrice(item.price, item.currency)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="cart.removeItem('${item.id}')" title="Remove item">×</button>
                </div>
                <div class="cart-item-total">
                    ${CartUI.formatPrice(item.price * item.quantity, item.currency)}
                </div>
            </div>
        `;
    }
};

// Note: Cart instances are managed by individual pages
// Each page creates its own cart instance to avoid conflicts

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, CartUI };
}