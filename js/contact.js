// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (in a real application, you would send this to a server)
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(function() {
                // Success response
                showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                contactForm.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({behavior: 'smooth', block: 'center'});
        
        // Hide message after 5 seconds if it's a success message
        if (type === 'success') {
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // FAQ item interactivity
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Info card animations
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Stagger the animations
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 * (index + 1));
    });
});

// Initialize Google Map
function initMap() {
    // If the map element doesn't exist, don't attempt to initialize
    if (!document.getElementById('map')) return;
    
    // Map options - centered on Ghana
    const options = {
        zoom: 7,
        center: {lat: 7.9465, lng: -1.0232}, // Ghana coordinates
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#c4e5dc"}, {"visibility": "on"}]
            }
        ]
    };
    
    // New map
    const map = new google.maps.Map(document.getElementById('map'), options);
    
    // Check if custom marker icon exists, otherwise use fallback
    const customIcon = {
        path: 'M12,2C8.14,2,5,5.14,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.14,15.86,2,12,2z M12,4c1.1,0,2,0.9,2,2c0,1.11-0.9,2-2,2s-2-0.89-2-2C10,4.9,10.9,4,12,4z M12,14c-1.67,0-3.14-0.85-4-2.15c0.02-1.32,2.67-2.05,4-2.05s3.98,0.73,4,2.05C15.14,13.15,13.67,14,12,14z',
        fillColor: '#2E7D32',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.5,
        anchor: new google.maps.Point(12, 24)
    };
    
    // Add marker for Mosaic Grove location
    const marker = new google.maps.Marker({
        position: {lat: 6.6500, lng: -0.2333}, // Example coordinates for Eastern Region
        map: map,
        icon: customIcon,
        animation: google.maps.Animation.DROP,
        title: 'Mosaic Grove'
    });
    
    // Info window for marker
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="location-info">
                <h4>Mosaic Grove</h4>
                <p><i class="fas fa-map-marker-alt"></i> Eastern Afram Plains, Ghana</p>
                <p><i class="fas fa-seedling"></i> Tiger Nut Farming & Processing</p>
                <p><a href="tel:+233123456789"><i class="fas fa-phone"></i> +233 123 456 789</a></p>
            </div>
        `
    });
    
    // Add click event to marker
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    
    // Initially open the info window
    infoWindow.open(map, marker);
}

// Note: In a production environment, replace the API key in the HTML file with your own Google Maps API key
// The script tag should look like: 
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap" async defer></script> 