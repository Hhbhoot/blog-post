import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import slugify from 'slugify';
import User from './src/Models/user.model.js';
import Post from './src/Models/post.model.js';

dotenv.config();

const samplePosts = [
  {
    title: 'Welcome to the Blog',
    content:
      'This is the first post on our blog. Discover news, updates, and stories from our team. Stay tuned for more content delivered directly to your feed.',
    categories: ['Announcement', 'General'],
    tags: ['welcome', 'news', 'blog'],
    status: 'published',
  },
  {
    title: 'How to Get the Most From This Blog',
    content:
      'Learn how to browse posts, follow categories, and search for the content that matters most to you. Our blog is designed to keep you informed and inspired.',
    categories: ['Guides', 'Tips'],
    tags: ['guide', 'tips', 'blogging'],
    status: 'published',
  },
  {
    title: 'Meet Our Authors',
    content:
      'Our team of authors shares insights, stories, and expert opinions across a wide range of topics. Get to know the people behind the writing and discover their latest work.',
    categories: ['Authors', 'Community'],
    tags: ['team', 'authors', 'community'],
    status: 'published',
  },
];

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to database successfully.');

  try {
    let admin = await User.findOne({ email: 'admin@example.com' });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('Admin123@', 10);
      admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Created admin user:', admin.email);
    } else {
      console.log('Admin user already exists:', admin.email);
    }

    const existingPostCount = await Post.countDocuments();

    if (existingPostCount > 0) {
      console.log(
        `Detected ${existingPostCount} existing post(s). Skipping sample post creation.`
      );
      process.exit(0);
    }

    const postsToCreate = samplePosts.map((post) => ({
      ...post,
      slug: slugify(post.title, { lower: true, strict: true }),
      author: admin._id,
      featuredImage: 'default-cover.jpg',
    }));

    const createdPosts = await Post.create(postsToCreate);
    console.log(`Created ${createdPosts.length} sample post(s).`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
