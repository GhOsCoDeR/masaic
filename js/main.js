// Mobile Menu Toggle - ENHANCED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinks) {
        // Toggle navigation menu
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Add animation delay to each nav link for staggered effect
            const navItems = document.querySelectorAll('.nav-links a');
            navItems.forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
            
            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks && navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when a link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu on window resize (if desktop view is triggered)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.8;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            } else if (elementTop > window.innerHeight) {
                // Optional: Remove active class when scrolled out of view
                // element.classList.remove('active');
            }
        });
    }
    
    // Initial check on page load
    setTimeout(checkReveal, 300);
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
    
    // Smooth scrolling for anchor links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Check on load
    handleScroll();
    
    // Check on scroll
    window.addEventListener('scroll', handleScroll);

    // Touch swipe detection for sliders
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliders = document.querySelectorAll('.slider, .carousel');
    
    sliders.forEach(slider => {
        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(slider);
        }, {passive: true});
    });
    
    function handleSwipe(slider) {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            // Find the next/prev buttons in this specific slider
            const nextBtn = slider.querySelector('.next-btn, .carousel-next');
            const prevBtn = slider.querySelector('.prev-btn, .carousel-prev');
            
            if (swipeDistance < 0 && nextBtn) {
                // Swipe left - go next
                nextBtn.click();
            } else if (swipeDistance > 0 && prevBtn) {
                // Swipe right - go prev
                prevBtn.click();
            }
        }
    }
    
    // Fast click for mobile
    document.addEventListener('touchstart', function(){}, {passive: true});
    
    // Product Category Tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-category');
                // Add filtering logic here if needed
            });
        });
    }
    
    // Nutrition Tabs
    const nutritionTabs = document.querySelectorAll('.nutrition-tab');
    if (nutritionTabs.length > 0) {
        nutritionTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                nutritionTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const product = this.getAttribute('data-product');
                // Add nutrition data switching logic here
            });
        });
    }
    
    // Product Size Options
    const sizeOptions = document.querySelectorAll('.size-option');
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const parent = this.closest('.size-options');
                parent.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Blog Category Filters
    const categoryFilters = document.querySelectorAll('.category-btn');
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                categoryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-category');
                // Add post filtering logic here if needed
            });
        });
    }
    
    // Map Initialization (for Contact page)
    function initMap() {
        // Coordinates for a location in Ghana (example: Accra)
        const mosaicLocation = { lat: 5.6037, lng: -0.1870 };
        
        // Create map centered at Mosaic Grove location
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: mosaicLocation,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#c9c9c9"}]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                }
            ]
        });
        
        // Add marker for Mosaic Grove location
        const marker = new google.maps.Marker({
            position: mosaicLocation,
            map: map,
            title: "Mosaic Grove",
            animation: google.maps.Animation.DROP
        });
        
        // Add info window
        const infowindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>Mosaic Grove</h3>
                    <p>Sustainable Agriculture Hub</p>
                    <p>123 Farm Road, Accra, Ghana</p>
                </div>
            `
        });
        
        // Open info window when marker is clicked
        marker.addListener("click", () => {
            infowindow.open(map, marker);
        });
    }
    
    // Load map when the page is contact.html
    if (window.location.pathname.includes('contact')) {
        // Check if Google Maps API is loaded
        if (typeof google !== 'undefined') {
            initMap();
        } else {
            // If not loaded yet, wait for it
            window.initMap = initMap;
        }
    }
    
    // Add to Cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Add to cart animation or notification
                alert('Product added to cart!');
            });
        });
    }
    
    // Wishlist toggle
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    if (wishlistBtns.length > 0) {
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Toggle wishlist heart
                const heart = this.querySelector('i');
                heart.classList.toggle('far');
                heart.classList.toggle('fas');
            });
        });
    }
    
    // Timeline animation (if on About page)
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        window.addEventListener('scroll', function() {
            timelineItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                if (itemTop < window.innerHeight * 0.8) {
                    item.classList.add('animate');
                }
            });
        });
    }

    // Add "active" class to current page in navigation
    const currentLocation = window.location.pathname;
    const headerNavLinks = document.querySelectorAll('.nav-links a');
    
    headerNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation.split('/').pop() || 
            (link.getAttribute('href') === 'index.html' && (currentLocation === '/' || currentLocation.endsWith('/')))) {
            link.classList.add('active');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formMessageContainer = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Basic validation
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(emailInput.value)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission success
            // In a real application, you would send the form data to a server here
            setTimeout(() => {
                showMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
                contactForm.reset();
            }, 1000);
        });
    }
    
    function showMessage(message, type) {
        if (formMessageContainer) {
            formMessageContainer.textContent = message;
            formMessageContainer.className = 'form-message';
            formMessageContainer.classList.add(`form-message-${type}`);
            formMessageContainer.style.display = 'block';
            
            // Auto hide message after 5 seconds
            setTimeout(() => {
                formMessageContainer.style.opacity = '0';
                setTimeout(() => {
                    formMessageContainer.style.display = 'none';
                    formMessageContainer.style.opacity = '1';
                }, 500);
            }, 5000);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Product filtering
    // ... existing code ...
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'var(--white)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Product Card Hover Effect
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
});

// Counter Animation for Impact Stats
const statCards = document.querySelectorAll('.stat-card h3');

const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const value = parseInt(target.textContent);
            animateValue(target, 0, value, 2000);
            observer.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statCards.forEach(card => observer.observe(card));

// Hero Slideshow Functionality
document.addEventListener('DOMContentLoaded', function() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    if (heroSlides.length > 0) {
        // Make sure first slide is active
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroSlides[0].classList.add('active');
        
        function showSlide(index) {
            // Hide all slides
            heroSlides.forEach(slide => slide.classList.remove('active'));
            
            // Show the specified slide
            heroSlides[index].classList.add('active');
            currentSlide = index;
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % heroSlides.length;
            showSlide(currentSlide);
        }
        
        // Change slide every 5 seconds
        const slideInterval = setInterval(nextSlide, 5000);
        
        // Add event listeners to pause slideshow when interacting with hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            heroSection.addEventListener('mouseleave', () => {
                setInterval(nextSlide, 5000);
            });
        }
    }
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    // We don't manipulate backgroundPositionY directly anymore since we're using slides
});

// Enhanced Timeline Animation - fixed version
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimeline() {
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const delay = index * 200; // Add delay for cascade effect
            
            if (itemTop < windowHeight * 0.8) {
                setTimeout(() => {
                    item.classList.add('animate');
                }, delay);
            }
        });
    }
    
    // Run on page load
    window.addEventListener('load', function() {
        // Force initial animation after page loads
        setTimeout(animateTimeline, 100);
    });
    
    // Run on scroll
    window.addEventListener('scroll', animateTimeline);
});

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (name === '' || email === '' || message === '') {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real application, you would send data to a server here
            // This is a simulation for demonstration purposes
            setTimeout(() => {
                showFormMessage('Your message has been sent successfully!', 'success');
                contactForm.reset();
            }, 1000);
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show form message
    function showFormMessage(text, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type === 'success' ? 'form-message-success' : 'form-message-error'}`;
        messageElement.textContent = text;
        
        // Insert after the form
        const formContainer = document.querySelector('.contact-form');
        if (formContainer) {
            formContainer.appendChild(messageElement);
            
            // Auto-remove the message after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
}); 