import { Router } from 'express';
import { getAnalytics, getRestaurantsAdmin, getUsers } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));
router.get('/users', getUsers);
router.get('/restaurants', getRestaurantsAdmin);
router.get('/analytics', getAnalytics);

export default router;
