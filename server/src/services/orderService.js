import { MenuItem } from '../models/MenuItem.js';

export const calculateOrderFromCart = async (cartItems) => {
  const menuIds = cartItems.map((item) => item.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: menuIds }, isAvailable: true }).lean();

  const menuMap = new Map(menuItems.map((m) => [String(m._id), m]));

  const items = cartItems.map((cartItem) => {
    const menuItem = menuMap.get(cartItem.menuItemId);
    if (!menuItem) {
      throw new Error(`Menu item unavailable: ${cartItem.menuItemId}`);
    }
    const quantity = Math.max(1, Number(cartItem.quantity || 1));
    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
      totalPrice: menuItem.price * quantity,
      restaurant: String(menuItem.restaurant)
    };
  });

  const uniqueRestaurants = [...new Set(items.map((item) => item.restaurant))];
  if (uniqueRestaurants.length !== 1) {
    throw new Error('All cart items must belong to the same restaurant');
  }

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Number((subtotal * 0.05).toFixed(2));

  return {
    items: items.map(({ restaurant, ...rest }) => rest),
    restaurantId: uniqueRestaurants[0],
    subtotal,
    deliveryFee,
    tax,
    totalAmount: subtotal + deliveryFee + tax
  };
};
