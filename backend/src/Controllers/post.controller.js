import Post from '../Models/post.model.js';
import slugify from 'slugify';
import asyncHandler from '../Utils/asyncHandler.js';

export const createPost = asyncHandler(async (req, res, next) => {
  try {
    let { title, content, featuredImage, categories, tags, status } = req.body;

    if (!title.trim() || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    if (req.file) {
      featuredImage = req.file.path.replace('\\', '/');
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'A post with this title already exists.',
      });
    }

    const newPost = await Post.create({
      title,
      slug,
      content,
      author: req.user._id,
      featuredImage,
      categories,
      tags,
      status,
    });

    res.status(201).json({
      success: 'success',
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Title or slug must be unique.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Could not create post.',
      error: error.message,
    });
  }
});

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate('author', 'name')
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  const totalPages = Math.ceil(totalPosts / limit);
  res.status(200).json({
    success: true,
    message: 'Posts fetched successfully',
    data: posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
    },
  });
});

export const getSinglePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('author', 'name');
  res.status(200).json({
    success: true,
    message: 'Post fetched successfully',
    data: post,
  });
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: post,
  });
});

export const usersPost = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ author: req.user._id })
    .populate('author', 'name')
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments({ author: req.user._id });

  const totalPages = Math.ceil(totalPosts / limit);
  res.status(200).json({
    success: true,
    message: 'Posts fetched successfully',
    data: posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
    },
  });
});
