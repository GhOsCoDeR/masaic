document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                submitForm();
            }
        });
    }
    
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (name === '' || email === '' || message === '') {
            displayMessage('error', 'Please fill in all required fields');
            return false;
        }
        
        if (!validateEmail(email)) {
            displayMessage('error', 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function submitForm() {
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Log form data (in a real application, this would be sent to a server)
        console.log('Form submitted:', formData);
        
        // Display success message
        displayMessage('success', 'Your message has been sent. Thank you!');
        
        // Reset form
        document.getElementById('contactForm').reset();
    }
    
    function displayMessage(type, text) {
        formMessage.textContent = text;
        formMessage.className = 'form-message';
        formMessage.classList.add(`form-message-${type}`);
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});

// Google Maps initialization
// This function will be called by the Google Maps API when loaded
function initMap() {
    // Coordinates for Ghana's Eastern Region (approximate)
    const farmLocation = { lat: 6.6666, lng: -0.25 };
    
    // Create map centered at the farm location
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: farmLocation,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#444444' }]
            },
            {
                featureType: 'landscape',
                elementType: 'all',
                stylers: [{ color: '#f2f2f2' }]
            },
            {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                elementType: 'all',
                stylers: [{ saturation: -100 }, { lightness: 45 }]
            },
            {
                featureType: 'water',
                elementType: 'all',
                stylers: [{ color: '#4CAF50' }, { visibility: 'on' }]
            }
        ]
    });
    
    // Add marker for the farm location
    const marker = new google.maps.Marker({
        position: farmLocation,
        map: map,
        title: 'Mosaic Grove Farm',
        animation: google.maps.Animation.DROP
    });
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: '<div class="info-window"><h3>Mosaic Grove</h3><p>Sustainable farming in Ghana\'s Eastern Region</p><p><a href="https://maps.google.com/maps?q=6.6666,-0.25" target="_blank">Get directions</a></p></div>'
    });
    
    // Open info window when marker is clicked
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}

// Note: In a production environment, replace the API key in the HTML file with your own Google Maps API key
// The script tag should look like: 
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap" async defer></script> 