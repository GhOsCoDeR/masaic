// Countdown functionality for "Coming Soon" products
document.addEventListener('DOMContentLoaded', function() {
    // Get all countdown timers
    const countdownTimers = document.querySelectorAll('.countdown-timer');
    
    if (!countdownTimers.length) return;
    
    // Function to calculate time remaining
    function getTimeRemaining(targetDate) {
        const total = Date.parse(targetDate) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        const days = Math.floor(total / 1000 / 60 / 60 / 24);
        
        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }
    
    // Initialize all countdown timers
    countdownTimers.forEach(timer => {
        const targetDate = timer.getAttribute('data-target-date');
        if (!targetDate) return;
        
        // Get elements for this specific timer
        const daysElement = timer.querySelector('[id$="-days"]');
        const hoursElement = timer.querySelector('[id$="-hours"]');
        const minutesElement = timer.querySelector('[id$="-minutes"]');
        const secondsElement = timer.querySelector('[id$="-seconds"]');
        
        // Function to update the countdown
        function updateClock() {
            const t = getTimeRemaining(targetDate);
            
            // Update the timer elements if they exist
            if (daysElement) daysElement.textContent = t.days;
            if (hoursElement) hoursElement.textContent = t.hours < 10 ? `0${t.hours}` : t.hours;
            if (minutesElement) minutesElement.textContent = t.minutes < 10 ? `0${t.minutes}` : t.minutes;
            if (secondsElement) secondsElement.textContent = t.seconds < 10 ? `0${t.seconds}` : t.seconds;
            
            // If countdown is finished
            if (t.total <= 0) {
                clearInterval(timeInterval);
                
                // Reset to zeros
                if (daysElement) daysElement.textContent = "0";
                if (hoursElement) hoursElement.textContent = "00";
                if (minutesElement) minutesElement.textContent = "00";
                if (secondsElement) secondsElement.textContent = "00";
                
                // Find and update the product's availability badge
                const card = timer.closest('.coming-soon-card');
                if (card) {
                    const badge = card.querySelector('.coming-soon-badge');
                    if (badge) {
                        badge.textContent = 'Now Available!';
                        badge.classList.add('available');
                    }
                    
                    // Update the notify button to "Order Now"
                    const notifyButton = card.querySelector('.notify-button');
                    if (notifyButton) {
                        notifyButton.textContent = 'Order Now';
                        notifyButton.classList.add('order-button');
                        notifyButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Order Now';
                    }
                }
            }
        }
        
        // Initial update
        updateClock();
        
        // Update every second
        const timeInterval = setInterval(updateClock, 1000);
    });
    
    // Handle "Notify Me" button clicks
    const notifyButtons = document.querySelectorAll('.notify-button');
    notifyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // If the button has been converted to an order button
            if (this.classList.contains('order-button')) {
                // Redirect to product page or show modal
                alert('This product is now available! Redirecting to order page...');
                return;
            }
            
            // Get product name
            const card = this.closest('.coming-soon-card');
            const productName = card ? card.querySelector('h3').textContent : 'this product';
            
            // Show notification signup modal
            const modal = document.createElement('div');
            modal.className = 'notification-modal';
            modal.innerHTML = `
                <div class="notification-modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Get Notified When ${productName} Is Available</h3>
                    <p>We'll send you an email as soon as this product becomes available.</p>
                    <form class="notification-form">
                        <input type="email" placeholder="Your Email Address" required>
                        <button type="submit" class="submit-btn">Notify Me</button>
                    </form>
                    <div class="form-message"></div>
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.classList.add('active');
            
            // Close button functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
            
            // Form submit
            const form = modal.querySelector('.notification-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                const messageElement = modal.querySelector('.form-message');
                
                // Validate email (simple validation)
                if (email && email.includes('@') && email.includes('.')) {
                    // Here you would typically send this to your backend
                    // For demo purposes, just show success message
                    messageElement.textContent = 'Thank you! We\'ll notify you when this product becomes available.';
                    messageElement.classList.add('success');
                    
                    // Close modal after delay
                    setTimeout(() => {
                        modal.classList.remove('active');
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    }, 3000);
                } else {
                    messageElement.textContent = 'Please enter a valid email address.';
                    messageElement.classList.add('error');
                }
            });
            
            // Close when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
            });
        });
    });
}); 