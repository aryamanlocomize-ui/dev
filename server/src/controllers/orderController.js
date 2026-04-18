import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';
import { User } from '../models/User.js';
import { calculateOrderFromCart } from '../services/orderService.js';
import { getIO } from '../config/socket.js';
import { ORDER_STATUS, USER_ROLES } from '../utils/constants.js';

const emitOrderUpdate = (order) => {
  const io = getIO();
  if (!io) return;
  io.to(`user:${order.customer}`).emit('order:update', order);
  io.to(`restaurant:${order.restaurant}`).emit('order:update', order);
  if (order.deliveryPartner) {
    io.to(`delivery:${order.deliveryPartner}`).emit('order:update', order);
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    const computed = await calculateOrderFromCart(cartItems);
    const restaurant = await Restaurant.findById(computed.restaurantId);
    if (!restaurant || !restaurant.isOpen) {
      return res.status(400).json({ message: 'Restaurant is closed or invalid' });
    }

    const order = await Order.create({
      customer: req.user._id,
      restaurant: computed.restaurantId,
      items: computed.items,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: 'paid',
      subtotal: computed.subtotal,
      deliveryFee: computed.deliveryFee,
      tax: computed.tax,
      totalAmount: computed.totalAmount,
      deliveryAddress,
      statusHistory: [{ status: ORDER_STATUS.PLACED, note: 'Order placed by customer' }]
    });

    emitOrderUpdate(order);
    res.status(201).json(order);
  } catch (error) {
    if (error.message.includes('Menu item unavailable') || error.message.includes('same restaurant')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const filters = {};
    if (req.user.role === USER_ROLES.CUSTOMER) filters.customer = req.user._id;
    if (req.user.role === USER_ROLES.RESTAURANT) {
      const owned = await Restaurant.find({ owner: req.user._id }).select('_id');
      filters.restaurant = { $in: owned.map((r) => r._id) };
    }
    if (req.user.role === USER_ROLES.DELIVERY) filters.deliveryPartner = req.user._id;

    const orders = await Order.find(filters)
      .populate('customer', 'name phone')
      .populate('restaurant', 'name')
      .populate('deliveryPartner', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role === USER_ROLES.RESTAURANT) {
      const owned = await Restaurant.findOne({ _id: order.restaurant, owner: req.user._id });
      if (!owned) return res.status(403).json({ message: 'You do not own this restaurant order' });
      if (![ORDER_STATUS.ACCEPTED, ORDER_STATUS.REJECTED, ORDER_STATUS.PREPARING].includes(status)) {
        return res.status(400).json({ message: 'Invalid restaurant status update' });
      }
    }

    if (req.user.role === USER_ROLES.DELIVERY) {
      if (String(order.deliveryPartner) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Order is not assigned to you' });
      }
      if (![ORDER_STATUS.PICKED, ORDER_STATUS.ON_THE_WAY, ORDER_STATUS.DELIVERED].includes(status)) {
        return res.status(400).json({ message: 'Invalid delivery status update' });
      }
    }

    if (req.user.role === USER_ROLES.ADMIN && !Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    order.status = status;
    order.statusHistory.push({ status, note: `Updated by ${req.user.role}` });
    await order.save();

    emitOrderUpdate(order);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const assignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const deliveryUser = await User.findOne({ _id: deliveryPartnerId, role: USER_ROLES.DELIVERY });
    if (!deliveryUser) return res.status(404).json({ message: 'Delivery partner not found' });

    order.deliveryPartner = deliveryPartnerId;
    order.statusHistory.push({ status: order.status, note: 'Delivery partner assigned by admin' });
    await order.save();

    emitOrderUpdate(order);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
