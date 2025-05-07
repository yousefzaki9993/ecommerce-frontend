const pool = require('../config/db');

class Cart {
    static async getCartFromCookie(cartId) {
        const [results] = await pool.query(
            `SELECT * FROM carts WHERE cart_id = ? LIMIT 1`,
            [cartId]
        );
        console.log('2');
        if (results.length > 0) {
            return results[0];
        } else {
            console.log('b');
            return null; // No cart found with that ID
        }
    }
    
    static async CreateCart() {
        const [insertResult] = await pool.query(
            `INSERT INTO carts (user_id) VALUES (NULL)`
        );
        return insertResult.insertId; // This is the new cart_id
    }

    static async getTotalPrice(cartId) {

        try {
            const [rows] = await pool.query( 
                `
                SELECT SUM(ci.quantity * p.price) AS total
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.cart_id = ?
            `
            , [cartId]);
            
            return rows[0].total || 0;
        } catch (err) {
            console.error('Error calculating cart total:', err);
            return 0;
        }
    }

    static async updateItemQuantity(itemId, newQty) {
        try {
            const result = await pool.query(
                'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
                [newQty, itemId]
            );

            if (result.rowCount === 0) {
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error updating cart item quantity:', err);
            return false;
        }
    }

    static async getUserCart(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT cart_id FROM carts WHERE user_id = ?',
                [userId]
            );
            
            if (rows.length > 0) {
                return rows[0].cart_id;
            }
            

            const [result] = await pool.query(
                'INSERT INTO carts (user_id) VALUES (?)',
                [userId]
            );
            
            return result.insertId;
            
        } catch (err) {
            console.error('Error in getUserCart:', err);
            throw err;
        }
    }
    
    
/*
    static async findOrCreate(sessionId, userId = null) {
        let cart;
        
        // Check existing cart
        const [results] = await pool.query(
            `SELECT * FROM carts 
            WHERE user_id = ? OR session_id = ? 
            ORDER BY created_at DESC LIMIT 1`,
            [userId || null, sessionId]
        );

        if (results.length > 0) {
            cart = results[0];
        } else {
            const [insertResult] = await pool.query(
                `INSERT INTO carts (user_id, session_id) 
                VALUES (?, ?)`,
                [userId, sessionId]
            );
            
            const [newCart] = await pool.query(
                `SELECT * FROM carts WHERE cart_id = ?`,
                [insertResult.insertId]
            );
            cart = newCart[0];
        }
        
        return cart;
    }
*/

    static async mergeCarts(sessionCartId, userId) {
        await pool.query(
            `UPDATE carts SET user_id = ? 
            WHERE id = ? OR user_id = ?`,
            [userId, sessionCartId, userId]
        );
    }
}

module.exports = Cart;