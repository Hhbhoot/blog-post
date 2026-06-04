import User from '../Models/user.model.js';
import AppError from '../Utils/appError.util.js';
import asyncHandler from '../Utils/asyncHandler.js';
import generateToken from '../Utils/jwt.js';
import validatePassword from '../Utils/validatePassword.js';
import bcrypt from 'bcryptjs';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name.trim() || !email.trim() || !password.trim()) {
    return next(new AppError('All fields are required', 400));
  }

  if (!validatePassword(password)) {
    return next(
      new AppError(
        'Password must be 8-32 characters long and include uppercase, lowercase, numbers, and symbols.',
        400,
      ),
    );
  }

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    return next(new AppError('User already exists', 400));
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hash });
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  res.cookie('token', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return next(new AppError('All fields are required', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid credentials', 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid credentials', 400));
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  res.cookie('token', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: token,
  });
});

export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const blacklistToken = await BlacklistToken.create({ token });

  res.cookie('token', null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: users,
  });
});

export const getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: user,
  });
});
