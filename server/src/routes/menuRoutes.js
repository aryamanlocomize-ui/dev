import { Router } from 'express';
import { addMenuItem, deleteMenuItem, updateMenuItem } from '../controllers/menuController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/:restaurantId', protect, authorize('restaurant', 'admin'), addMenuItem);
router.put('/item/:id', protect, authorize('restaurant', 'admin'), updateMenuItem);
router.delete('/item/:id', protect, authorize('restaurant', 'admin'), deleteMenuItem);

export default router;
