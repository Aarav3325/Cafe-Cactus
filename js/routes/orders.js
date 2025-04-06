const express = require('express');
const router = express.Router();
const Order = require('../model/order');

// POST - Create new order
router.post('/', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Create new order
        const newOrder = new Order(orderData);
        
        // Save order to database
        const savedOrder = await newOrder.save();
        
        // Send success response
        res.status(201).json({
            success: true,
            orderId: savedOrder.orderId,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// GET - Get all orders (for admin panel)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all orders',
            error: error.message
        });
    }
});


  
// PATCH /orders/:id
router.patch('/:orderId', async (req, res) => {
    try {
      const { status } = req.body;
  
      // Correct param access
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: req.params.orderId },
        { status: status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  router.delete('/:orderId', async (req, res) => {
    try {
      const deleted = await Order.findOneAndDelete({ orderId: req.params.orderId });
      if (!deleted) return res.status(404).json({ success: false, message: "Order not found" });
  
      res.status(200).json({ success: true, message: "Order deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Delete failed", error: err.message });
    }
  });
  
// GET /orders/dashboard-summary
router.get('/dashboard-summary', async (req, res) => {
    try {
        
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
  
      // Total Orders Today
      const totalOrders = await Order.countDocuments({ orderDate: { $gte: today } });
      
      // Revenue Today
      const revenueAgg = await Order.aggregate([
        { $match: { orderDate: { $gte: today } } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
      ]);

      const revenue = revenueAgg[0]?.totalRevenue || 0;
  
      // Pending Orders
      const pendingOrders = await Order.countDocuments({
        orderDate: { $gte: today },
        status: "pending"
      });
  
      res.json({
        totalOrders,
        revenue,
        pendingOrders
      });
    } catch (err) {
      console.error("Error in dashboard summary:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

// GET - Get all orders by username
router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        // Find all orders by username
        const orders = await Order.find({ username }).sort({ orderDate: -1 });
        
        // Send response
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// GET - Get order by order ID
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Find order by order ID
        const order = await Order.findOne({ orderId });
        
        // Check if order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Send response
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

module.exports = router;