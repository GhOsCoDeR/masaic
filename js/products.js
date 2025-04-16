document.addEventListener('DOMContentLoaded', () => {
    // Initialize product filtering
    initProductFilters();
    
    // Initialize nutritional tabs
    initNutritionalTabs();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize product size selection
    initProductSizes();
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
        currentIndex = index;
        updateSlider();
    }
    
    // Function to go to next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
    }
    
    // Function to go to previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    }
    
    // Function to update slider display
    function updateSlider() {
        // Update testimonial positions
        testimonials.forEach((testimonial, index) => {
            testimonial.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
            testimonial.classList.toggle('active', index === currentIndex);
        });
        
        // Update indicators
        const allIndicators = document.querySelectorAll('.slider-indicators .indicator');
        allIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Initialize slider
    updateSlider();
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