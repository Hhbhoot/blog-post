import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './src/Db/index.js';

const PORT = process.env.PORT || 5000;

connectDB();
const server = app.listen(PORT, (err) => {
  if (err) {
    console.log('Failed to start server', err);
  }

  console.log(`server running on http://localhost:${PORT}`);
});
