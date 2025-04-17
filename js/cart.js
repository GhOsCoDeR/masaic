// Cart and Wishlist Functionality for Mosaic Grove

// Initialize cart and wishlist from localStorage or create empty ones
let cart = JSON.parse(localStorage.getItem('mosaicGroveCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('mosaicGroveWishlist')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('mosaicGroveCart', JSON.stringify(cart));
    updateCartCount();
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('mosaicGroveWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Add item to cart
function addToCart(product, quantity = 1) {
    // Create a unique identifier based on all variations
    const getVariationKey = (item) => {
        if (item.variations) {
            return `${item.id}-${item.variations.size || ''}-${item.variations.package || ''}-${item.variations.grade || ''}`;
        }
        return `${item.id}-${item.size || ''}`;
    };

    // Check if product with exact same variations exists in cart
    const existingItemIndex = cart.findIndex(item => getVariationKey(item) === getVariationKey(product));

    // If product with same variations exists, update quantity
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Otherwise, add new item
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Save cart
    saveCart();
    
    // Show notification
    showNotification(`${product.name} added to your cart`);
    
    // Update cart interface
    updateCartInterface();
}

// Add item to wishlist
function addToWishlist(product) {
    // Check if product already exists in wishlist
    const existingItem = wishlist.find(item => item.id === product.id);
    
    // Add only if it doesn't exist
    if (!existingItem) {
        wishlist.push(product);
        saveWishlist();
        showNotification(`${product.name} added to your wishlist`);
    } else {
        showNotification(`${product.name} is already in your wishlist`);
    }
    
    // Update wishlist interface
    updateWishlistInterface();
}

// Remove item from cart
function removeFromCart(index) {
    // Remove item at the specified index
    cart.splice(index, 1);
    
    // Save cart state
    saveCart();
    
    // Update UI
    updateCartInterface();
    updateCartTotal();
}

// Remove item from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist();
    updateWishlistInterface();
}

// Update item quantity in cart
function updateCartItemQuantity(productId, quantity, variations) {
    // Create variation key for comparison
    const getVariationKey = (item) => {
        if (item.variations) {
            return `${item.id}-${item.variations.size || ''}-${item.variations.package || ''}-${item.variations.grade || ''}`;
        }
        return `${item.id}-${item.size || ''}`;
    };

    const targetKey = variations.size ? 
        `${productId}-${variations.size}` :
        getVariationKey({ id: productId, variations });

    // Find the item with matching variations
    const itemIndex = cart.findIndex(item => getVariationKey(item) === targetKey);
    
    if (itemIndex >= 0) {
        if (quantity > 0) {
            cart[itemIndex].quantity = quantity;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        saveCart();
        updateCartInterface();
    }
}

// Move item from wishlist to cart
function moveToCart(productId, quantity = 1, size = null) {
    // Find item in wishlist
    const item = wishlist.find(item => item.id === productId);
    
    if (item) {
        // Add to cart
        addToCart(item, quantity, size);
        
        // Remove from wishlist
        removeFromWishlist(productId);
    }
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => {
        const price = typeof item.price === 'number' ? 
            item.price : 
            parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('has-items', totalItems > 0);
    }
}

// Update wishlist count badge
function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.classList.toggle('has-items', wishlist.length > 0);
    }
}

// Show notification when item is added to cart or wishlist
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
        });
        
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        document.body.appendChild(notification);
    }
    
    // Set notification message and type
    const content = notification.querySelector('.notification-content');
    content.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><p>${message}</p>`;
    notification.className = `notification ${type} show`;
    
    // Auto-hide notification after a delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update cart interface (drawer)
function updateCartInterface() {
    const cartItemsElement = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total-value');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    // Clear existing items
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsElement.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="shop-now-btn">Start Shopping</button>
            </div>
        `;
        
        const shopNowBtn = cartItemsElement.querySelector('.shop-now-btn');
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                document.querySelector('.cart-drawer').classList.remove('open');
                document.querySelector('.drawer-overlay').classList.remove('active');
                window.location.href = 'products.html';
            });
        }
    } else {
        // Add cart items
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // Create variations text if variations exist
            let variationsText = '';
            if (item.variations) {
                const variations = [];
                if (item.variations.size) variations.push(`Size: ${item.variations.size}`);
                if (item.variations.package) variations.push(`Package: ${item.variations.package}`);
                if (item.variations.grade) variations.push(`Grade: ${item.variations.grade}`);
                if (variations.length > 0) {
                    variationsText = `<div class="cart-item-variations">${variations.join(' | ')}</div>`;
                }
            } else if (item.size) {
                variationsText = `<div class="cart-item-variations">Size: ${item.size}</div>`;
            }
            
            cartItem.innerHTML = `
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    ${variationsText}
                    <span class="cart-item-price">$${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price.toString().replace(/[^0-9.]/g, '')).toFixed(2)}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            
            // Add event listeners for quantity changes
            const quantityInput = cartItem.querySelector('.quantity-input');
            const decreaseBtn = cartItem.querySelector('.decrease');
            const increaseBtn = cartItem.querySelector('.increase');
            const removeBtn = cartItem.querySelector('.cart-item-remove');
            
            quantityInput.addEventListener('change', () => {
                const newQuantity = parseInt(quantityInput.value) || 1;
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    saveCart();
                    updateCartTotal();
                }
            });
            
            decreaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    const newQuantity = currentValue - 1;
                    cart[index].quantity = newQuantity;
                    quantityInput.value = newQuantity;
                    saveCart();
                    updateCartTotal();
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                const newQuantity = currentValue + 1;
                cart[index].quantity = newQuantity;
                quantityInput.value = newQuantity;
                saveCart();
                updateCartTotal();
            });
            
            // Add click event listener for remove button
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromCart(index);
            });
            
            cartItemsElement.appendChild(cartItem);
        });
    }
    
    // Update cart total
    updateCartTotal();
}

// Update wishlist interface
function updateWishlistInterface() {
    const wishlistItemsElement = document.querySelector('.wishlist-items');
    if (!wishlistItemsElement) return;
    
    // Clear existing items
    wishlistItemsElement.innerHTML = '';
    
    if (wishlist.length === 0) {
        // Show empty wishlist message
        wishlistItemsElement.innerHTML = `
            <div class="wishlist-empty">
                <i class="fas fa-heart"></i>
                <p>Your wishlist is empty</p>
                <button class="shop-now-btn">Discover Products</button>
            </div>
        `;
        
        const shopNowBtn = wishlistItemsElement.querySelector('.shop-now-btn');
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                document.querySelector('.wishlist-drawer').classList.remove('open');
                document.querySelector('.drawer-overlay').classList.remove('active');
                window.location.href = 'products.html';
            });
        }
    } else {
        // Add wishlist items
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image" style="background-image: url('${item.image}')"></div>
                <div class="wishlist-item-details">
                    <h4 class="wishlist-item-name">${item.name}</h4>
                    <span class="wishlist-item-price">${item.price}</span>
                </div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-from-wishlist"><i class="fas fa-shopping-cart"></i></button>
                    <button class="remove-from-wishlist"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            
            // Add event listeners
            const addToCartBtn = wishlistItem.querySelector('.add-to-cart-from-wishlist');
            const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
            
            addToCartBtn.addEventListener('click', () => {
                moveToCart(item.id);
            });
            
            removeBtn.addEventListener('click', () => {
                removeFromWishlist(item.id);
            });
            
            wishlistItemsElement.appendChild(wishlistItem);
        });
    }
}

// Update cart total
function updateCartTotal() {
    const cartTotalElement = document.querySelector('.cart-total-value');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (cartTotalElement) {
        const total = calculateCartTotal();
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        
        // Update checkout button state
        if (checkoutBtn) {
            const hasItems = cart.length > 0;
            checkoutBtn.disabled = !hasItems;
            
            // Update button styles
            if (hasItems) {
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.cursor = 'pointer';
            } else {
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.cursor = 'not-allowed';
            }
        }
    }
}

// Initialize cart and wishlist UI when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create cart drawer if it doesn't exist
    if (!document.querySelector('.cart-drawer')) {
        createCartDrawer();
    }
    
    // Create wishlist drawer if it doesn't exist
    if (!document.querySelector('.wishlist-drawer')) {
        createWishlistDrawer();
    }
    
    // Create overlay if it doesn't exist
    if (!document.querySelector('.drawer-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            document.querySelector('.cart-drawer')?.classList.remove('open');
            document.querySelector('.wishlist-drawer')?.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
    
    // Add event listeners for cart and wishlist icons
    const cartIcon = document.querySelector('.cart-icon');
    const wishlistIcon = document.querySelector('.wishlist-icon');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const cartDrawer = document.querySelector('.cart-drawer');
            const overlay = document.querySelector('.drawer-overlay');
            const wishlistDrawer = document.querySelector('.wishlist-drawer');
            
            // Close wishlist drawer if open
            wishlistDrawer?.classList.remove('open');
            
            // Toggle cart drawer
            if (cartDrawer.classList.contains('open')) {
                cartDrawer.classList.remove('open');
                overlay.classList.remove('active');
            } else {
                cartDrawer.classList.add('open');
                overlay.classList.add('active');
            }
        });
    }
    
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const wishlistDrawer = document.querySelector('.wishlist-drawer');
            const overlay = document.querySelector('.drawer-overlay');
            const cartDrawer = document.querySelector('.cart-drawer');
            
            // Close cart drawer if open
            cartDrawer?.classList.remove('open');
            
            // Toggle wishlist drawer
            if (wishlistDrawer.classList.contains('open')) {
                wishlistDrawer.classList.remove('open');
                overlay.classList.remove('active');
            } else {
                wishlistDrawer.classList.add('open');
                overlay.classList.add('active');
            }
        });
    }
    
    // Set up Add to Cart buttons
    document.querySelectorAll('.add-to-cart, .add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find product details
            const productCard = button.closest('.product-card') || button.closest('.product-detail');
            if (!productCard) return;
            
            const name = productCard.querySelector('h3')?.textContent || productCard.querySelector('h2')?.textContent;
            const priceElement = productCard.querySelector('.price-amount') || productCard.querySelector('.price');
            const price = priceElement ? priceElement.textContent.trim() : '$9.99';
            
            // Get image URL - handle both background-image and img src
            let image;
            const imageElement = productCard.querySelector('.product-image');
            if (imageElement) {
                image = imageElement.style.backgroundImage ? 
                    imageElement.style.backgroundImage.slice(5, -2) : 
                    imageElement.getAttribute('src') || 'images/cashews.jpg';
            } else {
                image = 'images/cashews.jpg';
            }
            
            const product = {
                id: name.toLowerCase().replace(/\s+/g, '-'),
                name: name,
                price: price,
                image: image
            };
            
            // Add to cart with default quantity of 1
            addToCart(product, 1);
            
            // Open cart drawer to show the added item
            const cartDrawer = document.querySelector('.cart-drawer');
            const overlay = document.querySelector('.drawer-overlay');
            cartDrawer.classList.add('open');
            overlay.classList.add('active');
        });
    });
    
    // Set up Add to Wishlist buttons
    document.querySelectorAll('.add-to-wishlist, .wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Find product details
            const productCard = button.closest('.product-card') || button.closest('.product-detail');
            if (!productCard) return;
            
            const name = productCard.querySelector('h3')?.textContent || productCard.querySelector('h2')?.textContent;
            const price = productCard.querySelector('.price-amount')?.textContent || 
                         productCard.querySelector('.price')?.textContent || '$9.99';
            const image = productCard.querySelector('.product-image')?.style.backgroundImage.slice(5, -2) || 'images/cashews.jpg';
            
            const product = {
                id: name.replace(/\s+/g, '-').toLowerCase(),
                name: name,
                price: price,
                image: image,
            };
            
            addToWishlist(product);
        });
    });
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
    
    // Update cart and wishlist interfaces
    updateCartInterface();
    updateWishlistInterface();
});

// Create cart drawer
function createCartDrawer() {
    const cartDrawer = document.createElement('div');
    cartDrawer.className = 'cart-drawer';
    
    cartDrawer.innerHTML = `
        <div class="cart-header">
            <h2><i class="fas fa-shopping-cart"></i> Your Cart</h2>
            <button class="cart-close">&times;</button>
        </div>
        <div class="cart-items">
            <!-- Cart items will be added here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span class="cart-total-label">Total:</span>
                <span class="cart-total-value">$0.00</span>
            </div>
            <button class="checkout-btn" style="opacity: 0.5; cursor: not-allowed;">Proceed to Checkout</button>
        </div>
    `;
    
    document.body.appendChild(cartDrawer);
    
    // Add event listeners
    const closeBtn = cartDrawer.querySelector('.cart-close');
    const checkoutBtn = cartDrawer.querySelector('.checkout-btn');
    
    closeBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('open');
        document.querySelector('.drawer-overlay').classList.remove('active');
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (!checkoutBtn.disabled && cart.length > 0) {
            proceedToCheckout();
        }
    });
}

// Create wishlist drawer
function createWishlistDrawer() {
    const wishlistDrawer = document.createElement('div');
    wishlistDrawer.className = 'wishlist-drawer';
    
    wishlistDrawer.innerHTML = `
        <div class="wishlist-header">
            <h2><i class="fas fa-heart"></i> Your Wishlist</h2>
            <button class="wishlist-close">&times;</button>
        </div>
        <div class="wishlist-items">
            <!-- Wishlist items will be added here -->
        </div>
    `;
    
    document.body.appendChild(wishlistDrawer);
    
    // Add event listener
    const closeBtn = wishlistDrawer.querySelector('.wishlist-close');
    closeBtn.addEventListener('click', () => {
        wishlistDrawer.classList.remove('open');
        document.querySelector('.drawer-overlay').classList.remove('active');
    });
}

// Handle checkout process
function proceedToCheckout() {
    // Prepare cart items with all necessary information
    const checkoutItems = cart.map(item => {
        const price = typeof item.price === 'number' ? 
            item.price : 
            parseFloat(item.price.replace(/[^0-9.]/g, ''));
            
        return {
            id: item.id,
            name: item.name,
            price: price,
            quantity: item.quantity,
            image: item.image,
            variations: item.variations || (item.size ? { size: item.size } : null),
            totalPrice: price * item.quantity
        };
    });

    // Calculate subtotal
    const subtotal = checkoutItems.reduce((total, item) => total + item.totalPrice, 0);
    
    // Calculate tax (7%)
    const tax = subtotal * 0.07;
    
    // Fixed shipping cost
    const shipping = 10.00;
    
    // Calculate total
    const total = subtotal + tax + shipping;

    // Store checkout data
    const checkoutData = {
        items: checkoutItems,
        summary: {
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total
        }
    };

    // Store checkout data in localStorage
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Navigate to checkout page
    window.location.href = 'checkout.html';
}

// Export functions for use in other scripts
window.mosaicGroveCart = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    calculateCartTotal,
    updateCartInterface,
    updateWishlistInterface
}; 