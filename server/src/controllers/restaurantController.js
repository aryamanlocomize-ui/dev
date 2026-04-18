import { Restaurant } from '../models/Restaurant.js';
import { MenuItem } from '../models/MenuItem.js';
import { Review } from '../models/Review.js';

const calcDistanceKm = (lat1, lng1, lat2, lng2) => {
  if (![lat1, lng1, lat2, lng2].every((x) => Number.isFinite(Number(x)))) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

export const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

export const getRestaurants = async (req, res, next) => {
  try {
    const { cuisine, minRating, maxPrice, search, lat, lng } = req.query;
    const query = {};

    if (cuisine) query.cuisines = cuisine;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (maxPrice) query.priceForTwo = { $lte: Number(maxPrice) };
    if (search) query.name = { $regex: search, $options: 'i' };

    let restaurants = await Restaurant.find(query).lean();

    if (lat && lng) {
      restaurants = restaurants
        .map((r) => ({
          ...r,
          distanceKm: calcDistanceKm(Number(lat), Number(lng), r?.location?.lat, r?.location?.lng)
        }))
        .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    }

    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menu = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true }).lean();
    const reviews = await Review.find({ restaurant: restaurant._id })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ ...restaurant, menu, reviews });
  } catch (error) {
    next(error);
  }
};
