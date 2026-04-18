import { User } from '../models/User.js';
import { signToken } from '../services/tokenService.js';
import { USER_ROLES } from '../utils/constants.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const safeRole = Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.CUSTOMER;

    const user = await User.create({ name, email, phone, password, role: safeRole, location });
    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user._id, role: user.role });
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};
