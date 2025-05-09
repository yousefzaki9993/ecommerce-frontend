const db = require('../config/db');

class Order {
  // Get all orders with optional filters
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT 
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.payment_method,
          o.created_at,
          u.email,
          u.first_name,
          u.last_name
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        WHERE 1=1
      `;
      
      const params = [];
  
      if (filters.status && filters.status.trim() !== '') {
        query += ' AND o.status = ?';
        params.push(filters.status.trim());
      }
  
      if (filters.from && filters.from.trim() !== '') {
        query += ' AND DATE(o.created_at) >= ?';
        params.push(filters.from.trim());
      }
  
      if (filters.to && filters.to.trim() !== '') {
        query += ' AND DATE(o.created_at) <= ?';
        params.push(filters.to.trim());
      }
  
      query += ' ORDER BY o.created_at DESC';
  
      const [orders] = await db.execute(query, params);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }


  
static async getUserOrders(userId, filters = {}) {
  try {
      let query = `
          SELECT 
              o.order_id,
              o.total_amount,
              o.status,
              o.shipping_address,
              o.payment_method,
              o.created_at
          FROM orders o
          WHERE o.user_id = ?
      `;
      
      const params = [userId];
      
      if (filters.status) {
          query += ' AND o.status = ?';
          params.push(filters.status);
      }
      
      if (filters.from) {
          query += ' AND DATE(o.created_at) >= ?';
          params.push(filters.from);
      }
      
      if (filters.to) {
          query += ' AND DATE(o.created_at) <= ?';
          params.push(filters.to);
      }
      
      query += ' ORDER BY o.created_at DESC';
      
      const [orders] = await db.execute(query, params);
      return orders;
  } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
  }
}



  // Get order by ID with full details
  static async getById(orderId) {
    try {
      // Get basic order info with user details
      const [orderRows] = await db.execute(`
        SELECT 
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.payment_method,
          o.created_at,
          u.email,
          u.first_name,
          u.last_name,
          u.phone
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        WHERE o.order_id = ?
      `, [orderId]);

      if (orderRows.length === 0) return null;

      const order = orderRows[0];

      // Get order items with product details
      const [items] = await db.execute(`
        SELECT 
          oi.order_item_id,
          oi.product_id,
          p.name AS product_name,
          p.image AS product_image,
          oi.price,
          oi.quantity,
          (oi.price * oi.quantity) AS item_total
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `, [orderId]);

      order.items = items;
      
      // Calculate subtotal from items (for verification)
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Add additional calculated fields
      order.subtotal = subtotal;
      order.shipping_fee = order.total_amount - subtotal; // Assuming shipping is the difference
      
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Update order status
  static async updateStatus(orderId, status) {
    try {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid order status');
        }

        const [result] = await db.execute(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}




}

module.exports = Order;