import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './src/Middleware/error.middleware.js';

const __dirname = path.resolve();

import authRouter from './src/Routes/auth.routes.js';
import postRouter from './src/Routes/post.routes.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://blog-post-yvmg.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post', postRouter);

app.use(/.*/, (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `The reqeusted route ${req.originalUrl} not fount on this server`,
  });
});

app.use(ErrorMiddleware);
export default app;
