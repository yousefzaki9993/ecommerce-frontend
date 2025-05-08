const pool = require('../config/db');

class Product {

    static async getAllProducts() {
        const [products] = await pool.query('SELECT * FROM products');
        return products;
    }

    static async getRelatedProducts(id) {
        const [category] = await pool.query('SELECT category FROM products where product_id=?', id);
        const [products] = await pool.query('SELECT * FROM products where category=? and product_id!=?', [category[0].category, id]);
        return products;
    }
    
    static async getRelatedReviews(id) {
        const [reviews] = await pool.query('SELECT * FROM reviews where product_id=?', id);
        return reviews;
    }

    static async getProductDetails(id) {
        const [product] = await pool.query('SELECT * FROM products where product_id=?', id);
        return product[0];
    }

    static async addReview({ productId, userId, rating, title, review }) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        await connection.execute(
            `INSERT INTO reviews (product_id, user_id, rating, title, comment) 
             VALUES (?, ?, ?, ?, ?)`,
            [productId, userId, rating, title, review]
        );

        await connection.execute(
            `UPDATE products 
             SET 
               rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?),
               reviews = reviews + 1
             WHERE product_id = ?`,
            [productId, productId]
        );

        await connection.commit();
        connection.release();

    }


    static async addProduct(productData) {
        const { name, description, price, discount_rate, stock_quantity, image, category, rating, reviews } = productData;
        const query = 'INSERT INTO products (name, description, price, discount_rate, stock_quantity, image, category, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.query(query, [name, description, price, discount_rate, stock_quantity, image, category, rating, reviews]);
    }

    static async updateProduct(productData) {
        const { name, description, price, discount_rate, stock_quantity, image, category, rating, reviews, productId } = productData;
    
        const query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, discount_rate = ?, stock_quantity = ?, image = ?, category = ?, rating = ?, reviews = ? 
            WHERE product_id = ?
        `;
        
        await pool.query(query, [name, description, price, discount_rate, stock_quantity, image, category, rating, reviews, productId]);
    }
    

    static async deleteProduct(productId) {
        const query = 'DELETE FROM products WHERE product_id = ?';
        await pool.query(query, [productId]);
    }

}

module.exports = Product;