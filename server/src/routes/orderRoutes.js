import { Router } from 'express';
import {
  assignDeliveryPartner,
  getMyOrders,
  placeOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, authorize('customer'), placeOrder);
router.get('/my', protect, getMyOrders);
router.patch('/:id/status', protect, authorize('restaurant', 'delivery', 'admin'), updateOrderStatus);
router.patch('/:id/assign', protect, authorize('admin'), assignDeliveryPartner);

export default router;
