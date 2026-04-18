import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { Order } from '../models/Order.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantsAdmin = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenueAgg, totalUsers, totalRestaurants] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]),
      User.countDocuments(),
      Restaurant.countDocuments()
    ]);

    const statusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
      totalUsers,
      totalRestaurants,
      statusDistribution
    });
  } catch (error) {
    next(error);
  }
};
