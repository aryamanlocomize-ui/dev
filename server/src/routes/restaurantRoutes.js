import { Router } from 'express';
import {
  createRestaurant,
  getRestaurantById,
  getRestaurants
} from '../controllers/restaurantController.js';
import { addOrUpdateReview } from '../controllers/reviewController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorize('restaurant', 'admin'), createRestaurant);
router.post('/:restaurantId/reviews', protect, authorize('customer'), addOrUpdateReview);

export default router;
