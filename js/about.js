document.addEventListener('DOMContentLoaded', () => {
    // Initialize the values carousel
    initValuesCarousel();
    
    // Initialize timeline animations
    initTimelineAnimations();
});

// Values Carousel Functionality
function initValuesCarousel() {
    const carousel = document.querySelector('.values-carousel');
    const carouselContainer = document.querySelector('.values-carousel-container');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.indicator');
    const cards = carousel.querySelectorAll('.value-card');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    let autoSlide = true;
    let slideInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Initialize by setting the first card as active
    cards[0].classList.add('active');
    
    // Get the number of cards
    const cardCount = cards.length;
    
    // Calculate the visible count based on container width
    const getVisibleCount = () => {
        const containerWidth = carouselContainer.offsetWidth;
        const cardWidth = cards[0].offsetWidth + 24; // Card width + gap
        return Math.floor(containerWidth / cardWidth);
    };
    
    // Start the auto-slide
    startAutoSlide();
    
    // Function to start auto-slide
    function startAutoSlide() {
        if (autoSlide) {
            slideInterval = setInterval(() => {
                moveToNextCard();
            }, 4000);
        }
    }
    
    // Function to stop auto-slide
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Function to move to a specific card
    function moveToCard(index) {
        currentIndex = index;
        
        // Update active card class
        cards.forEach((card, i) => {
            if (i === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update indicators
        updateIndicators();
        
        // Move the carousel
        const cardWidth = cards[0].offsetWidth + 24; // Card width + gap
        const visibleCount = getVisibleCount();
        const offset = Math.min(currentIndex, cardCount - visibleCount);
        
        carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        carousel.style.transform = `translateX(-${offset * cardWidth}px)`;
    }
    
    // Function to move to the next card
    function moveToNextCard() {
        let nextIndex = (currentIndex + 1) % cardCount;
        moveToCard(nextIndex);
    }
    
    // Function to move to the previous card
    function moveToPrevCard() {
        let prevIndex = (currentIndex - 1 + cardCount) % cardCount;
        moveToCard(prevIndex);
    }
    
    // Function to update indicators
    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Event listeners for the buttons
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        moveToPrevCard();
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        moveToNextCard();
        startAutoSlide();
    });
    
    // Event listeners for the indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            moveToCard(index);
            startAutoSlide();
        });
    });
    
    // Event listeners for mouse interaction
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    carousel.addEventListener('mousemove', drag);
    
    // Event listeners for touch interaction
    carousel.addEventListener('touchstart', dragStart);
    carousel.addEventListener('touchend', dragEnd);
    carousel.addEventListener('touchcancel', dragEnd);
    carousel.addEventListener('touchmove', drag);
    
    // Add click events to cards
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            stopAutoSlide();
            moveToCard(index);
            startAutoSlide();
        });
    });
    
    // Functions for drag interaction
    function dragStart(e) {
        e.preventDefault();
        isDragging = true;
        startPos = getPositionX(e);
        prevTranslate = currentTranslate;
        carousel.style.transition = 'none';
    }
    
    function drag(e) {
        if (isDragging) {
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startPos;
            carousel.style.transform = `translateX(${currentTranslate}px)`;
        }
    }
    
    function dragEnd() {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        
        // Determine which card to snap to based on drag distance
        if (movedBy < -50) {
            stopAutoSlide();
            moveToNextCard();
            startAutoSlide();
        } else if (movedBy > 50) {
            stopAutoSlide();
            moveToPrevCard();
            startAutoSlide();
        } else {
            moveToCard(currentIndex);
        }
        
        carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // Event listener for window resize
    window.addEventListener('resize', () => {
        // Update the carousel position on resize
        moveToCard(currentIndex);
    });
    
    // Initialize the carousel
    moveToCard(0);
}

// Timeline Animation Functionality
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add a slight delay before activating the dot animation
                setTimeout(() => {
                    const dot = entry.target.querySelector('.timeline-dot');
                    if (dot) {
                        dot.classList.add('animated');
                    }
                }, 300);
                
                // Optional: Stop observing the element after it's animated
                // observer.unobserve(entry.target);
            } else {
                // Reset animations when scrolling back up (optional)
                if (window.scrollY < entry.target.offsetTop) {
                    entry.target.classList.remove('active');
                    const dot = entry.target.querySelector('.timeline-dot');
                    if (dot) {
                        dot.classList.remove('animated');
                    }
                }
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of the item is visible
        rootMargin: '-100px 0px' // trigger when item is 100px into the viewport
    });
    
    // Observe all timeline items
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Add hover effect for timeline content
    timelineItems.forEach(item => {
        const content = item.querySelector('.timeline-content');
        if (content) {
            content.addEventListener('mouseenter', () => {
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.add('hover');
                }
            });
            
            content.addEventListener('mouseleave', () => {
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.remove('hover');
                }
            });
        }
    });
    
    // Trigger animations for items in viewport on page load
    setTimeout(() => {
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.8) {
                item.classList.add('active');
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.add('animated');
                }
            }
        });
    }, 500);
} 