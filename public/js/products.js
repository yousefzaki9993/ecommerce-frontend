// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    // Load featured products if on home page
    if (document.getElementById('featured-products-container')) {
        loadFeaturedProducts();
    }

    // Load all products if on products page
    if (document.getElementById('product-grid')) {
        loadAllProducts();
    }

    // Load related products if on product detail page
    if (document.getElementById('relatedProducts')) {
        loadRelatedProducts();
    }
    if (document.getElementById('reviews-list')) {
        loadRelatedReviews();
    }

    // Initialize search functionality
    if (document.getElementById('productSearch')) {
        document.getElementById('searchButton').addEventListener('click', handleSearch);
        document.getElementById('productSearch').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Initialize sort functionality
    if (document.getElementById('sortSelect')) {
        document.getElementById('sortSelect').addEventListener('change', handleSort);
    }

    // Initialize filters
    if (document.getElementById('applyFilters')) {
        document.getElementById('applyFilters').addEventListener('click', applyFilters);
        document.getElementById('resetFilters').addEventListener('click', resetFilters);
    }

    // Initialize price range slider
    if (document.getElementById('priceRange')) {
        document.getElementById('priceRange').addEventListener('input', function () {
            document.getElementById('priceValue').textContent = this.value;
        });
    }

    if (document.getElementById('priceRange')) {
        document.getElementById('priceRange').addEventListener('addToCartBtn', addToCart);
    }
});

// Load featured products
async function loadFeaturedProducts() {
    // In a real app, you would fetch these from your backend API
    var featuredProducts = await fetch('/products/api/all');
    featuredProducts = await featuredProducts.json();
    featuredProducts = featuredProducts.slice(0, 4);

    var container = document.getElementById('featured-products-container');
    container.innerHTML = '';

    featuredProducts.forEach(function (product) {
        var productHtml = `
            <div class="col-md-3 mb-4">
                <div class="card h-100">
                    <div class="product-card-img">
                    <a href="/products/${product.product_id}">
                        <img src="../assets/${product.image}" alt="${product.name}" class="img-fluid">
                    </a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="rating mb-2">
                            ${generateRatingStars(product.rating)}
                            <span class="ms-2">${product.rating} (${product.reviews})</span>
                        </div>
                        <div class="price mb-3">
                            <span class="h5 text-primary">$${product.price}</span>
                            ${product.discount_rate > 0 ? `<span class="text-decoration-line-through text-muted ms-2">$${(product.price * (1 + parseFloat(product.discount_rate))).toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <div class="card-footer bg-white">
                        <button class="btn btn-primary w-100 add-to-cart" data-id="${product.product_id}">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += productHtml;
    });

    // Add event listeners to new add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
        btn.addEventListener('click', addToCart);
    });
}

// Load all products
async function loadAllProducts() {
    // In a real app, you would fetch these from your backend API with pagination
    var allProducts = await fetch('/products/api/all');
    allProducts = await allProducts.json();

    var container = document.getElementById('product-grid');
    container.innerHTML = '';

    allProducts.forEach(function (product) {
        var productHtml = `
            <div class="col-md-4 col-lg-3 mb-4" data-category="${product.category.toLowerCase()}" data-price="${product.price}" data-rating="${product.rating}">
                <div class="card h-100">
                    <div class="product-card-img">
                    <a href="/products/${product.product_id}">
                        <img src="../assets/${product.image}" alt="${product.name}" class="img-fluid">
                    </a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="rating mb-2">
                            ${generateRatingStars(product.rating)}
                            <span class="ms-2">${product.rating}</span>
                        </div>
                        <div class="price mb-3">
                            <span class="h5 text-primary">$${product.price}</span>
                            ${product.discount_rate > 0 ? `<span class="text-decoration-line-through text-muted ms-2">$${(product.price * (1 + parseFloat(product.discount_rate))).toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <div class="card-footer bg-white">
                        <button class="btn btn-primary w-100 add-to-cart" data-id="${product.product_id}">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += productHtml;
    });

    // Add event listeners to new add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
        btn.addEventListener('click', addToCart);
    });
}

// Load related products
async function loadRelatedProducts() {
    // In a real app, you would fetch these from your backend API based on current product
    const segments = window.location.pathname.split('/');
    const productId = segments[segments.length - 1];
    var relatedProducts = await fetch('/products/api/related/' + productId);
    relatedProducts = await relatedProducts.json();

    var container = document.getElementById('relatedProducts');
    container.innerHTML = '';

    relatedProducts.forEach(function (product) {
        var productHtml = `
            <div class="col-md-3 mb-4">
                <div class="card h-100">
                    <div class="product-card-img">
                        <a href="/products/${product.product_id}">
                            <img src="../assets/${product.image}" alt="${product.name}" class="img-fluid">
                        </a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="rating mb-2">
                            ${generateRatingStars(product.rating)}
                            <span class="ms-2">${product.rating}</span>
                        </div>
                        <div class="price">
                            <span class="h5 text-primary">$${product.price}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white">
                        <button class="btn btn-primary w-100 add-to-cart" data-id="${product.product_id}">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += productHtml;
    });

    // Add event listeners to new add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
        btn.addEventListener('click', addToCart);
    });
}

// Load related reviews
async function loadRelatedReviews() {
    const segments = window.location.pathname.split('/');
    const productId = segments[segments.length - 1];
    var relatedReviews = await fetch('/products/api/reviews/' + productId);
    relatedReviews = await relatedReviews.json();

    var users = await fetch('/user/api/all');
    users = await users.json();

    var container = document.getElementById('reviews-list');
    container.innerHTML = '<h5>Customer Reviews</h5>';

    relatedReviews.forEach(function (review) {
        const { first_name, last_name } = users.find(user => user.user_id == review.user_id);
        var productHtml = `
            <div class="review-item mb-4">
                <div class="d-flex justify-content-between">
                    <div class="review-author">${first_name + " " + last_name}</div>
                    <div class="review-date">${new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}</div>
                </div>
                <div class="review-rating mb-2">
                    ${generateRatingStars(review.rating)}
                </div>
                <h6 class="review-title">${review.title}</h6>
                <p class="review-text">${review.comment}</p>
            </div>
        `;

        container.innerHTML += productHtml;
    });

    // Add event listeners to new add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
        btn.addEventListener('click', addToCart);
    });
}

// Generate rating stars HTML
function generateRatingStars(rating) {
    var stars = '';
    var fullStars = Math.floor(rating);
    var hasHalfStar = rating % 1 >= 0.5;

    for (var i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }

    return stars;
}

// Handle search
function handleSearch() {
    var searchTerm = document.getElementById('productSearch').value.toLowerCase();
    var products = document.querySelectorAll('#product-grid > div');

    products.forEach(function (product) {
        var productName = product.querySelector('.card-title').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Handle sort
function handleSort() {
    var sortValue = this.value;
    var container = document.getElementById('product-grid');
    var products = Array.from(container.children);

    products.sort(function (a, b) {
        var aPrice = parseFloat(a.getAttribute('data-price'));
        var bPrice = parseFloat(b.getAttribute('data-price'));
        var aRating = parseFloat(a.getAttribute('data-rating'));
        var bRating = parseFloat(b.getAttribute('data-rating'));

        switch (sortValue) {
            case 'price-asc':
                return aPrice - bPrice;
            case 'price-desc':
                return bPrice - aPrice;
            case 'rating':
                return bRating - aRating;
            case 'newest':
                // In a real app, you would have a date attribute to sort by
                return 0; // Default order
            default:
                return 0; // Default order
        }
    });

    // Re-append sorted products
    products.forEach(function (product) {
        container.appendChild(product);
    });
}

// Apply filters
function applyFilters() {
    var maxPrice = parseFloat(document.getElementById('priceRange').value);
    var checkedCategories = [];
    var categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="category"]:checked');

    categoryCheckboxes.forEach(function (checkbox) {
        checkedCategories.push(checkbox.nextElementSibling.textContent.toLowerCase());
    });

    var minRating = 0;
    var ratingCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="rating"]:checked');
    if (ratingCheckboxes.length > 0) {
        // Get the highest minimum rating from checked boxes
        ratingCheckboxes.forEach(function (checkbox) {
            var rating = parseInt(checkbox.id.replace('rating', ''));
            if (rating > minRating) {
                minRating = rating;
            }
        });
    }

    var products = document.querySelectorAll('#product-grid > div');

    products.forEach(function (product) {
        var productPrice = parseFloat(product.getAttribute('data-price'));
        var productCategory = product.getAttribute('data-category');
        var productRating = parseFloat(product.getAttribute('data-rating'));

        var priceMatch = productPrice <= maxPrice;
        var categoryMatch = checkedCategories.length === 0 || checkedCategories.includes(productCategory);
        var ratingMatch = minRating === 0 || productRating >= minRating;

        if (priceMatch && categoryMatch && ratingMatch) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Reset filters
function resetFilters() {
    // Reset form elements
    document.getElementById('priceRange').value = 500;
    document.getElementById('priceValue').textContent = '500';

    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    // Show all products
    var products = document.querySelectorAll('#product-grid > div');
    products.forEach(function (product) {
        product.style.display = 'block';
    });
}


async function addToCart(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-id');
    console.log(productId);

    try {
        let response = await fetch('/cart/checkItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId }) 
        });

        let result = await response.json();

        if (result.exists) {
            alert('Item already in cart');
        } else {
            response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId }) 
            });

            result = await response.json();

            if (result.success) {
                updateCartCount();
                alert('Item added to cart!');
            } else {
                alert('Failed to add to cart.');
            }
        }
    } catch (error) {
        console.error('Add to cart failed:', error);
    }
}

