import Post from '../Models/post.model.js';
import slugify from 'slugify';
import asyncHandler from '../Utils/asyncHandler.js';

const sanitizeArray = (arr) => {
  if (!arr) return [];
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string') {
      try {
        const parsed = JSON.parse(arr);
        if (Array.isArray(parsed)) return sanitizeArray(parsed);
      } catch (e) {
        return arr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [];
  }

  return arr.flatMap((item) => {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          return sanitizeArray(JSON.parse(trimmed));
        } catch (e) {
          return trimmed
            .replace(/[\[\]"]/g, '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      return trimmed;
    }
    return item;
  });
};

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
      categories: sanitizeArray(categories),
      tags: sanitizeArray(tags),
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

  const sanitizedPosts = posts.map((doc) => {
    const p = doc.toObject();
    p.categories = sanitizeArray(p.categories);
    p.tags = sanitizeArray(p.tags);
    return p;
  });

  res.status(200).json({
    success: true,
    message: 'Posts fetched successfully',
    data: sanitizedPosts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
    },
  });
});

export const getSinglePost = asyncHandler(async (req, res, next) => {
  const postDoc = await Post.findById(req.params.id).populate('author', 'name');
  if (!postDoc) {
    return res.status(404).json({
      success: false,
      message: 'Post not found.',
    });
  }

  const post = postDoc.toObject();
  post.categories = sanitizeArray(post.categories);
  post.tags = sanitizeArray(post.tags);

  res.status(200).json({
    success: true,
    message: 'Post fetched successfully',
    data: post,
  });
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
    data: post,
  });
});

export const updatePost = asyncHandler(async (req, res, next) => {
  let updateData = { ...req.body };

  if (req.file) {
    updateData.featuredImage = req.file.path.replace('\\', '/');
  }

  if (req.body.categories) {
    updateData.categories = sanitizeArray(req.body.categories);
  }

  if (req.body.tags) {
    updateData.tags = sanitizeArray(req.body.tags);
  }

  if (req.body.title) {
    updateData.slug = slugify(req.body.title, { lower: true, strict: true });
  }

  const postDoc = await Post.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!postDoc) {
    return res.status(404).json({
      success: false,
      message: 'Post not found.',
    });
  }

  const post = postDoc.toObject();
  post.categories = sanitizeArray(post.categories);
  post.tags = sanitizeArray(post.tags);

  res.status(200).json({
    success: 'success',
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

  const sanitizedPosts = posts.map((doc) => {
    const p = doc.toObject();
    p.categories = sanitizeArray(p.categories);
    p.tags = sanitizeArray(p.tags);
    return p;
  });

  res.status(200).json({
    success: true,
    message: 'Posts fetched successfully',
    data: sanitizedPosts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
    },
  });
});
