const Order = require('../models/Order');
const Product = require('../models/Product'); 



exports.renderInventory = async (req, res, next) => {
    try {
        const inventory = await Product.getAllProducts(); 
        res.render('admin/inventory');  
    } catch (error) {
        next(error);
    }
};


exports.renderOrders = async (req, res, next) => {
    try {
        const orders = await Order.getAll();  
        res.render('admin/orders', { orders: orders });
    } catch (error) {
        next(error);
    }
};


exports.getAllOrders = async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        from: req.query.from,
        to: req.query.to
      };
  
      const orders = await Order.getAll(filters);
      res.json(orders);
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.getOrderDetails = async (req, res) => {
    try {
      const order = await Order.getById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json(order);
    } catch (error) {
      console.error('Error in getOrderDetails:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
  
      const updated = await Order.updateStatus(id, status);
      
      if (!updated) {
        return res.status(404).json({ error: 'Order not found or status not changed' });
      }
  
      res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      res.status(400).json({ error: error.message });
    }
  };



exports.renderProducts = async (req, res, next) => {
    try {
        const products = await Product.getAllProducts(); 
        res.render('admin/products', { products: products });
    } catch (error) {
        next(error);
    }
};
