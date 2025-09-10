// Product Data for RaySwap E-commerce Shop
// All prices in RWF (Rwandan Francs)

const products = [
    {
        id: 'prod-001',
        name: 'Basic Software License',
        description: 'Essential software package with core features for small businesses and individual users.',
        price: 2500,
        currency: 'RWF',
        image: 'basic-license',
        category: 'Software License',
        features: [
            'Core functionality access',
            'Email support',
            '6 months updates',
            'Single user license'
        ]
    },
    {
        id: 'prod-002',
        name: 'Digital Marketing Tools',
        description: 'Comprehensive suite of digital marketing tools including analytics, SEO optimizer, and social media scheduler.',
        price: 3200,
        currency: 'RWF',
        image: 'marketing-tools',
        category: 'Digital Tools',
        features: [
            'SEO analysis tools',
            'Social media scheduler',
            'Analytics dashboard',
            'Email marketing templates'
        ]
    },
    {
        id: 'prod-003',
        name: 'Cloud Storage Pro',
        description: 'Secure cloud storage solution with 1TB space, file sharing, and collaboration features.',
        price: 4000,
        currency: 'RWF',
        image: 'cloud-storage',
        category: 'Cloud Services',
        features: [
            '1TB secure storage',
            'File sharing & collaboration',
            'Automatic backup',
            'Mobile app access'
        ]
    },
    {
        id: 'prod-004',
        name: 'Web Development Kit',
        description: 'Complete web development toolkit with templates, frameworks, and deployment tools.',
        price: 4800,
        currency: 'RWF',
        image: 'web-dev-kit',
        category: 'Development Tools',
        features: [
            '50+ website templates',
            'Framework libraries',
            'Deployment automation',
            'Code editor plugins'
        ]
    },
    {
        id: 'prod-005',
        name: 'Business Analytics Suite',
        description: 'Advanced business intelligence and analytics platform for data-driven decision making.',
        price: 5500,
        currency: 'RWF',
        image: 'analytics-suite',
        category: 'Business Tools',
        features: [
            'Real-time dashboards',
            'Custom report builder',
            'Data visualization',
            'API integrations'
        ]
    },
    {
        id: 'prod-006',
        name: 'E-commerce Platform',
        description: 'Full-featured e-commerce platform with payment processing, inventory management, and customer analytics.',
        price: 6200,
        currency: 'RWF',
        image: 'ecommerce-platform',
        category: 'Business Platform',
        features: [
            'Online store builder',
            'Payment gateway integration',
            'Inventory management',
            'Customer analytics'
        ]
    },
    {
        id: 'prod-007',
        name: 'Mobile App Development Suite',
        description: 'Cross-platform mobile app development tools with drag-and-drop interface and publishing support.',
        price: 7000,
        currency: 'RWF',
        image: 'mobile-dev-suite',
        category: 'Development Tools',
        features: [
            'Cross-platform development',
            'Drag-and-drop interface',
            'App store publishing',
            'Testing & debugging tools'
        ]
    },
    {
        id: 'prod-008',
        name: 'Enterprise Security Package',
        description: 'Comprehensive cybersecurity solution with threat detection, firewall, and compliance monitoring.',
        price: 8500,
        currency: 'RWF',
        image: 'security-package',
        category: 'Security',
        features: [
            'Advanced threat detection',
            'Enterprise firewall',
            'Compliance monitoring',
            '24/7 security support'
        ]
    },
    {
        id: 'prod-009',
        name: 'AI-Powered CRM System',
        description: 'Intelligent customer relationship management system with AI-driven insights and automation.',
        price: 9200,
        currency: 'RWF',
        image: 'ai-crm-system',
        category: 'Business Platform',
        features: [
            'AI-powered insights',
            'Customer journey mapping',
            'Automated workflows',
            'Advanced reporting'
        ]
    },
    {
        id: 'prod-010',
        name: 'Premium Enterprise Suite',
        description: 'Complete enterprise solution with all premium features, unlimited users, and dedicated support.',
        price: 10000,
        currency: 'RWF',
        image: 'enterprise-suite',
        category: 'Enterprise',
        features: [
            'All premium features',
            'Unlimited user licenses',
            'Dedicated account manager',
            'Priority support & training'
        ]
    }
];

// Helper functions for product management
const ProductManager = {
    // Get all products
    getAllProducts: () => products,
    
    // Get product by ID
    getProductById: (id) => products.find(product => product.id === id),
    
    // Get products by category
    getProductsByCategory: (category) => products.filter(product => product.category === category),
    
    // Get products by price range
    getProductsByPriceRange: (minPrice, maxPrice) => {
        return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    },
    
    // Format price with currency
    formatPrice: (price, currency = 'RWF') => {
        return `${currency} ${price.toLocaleString()}`;
    },
    
    // Get unique categories
    getCategories: () => {
        const categories = products.map(product => product.category);
        return [...new Set(categories)];
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, ProductManager };
}