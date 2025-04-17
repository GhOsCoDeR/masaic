document.addEventListener('DOMContentLoaded', () => {
    // Initialize product filtering
    initProductFilters();
    
    // Initialize nutritional tabs
    initNutritionalTabs();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize product size selection
    initProductSizes();

    // Initialize "Learn More" buttons
    initLearnMoreButtons();
    
    // Initialize benefits carousel
    initBenefitsCarousel();
});

// Product Filtering Functionality
function initProductFilters() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const productCategories = document.querySelectorAll('.product-category');
    const plantBasedSection = document.querySelector('.plant-based');
    const plantBasedCards = document.querySelectorAll('.product-card');
    
    if (!categoryTabs.length) return;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            // Handle visibility based on category
            if (category === 'all') {
                // Show all products
                productCategories.forEach(pc => pc.style.display = 'block');
                plantBasedSection.style.display = 'block';
            } else if (category === 'cashews') {
                // Show only cashew products (assuming first product category is cashews)
                productCategories[0].style.display = 'block';
                productCategories[1].style.display = 'none';
                plantBasedSection.style.display = 'none';
            } else if (category === 'tiger-nuts') {
                // Show only tiger nut products (assuming second product category is tiger nuts)
                productCategories[0].style.display = 'none';
                productCategories[1].style.display = 'block';
                plantBasedSection.style.display = 'none';
            } else if (category === 'plant-based') {
                // Show only plant-based products
                productCategories.forEach(pc => pc.style.display = 'none');
                plantBasedSection.style.display = 'block';
            }
            
            // Scroll to the products section
            document.querySelector('.main-products').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Nutritional Tabs Functionality
function initNutritionalTabs() {
    const nutritionTabs = document.querySelectorAll('.nutrition-tab');
    const nutritionContent = document.querySelector('.nutrition-content');
    const nutritionItems = document.querySelectorAll('.nutrition-item');
    
    if (!nutritionTabs.length) return;
    
    // Create content for tiger nuts nutrition (to swap with cashews)
    const tigerNutsContent = `
        <div class="nutrition-chart">
            <div class="chart-header">
                <h3>Tiger Nuts Nutrition (per 100g)</h3>
            </div>
            <div class="chart-body">
                <div class="nutrition-item">
                    <div class="nutrient">
                        <h4>Calories</h4>
                        <div class="nutrient-bar" style="width: 60%;">400 kcal</div>
                    </div>
                </div>
                <div class="nutrition-item">
                    <div class="nutrient">
                        <h4>Protein</h4>
                        <div class="nutrient-bar" style="width: 30%;">5g</div>
                    </div>
                </div>
                <div class="nutrition-item">
                    <div class="nutrient">
                        <h4>Healthy Fats</h4>
                        <div class="nutrient-bar" style="width: 50%;">22g</div>
                    </div>
                </div>
                <div class="nutrition-item">
                    <div class="nutrient">
                        <h4>Fiber</h4>
                        <div class="nutrient-bar" style="width: 75%;">10g</div>
                    </div>
                </div>
                <div class="nutrition-item">
                    <div class="nutrient">
                        <h4>Iron</h4>
                        <div class="nutrient-bar" style="width: 45%;">4.5mg</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="nutrition-benefits">
            <div class="benefit-card">
                <i class="fas fa-heart"></i>
                <h4>Digestive Health</h4>
                <p>High fiber content promotes healthy digestion and gut function.</p>
            </div>
            <div class="benefit-card">
                <i class="fas fa-bolt"></i>
                <h4>Energy Boost</h4>
                <p>Natural source of energy with a low glycemic index, ideal for sustained energy.</p>
            </div>
            <div class="benefit-card">
                <i class="fas fa-shield-alt"></i>
                <h4>Immune Support</h4>
                <p>Contains vitamins and minerals that support immune system function.</p>
            </div>
        </div>
    `;
    
    // Store original cashews content
    const cashewsContent = nutritionContent.innerHTML;
    
    nutritionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            nutritionTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const product = tab.getAttribute('data-product');
            
            // Animate out current content
            nutritionContent.style.opacity = '0';
            
            // Change content after fade out
            setTimeout(() => {
                if (product === 'cashews') {
                    nutritionContent.innerHTML = cashewsContent;
                } else if (product === 'tiger-nuts') {
                    nutritionContent.innerHTML = tigerNutsContent;
                }
                
                // Animate bars after content change
                const newNutrientBars = document.querySelectorAll('.nutrient-bar');
                newNutrientBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 50);
                });
                
                // Fade in new content
                nutritionContent.style.opacity = '1';
            }, 300);
        });
    });
    
    // Animate nutrient bars on page load
    setTimeout(() => {
        const nutrientBars = document.querySelectorAll('.nutrient-bar');
        nutrientBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 50);
        });
    }, 500);
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const sliderContainer = document.querySelector('.testimonials-slider');
    
    if (!testimonials.length || testimonials.length <= 1) return;
    
    let currentIndex = 0;
    
    // Set first testimonial as active initially
    testimonials[0].classList.add('active');
    
    // Create slider controls
    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.className = 'slider-control prev';
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.className = 'slider-control next';
    
    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';
    
    testimonials.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.className = index === 0 ? 'indicator active' : 'indicator';
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    controls.appendChild(prevBtn);
    controls.appendChild(indicators);
    controls.appendChild(nextBtn);
    
    sliderContainer.parentNode.appendChild(controls);
    
    // Add event listeners for controls
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Set up auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Function to go to specific slide
    function goToSlide(index) {
        // Remove active class from all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Add active class to current testimonial
        testimonials[index].classList.add('active');
        
        currentIndex = index;
        updateIndicators();
    }
    
    // Function to go to next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        goToSlide(currentIndex);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        goToSlide(currentIndex);
    }
    
    // Function to update indicators
    function updateIndicators() {
        const allIndicators = document.querySelectorAll('.slider-indicators .indicator');
        allIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
}

// Product Size Selection Functionality
function initProductSizes() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Find parent size options container
            const container = option.closest('.size-options');
            
            // Remove active class from all options in this container
            container.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            option.classList.add('active');
        });
    });
}

// Product history tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all history tabs and content
    const historyTabs = document.querySelectorAll('.history-tab');
    const historyContents = document.querySelectorAll('.history-content');
    const historySection = document.getElementById('history');
    
    // If we don't have the history section or tabs, exit early
    if (!historySection || historyTabs.length === 0) {
        console.log('History section or tabs not found');
        return;
    }
    
    // Add click event to each tab
    historyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            historyTabs.forEach(t => t.classList.remove('active'));
            historyContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the corresponding content and make it active
            const historyType = tab.getAttribute('data-history');
            const content = document.getElementById(`${historyType}-history`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    
    // Set the first tab as active by default if none are active
    if (!document.querySelector('.history-tab.active') && historyTabs.length > 0) {
        historyTabs[0].click();
    }
    
    // Add "View History" functionality to product cards
    document.querySelectorAll('.product-button, .cta-button').forEach(button => {
        // We'll only modify buttons with text that includes "Learn More" or "View Details" or "Order Now"
        if (button.textContent.includes('Learn More') || button.textContent.includes('View Details') || button.textContent.includes('Order Now')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Determine which product is related to this button
                let productType = '';
                const productCard = this.closest('.product-card') || this.closest('.product-detail');
                
                if (productCard) {
                    const productTitle = productCard.querySelector('h3')?.textContent.toLowerCase() || 
                                        productCard.querySelector('h2')?.textContent.toLowerCase() || '';
                    
                    if (productTitle.includes('cashew')) {
                        productType = 'cashews';
                    } else if (productTitle.includes('tiger nut')) {
                        productType = 'tiger-nuts';
                    } else if (productTitle.includes('dragon')) {
                        productType = 'dragon-fruit';
                    } else if (productTitle.includes('wambugu')) {
                        productType = 'wambugu-apples';
                    }
                }
                
                // If we identified a product type, navigate to the history section
                if (productType) {
                    // Scroll to history section
                    const historySection = document.getElementById('history');
                    if (historySection) {
                        historySection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Click the appropriate tab after a short delay to allow scrolling
                        setTimeout(() => {
                            const targetTab = document.querySelector(`.history-tab[data-history="${productType}"]`);
                            if (targetTab) {
                                targetTab.click();
                            }
                        }, 800);
                    }
                }
            });
        }
    });

    // Add a "View History" button to product cards that don't have one
    document.querySelectorAll('.product-card-content').forEach(card => {
        if (!card.querySelector('.view-history-btn')) {
            const productTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
            let productType = '';
            
            if (productTitle.includes('cashew')) {
                productType = 'cashews';
            } else if (productTitle.includes('tiger nut') || productTitle.includes('tiger nuts')) {
                productType = 'tiger-nuts';
            } else if (productTitle.includes('dragon')) {
                productType = 'dragon-fruit';
            } else if (productTitle.includes('wambugu')) {
                productType = 'wambugu-apples';
            }
            
            if (productType) {
                const priceDiv = card.querySelector('.product-price');
                if (priceDiv) {
                    const viewHistoryBtn = document.createElement('button');
                    viewHistoryBtn.className = 'view-history-btn';
                    viewHistoryBtn.innerHTML = '<i class="fas fa-book-open"></i> View History';
                    
                    // Apply the same styles as product-button
                    viewHistoryBtn.style.cssText = `
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        background: transparent;
                        color: var(--primary-color);
                        border: 1px solid var(--primary-color);
                        border-radius: 20px;
                        font-size: 0.85rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-left: 10px;
                    `;
                    
                    viewHistoryBtn.addEventListener('mouseover', function() {
                        this.style.background = 'var(--primary-color)';
                        this.style.color = 'white';
                    });
                    
                    viewHistoryBtn.addEventListener('mouseout', function() {
                        this.style.background = 'transparent';
                        this.style.color = 'var(--primary-color)';
                    });
                    
                    viewHistoryBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Scroll to history section
                        const historySection = document.getElementById('history');
                        historySection.scrollIntoView({ behavior: 'smooth' });
                        
                        // Click the appropriate tab after a short delay
                        setTimeout(() => {
                            const targetTab = document.querySelector(`.history-tab[data-history="${productType}"]`);
                            if (targetTab) {
                                targetTab.click();
                            }
                        }, 800);
                    });
                    
                    priceDiv.appendChild(viewHistoryBtn);
                }
            }
        }
    });
});

// Add "View History" buttons to detailed product pages
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-detail').forEach(detail => {
        const actionArea = detail.querySelector('.product-sizes');
        if (actionArea) {
            const title = detail.querySelector('h2')?.textContent.toLowerCase() || '';
            let productType = '';
            
            if (title.includes('cashew')) {
                productType = 'cashews';
            } else if (title.includes('tiger nut') || title.includes('tiger nuts')) {
                productType = 'tiger-nuts';
            }
            
            if (productType) {
                const viewHistoryBtn = document.createElement('button');
                viewHistoryBtn.className = 'view-history-btn';
                viewHistoryBtn.innerHTML = '<i class="fas fa-book-open"></i> View History';
                viewHistoryBtn.style.marginLeft = '10px';
                
                // Match the style of other buttons
                viewHistoryBtn.style.cssText = `
                    display: inline-block;
                    padding: 0.8rem 1.5rem;
                    background: transparent;
                    color: var(--primary-color);
                    border: 2px solid var(--primary-color);
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-left: 10px;
                `;
                
                viewHistoryBtn.addEventListener('mouseover', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                
                viewHistoryBtn.addEventListener('mouseout', function() {
                    this.style.background = 'transparent';
                    this.style.color = 'var(--primary-color)';
                });
                
                viewHistoryBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Scroll to history section
                    const historySection = document.getElementById('history');
                    historySection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Click the appropriate tab after a short delay
                    setTimeout(() => {
                        const targetTab = document.querySelector(`.history-tab[data-history="${productType}"]`);
                        if (targetTab) {
                            targetTab.click();
                        }
                    }, 800);
                });
                
                const orderButton = actionArea.querySelector('.cta-button');
                if (orderButton) {
                    orderButton.parentNode.insertBefore(viewHistoryBtn, orderButton.nextSibling);
                } else {
                    actionArea.appendChild(viewHistoryBtn);
                }
            }
        }
    });
});

// Learn More Button Functionality
function initLearnMoreButtons() {
    const learnMoreButtons = document.querySelectorAll('.product-button, button[class^="learn"]');
    
    if (!learnMoreButtons.length) return;

    // Check if modal already exists, if not create it
    let productModal = document.getElementById('product-detail-modal');
    if (!productModal) {
        productModal = document.createElement('div');
        productModal.id = 'product-detail-modal';
        productModal.className = 'modal';
        productModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="product-detail-container">
                    <div class="product-detail-image"></div>
                    <div class="product-detail-info">
                        <span class="product-category-tag"></span>
                        <h2 class="product-title"></h2>
                        <div class="product-rating"></div>
                        <div class="product-price-detail"></div>
                        <div class="product-description-long"></div>
                        <h3>Key Benefits</h3>
                        <ul class="product-benefits"></ul>
                        <h3>Nutrition Facts</h3>
                        <div class="product-nutrition"></div>
                        <div class="product-detail-actions">
                            <button class="modal-cta-button">Add to Cart</button>
                            <button class="view-history-button">View Product History</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(productModal);

        // Add event listener to close modal
        const closeButton = productModal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            productModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === productModal) {
                productModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Product details database - this would typically come from a backend API
    const productDetails = {
        'Tiger Nut Milk': {
            category: 'Beverages',
            image: 'images/tigernut1.jpg',
            rating: 4,
            price: '$5.99',
            description: 'Our signature Tiger Nut Milk is a delicious, dairy-free alternative that\'s packed with essential nutrients. Made from organic tiger nuts sourced directly from our sustainable farms in Ghana, this milk delivers a naturally sweet taste with notes of vanilla and cinnamon.',
            benefits: [
                'Dairy-free and suitable for vegan diets',
                'No added sugars or artificial ingredients',
                'Excellent source of vitamins E, C and minerals',
                'Supports digestive health with prebiotic fiber',
                'Sustainable production that supports local communities'
            ],
            nutrition: `
                <div class="nutrition-fact"><span>Calories:</span> 120 per cup</div>
                <div class="nutrition-fact"><span>Protein:</span> 2g</div>
                <div class="nutrition-fact"><span>Healthy Fats:</span> 7g</div>
                <div class="nutrition-fact"><span>Fiber:</span> 3.5g</div>
                <div class="nutrition-fact"><span>Calcium:</span> 25% DV</div>
            `,
            history: 'tiger-nuts'
        },
        'Frozen Desserts': {
            category: 'Desserts',
            image: 'images/tigernut2.jpg',
            rating: 4.5,
            price: '$7.99',
            description: 'Our plant-based frozen treats are the perfect guilt-free indulgence. Made with our signature tiger nut milk, organic fruits, and natural sweeteners, these desserts deliver the creamy satisfaction of premium ice cream without dairy or artificial additives.',
            benefits: [
                'Dairy-free and vegan friendly',
                'No artificial colors, flavors, or preservatives',
                'Lower in sugar than conventional ice cream',
                'Available in various flavors: Vanilla Bean, Chocolate Dream, Tropical Mango, and Berry Bliss',
                'Sustainable packaging made from recycled materials'
            ],
            nutrition: `
                <div class="nutrition-fact"><span>Calories:</span> 150 per serving</div>
                <div class="nutrition-fact"><span>Protein:</span> 3g</div>
                <div class="nutrition-fact"><span>Healthy Fats:</span> 8g</div>
                <div class="nutrition-fact"><span>Fiber:</span> 4g</div>
                <div class="nutrition-fact"><span>Sugar:</span> 12g (all from natural sources)</div>
            `,
            history: 'tiger-nuts'
        },
        'Baked Goods': {
            category: 'Baking',
            image: 'images/tigernut4.jpg',
            rating: 5,
            price: '$6.49',
            description: 'Our tiger nut flour is the perfect gluten-free baking alternative for health-conscious food lovers. With a naturally sweet taste and high nutrient profile, it\'s ideal for making nutrient-dense cookies, breads, pancakes, and more - while supporting sustainable farming practices.',
            benefits: [
                'Gluten-free and grain-free',
                'Rich in resistant starch for gut health',
                'Natural sweetness reduces need for added sugar',
                'Higher in fiber and protein than conventional flours',
                'Versatile for both sweet and savory recipes'
            ],
            nutrition: `
                <div class="nutrition-fact"><span>Calories:</span> 110 per 1/4 cup</div>
                <div class="nutrition-fact"><span>Protein:</span> 2.5g</div>
                <div class="nutrition-fact"><span>Carbohydrates:</span> 18g</div>
                <div class="nutrition-fact"><span>Fiber:</span> 5g</div>
                <div class="nutrition-fact"><span>Iron:</span> 15% DV</div>
            `,
            history: 'tiger-nuts'
        }
    };

    // Add event listeners to each Learn More button
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Find the product name
            let productCard = button.closest('.product-card');
            if (!productCard) {
                // Try to find in the format shown in the screenshot
                productCard = button.closest('.product-card-content') || 
                              button.closest('[class*="product"]');
            }
            
            // Get product name from the card's heading
            let productName;
            const headingElement = productCard ? 
                                  (productCard.querySelector('h3') || productCard.querySelector('h2')) : 
                                  null;
            
            if (headingElement) {
                productName = headingElement.textContent.trim();
            } else {
                // If we can't find the product name in the DOM structure, 
                // try to get it from parent element
                const parentSection = button.closest('section');
                if (parentSection) {
                    const heading = parentSection.querySelector('h2, h3');
                    if (heading) {
                        productName = heading.textContent.trim();
                    }
                }
            }
            
            // If we found a product name and have details for it
            if (productName && productDetails[productName]) {
                const details = productDetails[productName];
                
                // Populate modal with product details
                const modal = document.getElementById('product-detail-modal');
                
                // Set product image
                modal.querySelector('.product-detail-image').style.backgroundImage = `url('${details.image}')`;
                
                // Set product category
                modal.querySelector('.product-category-tag').textContent = details.category;
                
                // Set product title
                modal.querySelector('.product-title').textContent = productName;
                
                // Set product price
                modal.querySelector('.product-price-detail').textContent = details.price;
                
                // Set product rating
                const ratingElement = modal.querySelector('.product-rating');
                ratingElement.innerHTML = '';
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('i');
                    if (i <= Math.floor(details.rating)) {
                        star.className = 'fas fa-star';
                    } else if (i - 0.5 <= details.rating) {
                        star.className = 'fas fa-star-half-alt';
                    } else {
                        star.className = 'far fa-star';
                    }
                    ratingElement.appendChild(star);
                }
                
                // Set product description
                modal.querySelector('.product-description-long').textContent = details.description;
                
                // Set product benefits
                const benefitsList = modal.querySelector('.product-benefits');
                benefitsList.innerHTML = '';
                details.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check-circle"></i> ${benefit}`;
                    benefitsList.appendChild(li);
                });
                
                // Set product nutrition
                modal.querySelector('.product-nutrition').innerHTML = details.nutrition;
                
                // Set up View History button
                const historyButton = modal.querySelector('.view-history-button');
                if (details.history) {
                    historyButton.style.display = 'inline-block';
                    historyButton.addEventListener('click', () => {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        
                        const historySection = document.getElementById('history');
                        if (historySection) {
                            historySection.scrollIntoView({ behavior: 'smooth' });
                            
                            // Click the appropriate tab after a delay
                            setTimeout(() => {
                                const targetTab = document.querySelector(`.history-tab[data-history="${details.history}"]`);
                                if (targetTab) {
                                    targetTab.click();
                                }
                            }, 800);
                        }
                    });
                } else {
                    historyButton.style.display = 'none';
                }
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
}

// Benefits Carousel Functionality
function initBenefitsCarousel() {
    const carousel = document.querySelector('.benefits-carousel');
    const cards = document.querySelectorAll('.benefits-carousel .benefit-card');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (!carousel || !cards.length) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    let autoScrollInterval;
    let isPaused = false;
    
    // Calculate how many cards to show based on viewport width
    function getVisibleCards() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1200) return 3;
        if (viewportWidth >= 768) return 2;
        return 1;
    }
    
    // Update carousel position
    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const cardWidth = carousel.offsetWidth / visibleCards;
        const offset = -currentIndex * cardWidth;
        
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }
    
    // Start auto scrolling
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!isPaused) nextSlide();
        }, 3500); // Change slide every 3.5 seconds
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        isPaused = true;
        setTimeout(() => { isPaused = false; }, 5000);
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        isPaused = true;
        setTimeout(() => { isPaused = false; }, 5000);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 5000);
        });
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    carousel.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Initial setup
    updateCarousel();
    startAutoScroll();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
} 