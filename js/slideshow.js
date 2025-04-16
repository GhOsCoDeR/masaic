document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('slideshowModal');
    const storyButton = document.querySelector('.cta-button-outline');
    const closeBtn = document.querySelector('.close-modal');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const playPauseBtn = document.querySelector('.play-pause');
    
    let slideIndex = 0;
    let slideInterval;
    let isPlaying = false;
    const slideShowSpeed = 3000; // Time between slides in ms
    
    // Initialize slides - hide all slides except the first one
    function initSlides() {
        slides.forEach((slide, index) => {
            slide.style.display = 'none';
            if (index === 0) {
                slide.style.display = 'block';
                slide.classList.add('active');
            }
        });
    }
    
    // Show a specific slide
    function showSlide(n) {
        // Reset index if out of bounds
        if (n >= slides.length) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex = n;
        }
        
        // Remove active class from all slides and indicators
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Set active slide and indicator
        slides[slideIndex].style.display = 'block';
        setTimeout(() => {
            slides[slideIndex].classList.add('active');
        }, 10);
        indicators[slideIndex].classList.add('active');
    }
    
    // Next/Prev slide handlers
    function nextSlide() {
        showSlide(slideIndex + 1);
    }
    
    function prevSlide() {
        showSlide(slideIndex - 1);
    }
    
    // Start/Stop slideshow
    function startSlideshow() {
        if (!isPlaying) {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            slideInterval = setInterval(nextSlide, slideShowSpeed);
        }
    }
    
    function stopSlideshow() {
        if (isPlaying) {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            clearInterval(slideInterval);
        }
    }
    
    function togglePlayPause() {
        if (isPlaying) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    }
    
    // Event Listeners
    
    // Open modal when "Watch Our Story" button is clicked
    storyButton.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Initialize slideshow and start automatic playback
        initSlides();
        showSlide(0);
        startSlideshow();
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        stopSlideshow();
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    // Close modal if clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            stopSlideshow();
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', function() {
        stopSlideshow();
        prevSlide();
    });
    
    nextBtn.addEventListener('click', function() {
        stopSlideshow();
        nextSlide();
    });
    
    // Indicator dots
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopSlideshow();
            showSlide(index);
        });
    });
    
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            stopSlideshow();
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        } else if (e.key === 'ArrowLeft') {
            stopSlideshow();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            stopSlideshow();
            nextSlide();
        } else if (e.key === ' ') {
            // Space bar for play/pause
            togglePlayPause();
            e.preventDefault(); // Prevent page scroll
        }
    });
    
    // Stop slideshow when window loses focus
    window.addEventListener('blur', stopSlideshow);
}); 