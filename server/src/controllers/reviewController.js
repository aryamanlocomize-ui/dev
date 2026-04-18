import { Review } from '../models/Review.js';
import { Restaurant } from '../models/Restaurant.js';

export const addOrUpdateReview = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ message: 'rating is required' });

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const review = await Review.findOneAndUpdate(
      { customer: req.user._id, restaurant: restaurantId },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const reviews = await Review.find({ restaurant: restaurantId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    restaurant.rating = Number(avgRating.toFixed(1));
    await restaurant.save();

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};
