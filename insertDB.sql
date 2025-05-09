-- Insert data into ecommerce_db
USE ecommerce_db;

/*
For john.doe@example.com: Password123

For jane.smith@example.com: Password

For mike.johnson@example.com: Pass

For sarah.williams@example.com: TestPass789

For david.brown@example.com: TestPass789
*/
-- Insert users
INSERT INTO users (email, password, first_name, last_name, profile_picture, bio) VALUES 
('john.doe@example.com', '$2b$10$mXODlO1lnZb8c1FoJEgesuOh3qkRZe6Q6WMGXwWUUT6YIgmJHIZ56', 'John', 'Doe', 'male.png', 'Tech enthusiast and frequent shopper'),
('jane.smith@example.com', '$2b$10$GxCSSzvwxLA2MkrYUcCtKO3nm6EbXSETwM/2EUSXw6p69Z8RinEkm', 'Jane', 'Smith', 'female.png', 'Love reading and cooking'),
('mike.johnson@example.com', '$2b$10$lB0b0bvnfHm14OwMdNqHWOsdxBWhrQ026m1a6IUzjX16xsD2L/rBW', 'Mike', 'Johnson', 'male.png', 'Fitness trainer and outdoor lover'),
('sarah.williams@example.com', '$2b$10$CwbOIo9ciOEzl5wrmTC0qeEAvCTwPh24imF4CMiv5Y2ELnhpohr3a', 'Sarah', 'Williams', 'female.png', 'Bookworm and coffee addict'),
('david.brown@example.com', '$2b$10$CwbOIo9ciOEzl5wrmTC0qeEAvCTwPh24imF4CMiv5Y2ELnhpohr3a', 'David', 'Brown', 'male.png', 'Home chef and gadget collector');

-- Insert products
INSERT INTO products (name, description, price, discount_rate, stock_quantity, image, rating, reviews, category) VALUES 
('Smartphone X', 'Latest smartphone with 128GB storage and triple camera', 799.99, 0.1, 50, 'product01.png', 4.4, 1, 'Electronics'),
('Wireless Headphones', 'Noise-cancelling wireless headphones with 30hr battery', 199.99, 0.15, 100, 'product02.png', 3.4, 1, 'Electronics'),
('Cotton T-Shirt', 'Comfortable 100% cotton t-shirt in various colors', 24.99, 0, 200, 'product03.png', 2.4, 0, 'Clothing'),
('Non-Stick Frying Pan', '10-inch non-stick frying pan for perfect cooking', 39.99, 0.2, 75, 'product04.png', 4.4, 1, 'Home & Kitchen'),
('Bestseller Novel', 'New York Times bestseller novel by famous author', 14.99, 0.05, 150, 'product05.png', 4.4, 1, 'Books'),
('Yoga Mat', 'Eco-friendly yoga mat with carrying strap', 29.99, 0, 60, 'product06.png', 4.4, 0, 'Sports & Outdoors'),
('Smart Watch', 'Fitness tracker with heart rate monitor', 129.99, 0.25, 40, 'product07.png', 3.4, 1, 'Electronics'),
('Jeans', 'Classic fit jeans with stretch technology', 59.99, 0.1, 90, 'product08.png', 2.9, 0, 'Clothing'),
('Blender', 'High-speed blender for smoothies and soups', 89.99, 0, 30, 'product09.png', 1.4, 0, 'Home & Kitchen'),
('Cookbook', 'Collection of 100 easy recipes for beginners', 19.99, 0, 80, 'product01.png', 1.2, 0, 'Books');

-- Insert carts
INSERT INTO carts (user_id) VALUES 
(1), (2), (3), (4), (5);

-- Insert cart items
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES 
(1, 1, 1), (1, 3, 2),
(2, 5, 1), (2, 10, 1),
(3, 2, 1), (3, 6, 1),
(4, 4, 1), (4, 9, 1),
(5, 7, 1), (5, 8, 2);

-- Insert orders
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES 
(1, 849.97, 'delivered', '123 Main St, Anytown, USA', 'Credit Card'),
(2, 34.98, 'shipped', '456 Oak Ave, Somewhere, USA', 'PayPal'),
(3, 229.98, 'processing', '789 Pine Rd, Nowhere, USA', 'Credit Card'),
(4, 129.98, 'pending', '321 Elm Blvd, Anywhere, USA', 'Debit Card'),
(5, 249.97, 'delivered', '654 Maple Ln, Everywhere, USA', 'PayPal');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES 
(1, 1, 1, 719.99), (1, 3, 2, 24.99),
(2, 5, 1, 14.24), (2, 10, 1, 19.99),
(3, 2, 1, 169.99), (3, 6, 1, 29.99),
(4, 4, 1, 31.99), (4, 9, 1, 89.99),
(5, 7, 1, 97.49), (5, 8, 2, 53.99);

-- Insert reviews
INSERT INTO reviews (user_id, product_id, rating, title, comment) VALUES 
(1, 1, 5, 'Amazing phone!', 'The camera quality is exceptional and battery life lasts all day.'),
(2, 5, 4, 'Great read', 'Couldn\'t put it down, though the ending felt a bit rushed.'),
(3, 2, 3, 'Good but not perfect', 'Sound quality is excellent but they hurt my ears after long use.'),
(4, 4, 5, 'Perfect pan', 'Nothing sticks to it and it heats evenly. Worth every penny!'),
(5, 7, 4, 'Excellent fitness tracker', 'Tracks all my workouts accurately, but the app could be better.');

-- Dummy values:
INSERT INTO promo_codes (code, type, value, expires_at, is_active) VALUES
('DISCOUNT10', 'percent', 10.00, '2025-12-31 23:59:59', 1),
('FLAT50', 'fixed', 50.00, NULL, 1),
('EXPIRED20', 'percent', 20.00, '2023-01-01 00:00:00', 1),
('DISABLED15', 'percent', 15.00, NULL, 0);