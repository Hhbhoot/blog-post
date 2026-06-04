import jwt from 'jsonwebtoken';
import AppError from '../Utils/appError.util.js';
import User from '../Models/user.model.js';
import blacklistTokenModel from '../Models/blacklistToken.model.js';

export const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  const isBlackListed = await blacklistTokenModel.findOne({ token });

  if (isBlackListed) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }

    req.user = user;

    return next();
  } catch (error) {
    console.log('error', error);
    return next(new AppError('invalid or expired Token', 400));
  }
};
