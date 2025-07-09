const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Add monthly stats calculation logic here
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        monthlyStats: {
          orders: [], // Add actual monthly order data
          revenue: [] // Add actual monthly revenue data
        }
      }
    });
  } catch (error) {
    next(error);
  }
};