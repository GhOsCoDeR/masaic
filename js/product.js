// Product Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Cart from localStorage or create new one
    let cart = JSON.parse(localStorage.getItem('mosaicCart')) || {
        items: [],
        total: 0
    };
    
    // Initialize Wishlist from localStorage or create new one
    let wishlist = JSON.parse(localStorage.getItem('mosaicWishlist')) || [];
    
    // Update cart count in the navbar
    updateCartCount();
    updateWishlistCount();
    
    // Add event listeners to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    // Add event listeners to all Add to Cart buttons in product grid/overlay
    const addToCartGridButtons = document.querySelectorAll('.add-to-cart');
    addToCartGridButtons.forEach(button => {
        button.addEventListener('click', handleAddToCartGrid);
    });
    
    // Add event listeners to all Wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', handleAddToWishlist);
    });
    
    // Add event listener to Wishlist buttons in product grid/overlay
    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', handleAddToWishlistGrid);
    });
    
    // Add event listener to "Order Now" buttons
    const orderNowButtons = document.querySelectorAll('.cta-button');
    orderNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get product info from the closest product detail
            const productDetail = this.closest('.product-detail');
            if (!productDetail) return;
            
            const productName = productDetail.querySelector('h2').textContent;
            const productSize = productDetail.querySelector('.size-option.active').textContent;
            
            // Simulate adding to cart
            addToCart({
                name: productName,
                size: productSize,
                price: getProductPrice(productName, productSize),
                quantity: 1,
                image: productDetail.querySelector('.product-image').style.backgroundImage.replace('url("', '').replace('")', '')
            });
            
            // Show notification
            showNotification(`${productName} (${productSize}) added to cart!`);
        });
    });
    
    // Handle Add to Cart for grid/overlay buttons
    function handleAddToCartGrid(e) {
        // Prevent default button behavior
        e.preventDefault();
        
        // Get product info
        const overlayContent = this.closest('.overlay-content');
        if (overlayContent) {
            // Button is in an overlay
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3').textContent;
            let productSize = '250g'; // Default size
            
            // Get price
            let price = 0;
            const priceElement = productCard.querySelector('.price-amount') || 
                                productCard.querySelector('.price');
            if (priceElement) {
                price = parseFloat(priceElement.textContent.replace('$', ''));
            }
            
            // Get image
            let image = '';
            const imageElement = productCard.querySelector('.product-image');
            if (imageElement) {
                image = imageElement.style.backgroundImage.replace('url("', '').replace('")', '');
            }
            
            // Add to cart
            addToCart({
                name: productName,
                size: productSize,
                price: price,
                quantity: 1,
                image: image
            });
            
            // Show notification
            showNotification(`${productName} (${productSize}) added to cart!`);
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            }, 2000);
        }
    }
    
    // Handle Add to Wishlist for grid/overlay buttons
    function handleAddToWishlistGrid(e) {
        // Prevent default button behavior
        e.preventDefault();
        
        // Get product info
        const productCard = this.closest('.product-card');
        if (!productCard) return;
        
        const productName = productCard.querySelector('h3').textContent;
        
        // Get image
        let image = '';
        const imageElement = productCard.querySelector('.product-image');
        if (imageElement) {
            image = imageElement.style.backgroundImage.replace('url("', '').replace('")', '');
        }
        
        // Check if already in wishlist
        const isInWishlist = wishlist.some(item => item.name === productName);
        
        if (isInWishlist) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.name !== productName);
            
            // Update button style
            this.innerHTML = '<i class="far fa-heart"></i>';
            
            // Show notification
            showNotification(`${productName} removed from wishlist!`);
        } else {
            // Add to wishlist
            wishlist.push({
                name: productName,
                image: image
            });
            
            // Update button style
            this.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Show notification
            showNotification(`${productName} added to wishlist!`);
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('mosaicWishlist', JSON.stringify(wishlist));
        
        // Update wishlist count
        updateWishlistCount();
    }
    
    // Handle Add to Cart
    function handleAddToCart(e) {
        // Prevent default button behavior
        e.preventDefault();
        
        // Get product info
        const productContainer = this.closest('.featured-product-content') || this.closest('.product-card');
        if (!productContainer) return;
        
        const productName = productContainer.querySelector('h2, h3').textContent;
        let productSize = '250g'; // Default size
        const sizeOption = productContainer.querySelector('.size-option.active');
        if (sizeOption) {
            productSize = sizeOption.textContent;
        }
        
        // Get price
        let price = 0;
        const priceElement = productContainer.querySelector('.sale-price') || 
                            productContainer.querySelector('.price-amount') ||
                            productContainer.querySelector('.regular-price');
        if (priceElement) {
            price = parseFloat(priceElement.textContent.replace('$', ''));
        }
        
        // Get image
        let image = '';
        const imageElement = productContainer.querySelector('.product-image, .featured-product-image');
        if (imageElement) {
            image = imageElement.style.backgroundImage.replace('url("', '').replace('")', '');
        }
        
        // Add to cart
        addToCart({
            name: productName,
            size: productSize,
            price: price,
            quantity: 1,
            image: image
        });
        
        // Visual feedback
        this.classList.add('added');
        this.innerHTML = '<i class="fas fa-check"></i> Added';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            this.classList.remove('added');
            this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 2000);
        
        // Show notification
        showNotification(`${productName} (${productSize}) added to cart!`);
    }
    
    // Handle Add to Wishlist
    function handleAddToWishlist(e) {
        // Prevent default button behavior
        e.preventDefault();
        
        // Get product info
        const productContainer = this.closest('.featured-product-content') || this.closest('.product-card');
        if (!productContainer) return;
        
        const productName = productContainer.querySelector('h2, h3').textContent;
        
        // Get image
        let image = '';
        const imageElement = productContainer.querySelector('.product-image, .featured-product-image');
        if (imageElement) {
            image = imageElement.style.backgroundImage.replace('url("', '').replace('")', '');
        }
        
        // Check if already in wishlist
        const isInWishlist = wishlist.some(item => item.name === productName);
        
        if (isInWishlist) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.name !== productName);
            
            // Update button style
            this.classList.remove('in-wishlist');
            this.innerHTML = '<i class="far fa-heart"></i>';
            
            // Show notification
            showNotification(`${productName} removed from wishlist!`);
        } else {
            // Add to wishlist
            wishlist.push({
                name: productName,
                image: image
            });
            
            // Update button style
            this.classList.add('in-wishlist');
            this.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Show notification
            showNotification(`${productName} added to wishlist!`);
        }
        
        // Save wishlist to localStorage
        localStorage.setItem('mosaicWishlist', JSON.stringify(wishlist));
        
        // Update wishlist count
        updateWishlistCount();
    }
    
    // Add item to cart
    function addToCart(product) {
        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.name === product.name && item.size === product.size);
        
        if (existingItemIndex > -1) {
            // Increment quantity if already in cart
            cart.items[existingItemIndex].quantity += product.quantity;
        } else {
            // Add new item to cart
            cart.items.push(product);
        }
        
        // Update cart total
        updateCartTotal();
        
        // Save cart to localStorage
        localStorage.setItem('mosaicCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
    }
    
    // Update cart total
    function updateCartTotal() {
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Update cart count in UI
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            if (itemCount > 0) {
                element.classList.add('has-items');
            } else {
                element.classList.remove('has-items');
            }
        });
    }
    
    // Update wishlist count in UI
    function updateWishlistCount() {
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        
        wishlistCountElements.forEach(element => {
            element.textContent = wishlist.length;
            if (wishlist.length > 0) {
                element.classList.add('has-items');
            } else {
                element.classList.remove('has-items');
            }
        });
        
        // Also update wishlist button states
        updateWishlistButtonStates();
    }
    
    // Update all wishlist button states based on localStorage
    function updateWishlistButtonStates() {
        const wishlistButtons = document.querySelectorAll('.wishlist-btn');
        
        wishlistButtons.forEach(button => {
            const productContainer = button.closest('.featured-product-content') || button.closest('.product-card');
            if (!productContainer) return;
            
            const productName = productContainer.querySelector('h2, h3').textContent;
            const isInWishlist = wishlist.some(item => item.name === productName);
            
            if (isInWishlist) {
                button.classList.add('in-wishlist');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                button.classList.remove('in-wishlist');
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }
    
    // Show notification
    function showNotification(message) {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add animation class after a small delay (for animation to work)
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Add event listener to close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Automatically remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Helper function to get product price based on name and size
    function getProductPrice(name, size) {
        // This is a simplified pricing structure
        // In a real application, this would likely come from a database
        const priceMap = {
            'Organic Cashews': {
                '100g': 5.99,
                '250g': 9.99,
                '500g': 18.99,
                '1kg': 34.99
            },
            'Tiger Nuts': {
                '100g': 6.99,
                '250g': 12.99,
                '500g': 22.99,
                '1kg': 39.99
            },
            'Premium Organic Cashews': {
                '100g': 5.99,
                '250g': 9.99,
                '500g': 18.99,
                '1kg': 34.99
            }
        };
        
        // Return price if found, otherwise return a default price
        return priceMap[name] && priceMap[name][size] ? priceMap[name][size] : 9.99;
    }
    
    // Category tabs filtering
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get category
            const category = this.dataset.category;
            
            // Filter products
            filterProducts(category);
        });
    });
    
    // Function to filter products based on category
    function filterProducts(category) {
        const productCategories = document.querySelectorAll('.product-category');
        const productCards = document.querySelectorAll('.product-card');
        
        if (category === 'all') {
            // Show all products
            productCategories.forEach(pc => pc.style.display = 'block');
            productCards.forEach(pc => pc.style.display = 'block');
        } else {
            // Filter product categories
            productCategories.forEach(pc => {
                if (pc.classList.contains(category)) {
                    pc.style.display = 'block';
                } else {
                    pc.style.display = 'none';
                }
            });
            
            // Filter product cards
            productCards.forEach(pc => {
                const cardCategory = pc.querySelector('.product-category-label').textContent.toLowerCase();
                if (cardCategory.includes(category) || category === 'plant-based' && cardCategory.includes('plant')) {
                    pc.style.display = 'block';
                } else {
                    pc.style.display = 'none';
                }
            });
        }
    }
    
    // Size selection for products
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options in this size group
            const sizeContainer = this.closest('.size-options');
            sizeContainer.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update price if needed (if we had a price function based on size)
            updateProductPrice(this);
        });
    });
    
    // Function to update product price based on selected size
    function updateProductPrice(sizeOption) {
        const size = sizeOption.textContent;
        const productDetail = sizeOption.closest('.product-detail');
        
        if (!productDetail) return;
        
        const productName = productDetail.querySelector('h2').textContent;
        const price = getProductPrice(productName, size);
        
        // If there's a price element, update it
        const priceElement = productDetail.querySelector('.price-amount');
        if (priceElement) {
            priceElement.textContent = `$${price.toFixed(2)}`;
        }
    }
    
    // Initialize the page - update wishlist button states
    updateWishlistButtonStates();
}); 