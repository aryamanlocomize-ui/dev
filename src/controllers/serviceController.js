const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getServices, createService } = require('../models/Service');

const listServices = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const services = await getServices(category);

  return res.status(200).json({
    status: 'success',
    results: services.length,
    data: services
  });
});

const addService = asyncHandler(async (req, res) => {
  const { name, category, price } = req.body;

  if (!name || !category || price === undefined) {
    throw new AppError('Name, category, and price are required.', 400);
  }

  if (Number(price) <= 0) {
    throw new AppError('Price must be greater than 0.', 400);
  }

  const service = await createService({
    name,
    category,
    price: Number(price)
  });

  return res.status(201).json({
    status: 'success',
    message: 'Service added successfully.',
    data: service
  });
});

module.exports = {
  listServices,
  addService
};
