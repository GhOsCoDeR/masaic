// Product Details Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get product ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        loadProductDetails(productId);
    }
});

// Product database (this would typically come from a backend API)
const productDatabase = {
    'premium-organic-cashews': {
        name: 'Premium Organic Cashews',
        category: 'Nuts',
        sku: 'CASH-001',
        basePrice: 9.99,
        rating: 4.8,
        ratingCount: 120,
        description: 'Our signature product, grown sustainably in the Eastern Afram Plains of Ghana. These premium cashews are harvested at peak ripeness and carefully processed to preserve their natural flavor and nutritional benefits.',
        images: [
            'images/cashews.jpg',
            'images/cashews-detail-1.jpg',
            'images/cashews-detail-2.jpg',
            'images/cashews-packaging.jpg'
        ],
        variations: {
            sizes: [
                { id: '100g', name: '100g', price: 4.99, stock: 150 },
                { id: '250g', name: '250g', price: 9.99, stock: 200 },
                { id: '500g', name: '500g', price: 18.99, stock: 100 },
                { id: '1kg', name: '1kg', price: 34.99, stock: 50 }
            ],
            packages: [
                { id: 'pouch', name: 'Resealable Pouch', price: 0 },
                { id: 'gift', name: 'Gift Box', price: 2.99 },
                { id: 'bulk', name: 'Bulk Package', price: -1.00 }
            ],
            grades: [
                { id: 'premium', name: 'Premium Grade', price: 0 },
                { id: 'organic-plus', name: 'Organic Plus', price: 1.99 }
            ]
        },
        nutrition: {
            servingSize: '30g',
            facts: [
                { name: 'Calories', value: '160', unit: 'kcal' },
                { name: 'Total Fat', value: '12', unit: 'g' },
                { name: 'Protein', value: '5', unit: 'g' },
                { name: 'Carbohydrates', value: '9', unit: 'g' },
                { name: 'Fiber', value: '1', unit: 'g' },
                { name: 'Iron', value: '2', unit: 'mg' }
            ]
        },
        benefits: [
            'Rich in heart-healthy monounsaturated fats',
            'Excellent source of copper and magnesium',
            'Contains antioxidants that support immune health',
            'Good source of plant-based protein',
            'Supports healthy brain function'
        ],
        shipping: {
            methods: [
                { name: 'Standard Shipping', time: '3-5 business days', price: 4.99 },
                { name: 'Express Shipping', time: '1-2 business days', price: 9.99 }
            ],
            freeShippingThreshold: 50
        }
    },
    // Add other products here...
};

// Load product details
function loadProductDetails(productId) {
    const product = productDatabase[productId];
    if (!product) {
        window.location.href = 'products.html'; // Redirect if product not found
        return;
    }

    // Update page title
    document.title = `${product.name} - Mosaic Grove`;

    // Update breadcrumb
    document.querySelector('.product-breadcrumb .category').textContent = product.category;
    document.querySelector('.product-breadcrumb .product-name').textContent = product.name;

    // Update product header
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.sku-value').textContent = product.sku;

    // Update rating
    const starsContainer = document.querySelector('.stars');
    starsContainer.innerHTML = generateStarRating(product.rating);
    document.querySelector('.rating-count').textContent = `(${product.ratingCount} reviews)`;

    // Update description
    document.querySelector('.product-description').textContent = product.description;

    // Load product images
    loadProductImages(product.images);

    // Load variations
    loadProductVariations(product.variations);

    // Load additional information tabs
    loadNutritionFacts(product.nutrition);
    loadBenefits(product.benefits);
    loadShippingInfo(product.shipping);

    // Initialize quantity controls
    initQuantityControls();

    // Initialize add to cart functionality
    initAddToCart(productId);
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Load product images
function loadProductImages(images) {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailGallery = document.querySelector('.thumbnail-gallery');

    // Set main image
    mainImage.src = images[0];
    mainImage.alt = 'Product Image';

    // Create thumbnails
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.style.backgroundImage = `url('${image}')`;
        thumbnail.addEventListener('click', () => {
            mainImage.src = image;
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        thumbnailGallery.appendChild(thumbnail);
    });
}

// Load product variations
function loadProductVariations(variations) {
    // Load sizes
    const sizeOptions = document.querySelector('.size-options');
    variations.sizes.forEach(size => {
        const option = document.createElement('button');
        option.className = 'variation-option size-option';
        option.setAttribute('data-size-id', size.id);
        option.innerHTML = `
            ${size.name}
            <span class="variation-price">$${size.price.toFixed(2)}</span>
            <span class="stock-badge">${size.stock} left</span>
        `;
        option.addEventListener('click', () => selectVariation('size', size));
        sizeOptions.appendChild(option);
    });

    // Load package types
    const packageOptions = document.querySelector('.package-options');
    variations.packages.forEach(pkg => {
        const option = document.createElement('button');
        option.className = 'variation-option package-option';
        option.setAttribute('data-package-id', pkg.id);
        option.innerHTML = `
            ${pkg.name}
            ${pkg.price > 0 ? `<span class="variation-price">+$${pkg.price.toFixed(2)}</span>` : 
              pkg.price < 0 ? `<span class="variation-price">-$${Math.abs(pkg.price).toFixed(2)}</span>` : ''}
        `;
        option.addEventListener('click', () => selectVariation('package', pkg));
        packageOptions.appendChild(option);
    });

    // Load grades if available
    if (variations.grades) {
        const gradeOptions = document.querySelector('.grade-options');
        variations.grades.forEach(grade => {
            const option = document.createElement('button');
            option.className = 'variation-option grade-option';
            option.setAttribute('data-grade-id', grade.id);
            option.innerHTML = `
                ${grade.name}
                ${grade.price > 0 ? `<span class="variation-price">+$${grade.price.toFixed(2)}</span>` : ''}
            `;
            option.addEventListener('click', () => selectVariation('grade', grade));
            gradeOptions.appendChild(option);
        });
    } else {
        document.getElementById('grade-selection').style.display = 'none';
    }

    // Select first options by default
    selectVariation('size', variations.sizes[0]);
    selectVariation('package', variations.packages[0]);
    if (variations.grades) {
        selectVariation('grade', variations.grades[0]);
    }
}

// Handle variation selection
let selectedVariations = {
    size: null,
    package: null,
    grade: null
};

function selectVariation(type, variation) {
    // Update selected variation
    selectedVariations[type] = variation;

    // Update UI
    const options = document.querySelectorAll(`.${type}-option`);
    options.forEach(option => {
        option.classList.toggle('active', option.getAttribute(`data-${type}-id`) === variation.id);
    });

    // Update price
    updateTotalPrice();

    // Update stock status
    updateStockStatus();
}

// Update total price based on selected variations
function updateTotalPrice() {
    if (!selectedVariations.size) return;

    let total = selectedVariations.size.price;
    if (selectedVariations.package) {
        total += selectedVariations.package.price;
    }
    if (selectedVariations.grade) {
        total += selectedVariations.grade.price;
    }

    const quantity = parseInt(document.querySelector('.quantity-input').value);
    total *= quantity;

    document.querySelector('.current-price').textContent = `$${total.toFixed(2)}`;
}

// Update stock status
function updateStockStatus() {
    if (!selectedVariations.size) return;

    const stockText = document.querySelector('.stock-text');
    const stock = selectedVariations.size.stock;
    
    if (stock > 20) {
        stockText.innerHTML = `<i class="fas fa-check-circle"></i> In Stock`;
        stockText.className = 'stock-text in-stock';
    } else if (stock > 0) {
        stockText.innerHTML = `<i class="fas fa-exclamation-circle"></i> Only ${stock} left`;
        stockText.className = 'stock-text low-stock';
    } else {
        stockText.innerHTML = `<i class="fas fa-times-circle"></i> Out of Stock`;
        stockText.className = 'stock-text out-of-stock';
    }

    // Update max quantity
    document.querySelector('.max-quantity').textContent = stock;
    document.querySelector('.quantity-input').max = stock;
}

// Initialize quantity controls
function initQuantityControls() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateTotalPrice();
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        const maxQuantity = parseInt(quantityInput.max);
        if (currentValue < maxQuantity) {
            quantityInput.value = currentValue + 1;
            updateTotalPrice();
        }
    });

    quantityInput.addEventListener('change', () => {
        const value = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.max);
        if (value < 1) quantityInput.value = 1;
        if (value > max) quantityInput.value = max;
        updateTotalPrice();
    });
}

// Load nutrition facts
function loadNutritionFacts(nutrition) {
    const nutritionPanel = document.getElementById('nutrition-panel');
    nutritionPanel.innerHTML = `
        <div class="nutrition-facts">
            <h3>Nutrition Facts</h3>
            <p class="serving-size">Serving Size: ${nutrition.servingSize}</p>
            <div class="nutrition-table">
                ${nutrition.facts.map(fact => `
                    <div class="nutrition-row">
                        <span class="nutrient">${fact.name}</span>
                        <span class="value">${fact.value}${fact.unit}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Load benefits
function loadBenefits(benefits) {
    const benefitsPanel = document.getElementById('benefits-panel');
    benefitsPanel.innerHTML = `
        <ul class="benefits-list">
            ${benefits.map(benefit => `
                <li><i class="fas fa-check"></i> ${benefit}</li>
            `).join('')}
        </ul>
    `;
}

// Load shipping information
function loadShippingInfo(shipping) {
    const shippingPanel = document.getElementById('shipping-panel');
    shippingPanel.innerHTML = `
        <div class="shipping-info">
            <p class="free-shipping-note">Free shipping on orders over $${shipping.freeShippingThreshold}</p>
            <div class="shipping-methods">
                ${shipping.methods.map(method => `
                    <div class="shipping-method">
                        <h4>${method.name}</h4>
                        <p>${method.time}</p>
                        <span class="shipping-price">$${method.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Initialize add to cart functionality
function initAddToCart(productId) {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');

    addToCartBtn.addEventListener('click', () => {
        if (!selectedVariations.size || selectedVariations.size.stock === 0) {
            alert('Please select available product options');
            return;
        }

        const quantity = parseInt(document.querySelector('.quantity-input').value);
        const product = {
            id: productId,
            name: document.querySelector('.product-title').textContent,
            price: parseFloat(document.querySelector('.current-price').textContent.replace('$', '')),
            image: document.getElementById('main-product-image').src,
            variations: {
                size: selectedVariations.size.name,
                package: selectedVariations.package.name,
                grade: selectedVariations.grade ? selectedVariations.grade.name : null
            },
            quantity: quantity
        };

        // Add to cart using the global cart function
        if (window.mosaicGroveCart && window.mosaicGroveCart.addToCart) {
            window.mosaicGroveCart.addToCart(product, quantity);
            
            // Open cart drawer
            const cartDrawer = document.querySelector('.cart-drawer');
            const overlay = document.querySelector('.drawer-overlay');
            if (cartDrawer && overlay) {
                cartDrawer.classList.add('open');
                overlay.classList.add('active');
            }
        }
    });

    wishlistBtn.addEventListener('click', () => {
        const product = {
            id: productId,
            name: document.querySelector('.product-title').textContent,
            price: parseFloat(document.querySelector('.current-price').textContent.replace('$', '')),
            image: document.getElementById('main-product-image').src
        };

        // Add to wishlist using the global cart function
        if (window.mosaicGroveCart && window.mosaicGroveCart.addToWishlist) {
            window.mosaicGroveCart.addToWishlist(product);
            
            // Toggle heart icon
            const heartIcon = wishlistBtn.querySelector('i');
            heartIcon.classList.toggle('fas');
            heartIcon.classList.toggle('far');
        }
    });
} 