const express = require('express');
const {
  createNewBooking,
  getMyBookings,
  changeBookingStatus
} = require('../controllers/bookingController');
const { protect, allowRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createNewBooking);
router.get('/my', protect, getMyBookings);
router.patch('/:id/status', protect, allowRoles('provider', 'admin'), changeBookingStatus);

module.exports = router;
