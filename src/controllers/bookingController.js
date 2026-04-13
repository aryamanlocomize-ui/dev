const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const {
  createBooking,
  getBookingsByUserId,
  updateBookingStatus,
  findBookingById
} = require('../models/Booking');
const { findServiceById } = require('../models/Service');

const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

const createNewBooking = asyncHandler(async (req, res) => {
  const { serviceId, date } = req.body;

  if (!serviceId || !date) {
    throw new AppError('serviceId and date are required.', 400);
  }

  const service = await findServiceById(serviceId);
  if (!service) {
    throw new AppError('Service not found.', 404);
  }

  const booking = await createBooking({
    userId: req.user.id,
    serviceId,
    date,
    status: 'pending'
  });

  return res.status(201).json({
    status: 'success',
    message: 'Booking created successfully.',
    data: booking
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getBookingsByUserId(req.user.id);

  return res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings
  });
});

const changeBookingStatus = asyncHandler(async (req, res) => {
  const bookingId = Number(req.params.id);
  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    throw new AppError(`Status must be one of: ${allowedStatuses.join(', ')}`, 400);
  }

  const existingBooking = await findBookingById(bookingId);
  if (!existingBooking) {
    throw new AppError('Booking not found.', 404);
  }

  const updated = await updateBookingStatus({ bookingId, status });

  return res.status(200).json({
    status: 'success',
    message: 'Booking status updated.',
    data: updated
  });
});

module.exports = {
  createNewBooking,
  getMyBookings,
  changeBookingStatus
};
