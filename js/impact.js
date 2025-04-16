document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter animation
    initCounterAnimation();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize SDG cards hover effect
    initSDGCards();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Load the Google Maps script
    loadGoogleMapsScript();
});

// Counter animation for impact stats
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    // Animate only when visible in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // Animation duration in milliseconds
                const startTime = performance.now();
                const startValue = 0;
                
                function updateCounter(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    
                    if (elapsedTime < duration) {
                        const progress = elapsedTime / duration;
                        const easedProgress = easeOutQuart(progress);
                        const current = Math.floor(startValue + (target - startValue) * easedProgress);
                        counter.textContent = current + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.1
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Easing function for smoother animation
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Testimonial slider functionality
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    let currentIndex = 0;

    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected slide and activate its dot
        testimonialSlides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
    });

    // Add click event to prev button
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? testimonialSlides.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
    });

    // Add click event to next button
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex === testimonialSlides.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
    });

    // Auto-advance slides every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex === testimonialSlides.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
    }, 5000);
}

// SDG Cards hover effect
function initSDGCards() {
    const sdgCards = document.querySelectorAll('.sdg-card');
    
    sdgCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            
            const icon = card.querySelector('.sdg-icon');
            icon.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            
            const icon = card.querySelector('.sdg-icon');
            icon.style.transform = 'scale(1)';
        });
    });
}

// Scroll animation for elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.impact-card, .program-card, .story-card, .sdg-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// SDG Carousel Controls
const sdgSlider = document.querySelector('.sdg-slider');
const sdgDots = document.querySelectorAll('.sdg-dot');
const prevSDGButton = document.querySelector('.prev-sdg');
const nextSDGButton = document.querySelector('.next-sdg');
let sdgPaused = false;

// Pause animation on hover
if (sdgSlider) {
    sdgSlider.addEventListener('mouseenter', () => {
        sdgSlider.style.animationPlayState = 'paused';
        sdgPaused = true;
    });

    sdgSlider.addEventListener('mouseleave', () => {
        if (!sdgPaused) {
            sdgSlider.style.animationPlayState = 'running';
        }
    });
}

// Handle SDG Dots Click
if (sdgDots) {
    sdgDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Remove active class from all dots
            sdgDots.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked dot
            dot.classList.add('active');
            
            // Calculate position to scroll to
            const scrollPosition = index * (300 + 40); // card width + margins
            sdgSlider.style.transform = `translateX(-${scrollPosition}px)`;
            sdgSlider.style.animation = 'none';
            sdgPaused = true;
        });
    });
}

// Handle prev/next buttons for SDG carousel
if (prevSDGButton && nextSDGButton) {
    let currentSDGPosition = 0;
    const cardWidth = 320; // card width + margins

    prevSDGButton.addEventListener('click', () => {
        if (currentSDGPosition > 0) {
            currentSDGPosition -= cardWidth;
            sdgSlider.style.transform = `translateX(-${currentSDGPosition}px)`;
            sdgSlider.style.animation = 'none';
            sdgPaused = true;
            
            // Update active dot
            const activeDotIndex = Math.floor(currentSDGPosition / (cardWidth * 2));
            sdgDots.forEach(d => d.classList.remove('active'));
            if (sdgDots[activeDotIndex]) {
                sdgDots[activeDotIndex].classList.add('active');
            }
        }
    });

    nextSDGButton.addEventListener('click', () => {
        const maxPosition = (document.querySelectorAll('.sdg-card').length / 2 - 4) * cardWidth;
        if (currentSDGPosition < maxPosition) {
            currentSDGPosition += cardWidth;
            sdgSlider.style.transform = `translateX(-${currentSDGPosition}px)`;
            sdgSlider.style.animation = 'none';
            sdgPaused = true;
            
            // Update active dot
            const activeDotIndex = Math.floor(currentSDGPosition / (cardWidth * 2));
            sdgDots.forEach(d => d.classList.remove('active'));
            if (sdgDots[activeDotIndex]) {
                sdgDots[activeDotIndex].classList.add('active');
            }
        }
    });
}

// Animate counters in impact stats
const counters = document.querySelectorAll('.counter');
const counterSpeed = 200; // Lower is faster

function startCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/[^\d]/g, '');
        const increment = target / counterSpeed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment) + '+';
            setTimeout(startCounters, 1);
        } else {
            counter.innerText = target + '+';
        }
    });
}

// Start counters when user scrolls to them
const statsSection = document.querySelector('.impact-stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounters();
            observer.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Google Maps initialization
function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?callback=initMap";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize Google Maps
function initMap() {
    // Center map on Ghana
    const ghana = { lat: 7.9465, lng: -1.0232 };
    
    // Create map
    const mapElement = document.getElementById("ghana-map");
    if (!mapElement) return;
    
    const map = new google.maps.Map(mapElement, {
        zoom: 7,
        center: ghana,
        mapTypeId: "terrain",
        styles: [
            {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ color: "#2E7D32" }, { weight: 2 }]
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#cfe8fc" }]
            },
            {
                featureType: "landscape",
                elementType: "geometry.fill",
                stylers: [{ color: "#f5f5f5" }]
            }
        ]
    });
    
    // Define Ghana locations
    const locations = [
        {
            position: { lat: 5.6037, lng: -0.1870 }, // Greater Accra
            type: "primary",
            title: "Accra Farming Community",
            description: "Supporting over 150 small-scale farmers with sustainable practices and market access."
        },
        {
            position: { lat: 6.6885, lng: -1.6244 }, // Kumasi
            type: "primary",
            title: "Kumasi Tiger Nut Farmers",
            description: "Working with local farmers to improve tiger nut cultivation and processing."
        },
        {
            position: { lat: 9.4077, lng: -0.8362 }, // Tamale
            type: "primary",
            title: "Northern Farmers Collective",
            description: "Collaborative farming initiatives in Ghana's northern region."
        },
        {
            position: { lat: 5.9046, lng: 0.0076 }, // Eastern Region
            type: "secondary",
            title: "Koforidua Training Center",
            description: "Our main training facility for agricultural education and skills development."
        },
        {
            position: { lat: 7.3349, lng: -2.3123 }, // Sunyani
            type: "secondary",
            title: "Sunyani Agricultural Hub",
            description: "Technology center for innovation in sustainable farming techniques."
        },
        {
            position: { lat: 5.1053, lng: -1.2472 }, // Cape Coast
            type: "tertiary",
            title: "Cape Coast University Partnership",
            description: "Academic collaboration for research and development of farming practices."
        },
        {
            position: { lat: 10.0601, lng: -2.5099 }, // Wa
            type: "tertiary",
            title: "Upper West NGO Alliance",
            description: "Partnership with local NGOs to extend our reach to remote communities."
        }
    ];
    
    // Add markers to map
    locations.forEach((location) => {
        // Determine icon color based on type
        let iconColor;
        switch(location.type) {
            case "primary":
                iconColor = "#2E7D32"; // Green
                break;
            case "secondary":
                iconColor = "#FFA000"; // Yellow/Gold
                break;
            case "tertiary":
                iconColor = "#BA68C8"; // Purple
                break;
            default:
                iconColor = "#2E7D32";
        }
        
        // Create marker
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: iconColor,
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 10
            },
            title: location.title,
            animation: google.maps.Animation.DROP
        });
        
        // Create info window content
        const contentString = `
            <div class="location-info">
                <h4>${location.title}</h4>
                <p>${location.description}</p>
            </div>
        `;
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 250
        });
        
        // Add click listener to marker
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
    
    // Draw polygon around focus areas
    const ghanaPolygon = new google.maps.Polygon({
        paths: [
            { lat: 5.8, lng: -2.2 },
            { lat: 5.6, lng: -0.2 },
            { lat: 6.7, lng: -0.5 },
            { lat: 7.5, lng: -1.5 },
            { lat: 6.7, lng: -2.4 }
        ],
        strokeColor: "#2E7D32",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#2E7D32",
        fillOpacity: 0.1
    });
    
    ghanaPolygon.setMap(map);
} 