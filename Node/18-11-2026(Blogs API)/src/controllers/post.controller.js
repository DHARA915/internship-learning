import postService from "../services/post.service.js";

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(
      req.body,
      req.user
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post
      }

    });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const result = await postService.getAllPosts(
      req.validatedQuery,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await postService.deletePost(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

// Publish post (Draft -> Publish)
const publishPost = async (req, res, next) => {
  try {
    const post = await postService.publishPost(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Post published successfully",
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};


export default {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost
};