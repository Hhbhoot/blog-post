import express from 'express';
import {
  getAllUsers,
  getMe,
  login,
  logout,
  register,
} from '../Controllers/user.controller.js';
import { verifyToken } from '../Middleware/auth.middleware.js';
import { authorizedRoles } from '../Middleware/rba.middleware.js';

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').get(logout);
authRouter.route('/get-me').get(verifyToken, getMe);
authRouter
  .route('/get-users')
  .get(verifyToken, authorizedRoles('admin'), getAllUsers);

export default authRouter;
