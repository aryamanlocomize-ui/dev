const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createUser, findUserByEmail } = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400);
  }

  if (!['customer', 'provider'].includes(role)) {
    throw new AppError('Role must be customer or provider.', 400);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError('Email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword, role });

  const token = signToken(user.id);

  return res.status(201).json({
    status: 'success',
    message: 'User registered successfully.',
    data: { user, token }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user.id);

  return res.status(200).json({
    status: 'success',
    message: 'Login successful.',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

module.exports = {
  register,
  login
};
