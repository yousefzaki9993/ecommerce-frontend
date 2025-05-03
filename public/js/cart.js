// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality if on cart page
    if (document.getElementById('cartItems')) {
        initCart();
    }
    
    // Add to cart buttons
    var addToCartBtns = document.querySelectorAll('[id^="addToCart"]');
    addToCartBtns.forEach(function(btn) {
        btn.addEventListener('click', addToCart);
    });
    
    // Checkout button
    if (document.getElementById('checkoutBtn')) {
        document.getElementById('checkoutBtn').addEventListener('click', proceedToCheckout);
    }
    
    // Clear cart button
    if (document.getElementById('clearCartBtn')) {
        document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    }
    
    // Continue shopping button
    if (document.getElementById('continueShoppingBtn')) {
        document.getElementById('continueShoppingBtn').addEventListener('click', continueShopping);
    }
    
    // Place order button
    if (document.getElementById('placeOrderBtn')) {
        document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
    }
});

// Initialize cart
function initCart() {
    // In a real app, you would load cart items from your backend or localStorage
    updateCartTotal();
    
    // Initialize quantity selectors in cart
    var cartQuantitySelectors = document.querySelectorAll('#cartItems .input-group');
    cartQuantitySelectors.forEach(function(selector) {
        initCartQuantitySelector(selector);
    });
    
    // Initialize remove buttons
    var removeBtns = document.querySelectorAll('#cartItems .btn-outline-danger');
    removeBtns.forEach(function(btn) {
        btn.addEventListener('click', removeCartItem);
    });
}

// Initialize quantity selector in cart
function initCartQuantitySelector(selector) {
    var decreaseBtn = selector.querySelector('button:first-child');
    var increaseBtn = selector.querySelector('button:last-child');
    var input = selector.querySelector('input');
    
    decreaseBtn.addEventListener('click', function() {
        var value = parseInt(input.value);
        if (value > 1) {
            input.value = value - 1;
            updateCartItemTotal(this.closest('tr'));
            updateCartTotal();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        var value = parseInt(input.value);
        input.value = value + 1;
        updateCartItemTotal(this.closest('tr'));
        updateCartTotal();
    });
    
    input.addEventListener('change', function() {
        var value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        }
        updateCartItemTotal(this.closest('tr'));
        updateCartTotal();
    });
}

// Update cart item total
function updateCartItemTotal(row) {
    var priceText = row.querySelector('td:nth-child(2)').textContent;
    var price = parseFloat(priceText.replace('$', ''));
    var quantity = parseInt(row.querySelector('input').value);
    var total = price * quantity;
    
    row.querySelector('td:nth-child(4)').textContent = '$' + total.toFixed(2);
}

// Update cart total
function updateCartTotal() {
    var rows = document.querySelectorAll('#cartItems tr');
    var subtotal = 0;
    
    rows.forEach(function(row) {
        var totalText = row.querySelector('td:nth-child(4)').textContent;
        var total = parseFloat(totalText.replace('$', ''));
        subtotal += total;
    });
    
    // Calculate tax (sample rate)
    var taxRate = 0.08; // 8%
    var tax = subtotal * taxRate;
    
    // Apply discount (sample)
    var discount = 20.00;
    
    // Calculate total
    var total = subtotal + tax - discount;
    
    // Update display
    if (document.getElementById('cartItemCount')) {
        document.getElementById('cartItemCount').textContent = rows.length;
    }
    
    if (document.querySelector('.order-summary-totals')) {
        document.querySelector('.order-summary-totals span:nth-child(2)').textContent = '$' + subtotal.toFixed(2);
        document.querySelector('.order-summary-totals span:nth-child(4)').textContent = '$' + tax.toFixed(2);
        document.querySelector('.order-summary-totals span:nth-child(6)').textContent = '-$' + discount.toFixed(2);
        document.querySelector('.order-summary-totals h5:nth-child(8)').textContent = '$' + total.toFixed(2);
    }
    
    // Update cart count in navbar
    updateCartCount();
}

// Add to cart
function addToCart() {
    // In a real app, you would get product details from the page or your backend
    var product = {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 199.99,
        image: 'assets/product1-thumb1.jpg',
        color: document.getElementById('colorSelect') ? document.getElementById('colorSelect').value : 'Black',
        quantity: document.getElementById('quantitySelect') ? parseInt(document.getElementById('quantitySelect').value) : 1
    };
    
    // In a real app, you would add this to your cart in localStorage or send to backend
    console.log('Adding to cart:', product);
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    alert(product.name + ' has been added to your cart!');
    
    // If on product page, you might want to redirect to cart
    // window.location.href = '/products/cart';
}

// Remove cart item
function removeCartItem() {
    var row = this.closest('tr');
    row.remove();
    updateCartTotal();
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        var cartItems = document.getElementById('cartItems');
        while (cartItems.firstChild) {
            cartItems.removeChild(cartItems.firstChild);
        }
        updateCartTotal();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    // In a real app, you would validate cart and redirect
    window.location.href = '/checkout';
}

// Continue shopping
function continueShopping() {
    window.location.href = '/products';
}

// Place order
function placeOrder(e) {
    e.preventDefault();
    
    // In a real app, you would validate all checkout info and send to backend
    if (!document.getElementById('agreeTerms').checked) {
        alert('You must agree to the terms and conditions to place your order.');
        return;
    }
    
    // Simulate successful order
    alert('Thank you for your order! Your order has been placed successfully.');
    window.location.href = 'dashboard';
    
    // In a real app, you would clear the cart after successful order
    // clearCart();
}