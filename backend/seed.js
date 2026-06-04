import dotenv from 'dotenv';
import User from './src/Models/user.model.js';
dotenv.config();
import mongoose from 'mongoose';

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    // 2. Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('⚠️ Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin123@',
      role: 'admin',
    });
    console.log('Admin created successfully:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};
createAdmin();
