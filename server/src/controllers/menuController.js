import { MenuItem } from '../models/MenuItem.js';
import { Restaurant } from '../models/Restaurant.js';

export const addMenuItem = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    if (String(restaurant.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to manage this restaurant menu' });
    }

    const item = await MenuItem.create({ ...req.body, restaurant: restaurantId });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant');
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    if (String(item.restaurant.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant');
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    if (String(item.restaurant.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    next(error);
  }
};
