import express from 'express';
import { verifyToken } from '../Middleware/auth.middleware.js';
import { authorizedRoles } from '../Middleware/rba.middleware.js';
import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePost,
  usersPost,
} from '../Controllers/post.controller.js';
import upload from '../Middleware/multer.middleware.js';

const postRouter = express.Router();

postRouter
  .route('/create')
  .post(
    upload.single('featuredImage'),
    verifyToken,
    authorizedRoles('admin'),
    createPost
  );

postRouter.route('/').get(verifyToken, getAllPosts);

postRouter.route('/users').get(verifyToken, usersPost);

postRouter.route('/:id').get(verifyToken, getSinglePost);

postRouter
  .route('/:id')
  .patch(verifyToken, authorizedRoles('admin'), updatePost);

postRouter
  .route('/:id')
  .delete(verifyToken, authorizedRoles('admin'), deletePost);

export default postRouter;
