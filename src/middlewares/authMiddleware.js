const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { findUserById } = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized. Token is missing.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await findUserById(decoded.id);

  if (!user) {
    throw new AppError('Unauthorized. User does not exist.', 401);
  }

  req.user = user;
  next();
});

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Forbidden. You are not allowed to perform this action.', 403));
  }

  return next();
};

module.exports = {
  protect,
  allowRoles
};
