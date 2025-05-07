// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Cart count update (sample)
    updateCartCount();
    
    // Initialize product thumbnails interaction
    if (document.querySelector('.thumbnail-images')) {
        initProductThumbnails();
    }
    
    // Initialize quantity selectors
    var quantitySelectors = document.querySelectorAll('.input-group.quantity-selector');
    quantitySelectors.forEach(function(selector) {
        initQuantitySelector(selector);
    });
    
    // Initialize review rating stars
    if (document.querySelector('.rating-input')) {
        initRatingInput();
    }
    
    // Initialize checkout tabs
    if (document.getElementById('checkoutTabs')) {
        initCheckoutTabs();
    }
    
    // Initialize profile picture change
    if (document.getElementById('changePictureBtn')) {
        initProfilePictureChange();
    }
});

async function updateCartCount() {
    var cartCountElements = document.querySelectorAll('.cart-count');
    var cartCountElementsinCartPage = document.querySelectorAll('.cartcount');
    var cartCountElementsinCard = document.querySelectorAll('.cart-count-card');

    const response = await fetch('/cart/count');
    const data = await response.json();
    
    cartCountElements.forEach(function(element) {
        element.textContent = data.count;
    });
    cartCountElementsinCartPage.forEach(function(element) {
        element.textContent = data.count;
    });
    cartCountElementsinCard.forEach(function(element) {
        element.textContent = `Subtotal (${data.count} items)`;
    });
    

}

// Initialize product thumbnails interaction
function initProductThumbnails() {
    var thumbnails = document.querySelectorAll('.thumbnail-images .img-thumbnail');
    var mainImage = document.getElementById('mainProductImage');
    
    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            // In a real app, you would swap the main image source
            // This is just a demonstration
            mainImage.src = thumbnail.src;
            
            // Update active thumbnail
            thumbnails.forEach(function(t) {
                t.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
    });
}

// Initialize quantity selector
function initQuantitySelector(selector) {
    var decreaseBtn = selector.querySelector('button:first-child');
    var increaseBtn = selector.querySelector('button:last-child');
    var input = selector.querySelector('input');
    
    decreaseBtn.addEventListener('click', function() {
        var value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        var value = parseInt(input.value);
        input.value = value + 1;
    });
}

// Initialize rating input for reviews
function initRatingInput() {
    var stars = document.querySelectorAll('.rating-input i');
    var ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            var rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // Update star display
            stars.forEach(function(s, index) {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            var rating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach(function(s, index) {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            var currentRating = parseInt(ratingInput.value);
            
            stars.forEach(function(s, index) {
                if (index >= currentRating) {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
}

// Initialize checkout tabs
function initCheckoutTabs() {
    // This would be more complex in a real app with form validation between steps
    // For now, just demonstrate tab switching
    var continueToPaymentBtn = document.getElementById('continueToPaymentBtn');
    var continueToReviewBtn = document.getElementById('continueToReviewBtn');
    var backToShippingBtn = document.getElementById('backToShippingBtn');
    var backToPaymentBtn = document.getElementById('backToPaymentBtn');
    
    if (continueToPaymentBtn) {
        continueToPaymentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var paymentTab = new bootstrap.Tab(document.getElementById('payment-tab'));
            paymentTab.show();
        });
    }
    
    if (continueToReviewBtn) {
        continueToReviewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var reviewTab = new bootstrap.Tab(document.getElementById('review-tab'));
            reviewTab.show();
            
            // In a real app, you would update the review section with the entered data
            updateReviewSection();
        });
    }
    
    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var shippingTab = new bootstrap.Tab(document.getElementById('shipping-tab'));
            shippingTab.show();
        });
    }
    
    if (backToPaymentBtn) {
        backToPaymentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var paymentTab = new bootstrap.Tab(document.getElementById('payment-tab'));
            paymentTab.show();
        });
    }
}

// Update review section with entered data (sample)
function updateReviewSection() {
    // In a real app, you would get these values from the form inputs
    document.getElementById('reviewShippingName').textContent = 'John Doe';
    document.getElementById('reviewShippingAddress').textContent = '123 Main St, Apt 4B';
    document.getElementById('reviewShippingCityState').textContent = 'New York, NY 10001';
    document.getElementById('reviewShippingCountry').textContent = 'United States';
    document.getElementById('reviewShippingPhone').textContent = '(555) 123-4567';
    document.getElementById('reviewPaymentMethod').textContent = 'Credit Card ending in 3456';
}

// Initialize profile picture change
function initProfilePictureChange() {
    var changeBtn = document.getElementById('changePictureBtn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');
    
    changeBtn.addEventListener('click', () => {
        if (profileImage.src.includes('female.png')) {
            profileImage.src = '/assets/male.png';
            profileImageInput.value = 'male.png';
          } else {
            profileImage.src = '/assets/female.png';
            profileImageInput.value = 'female.png';
          }
    });
}