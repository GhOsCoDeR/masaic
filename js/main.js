// Mobile Navigation - Fixed and Enhanced
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinks) {
        // Toggle navigation menu with improved handling
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (navLinks.classList.contains('active') && !isClickInsideNav && !isClickOnHamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when a link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Ensure mobile menu also works on About and Blog pages
// This is needed because those pages may have their own JavaScript that conflicts
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on About or Blog page by looking for specific elements
    const isAboutPage = document.querySelector('.about-section') !== null;
    const isBlogPage = document.querySelector('.blog-hero') !== null;
    
    if (isAboutPage || isBlogPage) {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            // Remove any existing click event listeners (to avoid conflicts)
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);
            
            // Add our event listener
            newHamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                newHamburger.classList.toggle('active');
                
                if (navLinks.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    // Add About page specific functionality that was previously inline
    if (isAboutPage) {
        // Add js-enabled class to body
        document.body.classList.add('js-enabled');
        
        // Timeline animations
        const timelineItems = document.querySelectorAll('.timeline-item.animate');
        
        function checkTimeline() {
            timelineItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                const triggerPoint = window.innerHeight * 0.8;
                
                if (itemTop < triggerPoint) {
                    item.classList.add('active');
                }
            });
        }
        
        // Check timeline on scroll
        window.addEventListener('scroll', checkTimeline);
        
        // Initial check
        checkTimeline();
        
        // Values carousel functionality
        const valueCards = document.querySelectorAll('.value-card');
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        const indicators = document.querySelectorAll('.indicator');
        let activeIndex = 0;
        
        function updateCarousel() {
            if (!valueCards.length) return;
            
            const cardWidth = valueCards[0].offsetWidth;
            const carousel = document.querySelector('.values-carousel');
            const offset = -activeIndex * (cardWidth + 24); // Includes gap
            
            if (carousel) {
                carousel.style.transform = `translateX(${offset}px)`;
            
                // Update active classes
                valueCards.forEach(card => card.classList.remove('active'));
                if (valueCards[activeIndex]) {
                    valueCards[activeIndex].classList.add('active');
                }
                
                // Update indicators
                indicators.forEach((ind, index) => {
                    ind.classList.toggle('active', index === activeIndex);
                });
            }
        }
        
        // Initialize carousel
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
        
        // Event listeners for navigation
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                activeIndex = Math.max(0, activeIndex - 1);
                updateCarousel();
            });
            
            nextButton.addEventListener('click', () => {
                activeIndex = Math.min(valueCards.length - 1, activeIndex + 1);
                updateCarousel();
            });
            
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    activeIndex = index;
                    updateCarousel();
                });
            });
        }
        
        // Keyboard accessibility for hamburger menu
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    hamburger.click();
                }
            });
        }
        
        // Close menu when escape key is pressed
        document.addEventListener('keydown', function(e) {
            const navLinks = document.querySelector('.nav-links');
            if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
                hamburger.click();
            }
        });
    }
    
    // Add Blog page specific functionality that was previously inline
    if (isBlogPage) {
        // Category filter functionality
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Here you would typically filter the posts based on category
                // For demo purposes we'll just log to console
                console.log(`Filtering by: ${this.textContent}`);
                
                // Future implementation: Filter posts based on category
                // const category = this.textContent.trim();
                // const posts = document.querySelectorAll('.blog-post');
                // posts.forEach(post => {
                //     const postCategory = post.querySelector('.post-category').textContent;
                //     if (category === 'All' || postCategory === category) {
                //         post.style.display = 'block';
                //     } else {
                //         post.style.display = 'none';
                //     }
                // });
            });
        });
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Check if the target element exists before scrolling
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.boxShadow = 'none';
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

// Form Validation
const contactForm = document.querySelector('.contact-form form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    if (name && email && message) {
        // Here you would typically send the form data to a server
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    } else {
        alert('Please fill in all fields.');
    }
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