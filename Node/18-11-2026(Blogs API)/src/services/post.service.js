
import { randomUUID } from "node:crypto";
import postRepository from "../repositories/posts.repository.js";
import generateSlug from "../utils/slug.util.js";

const createPost = async ({ title, content, categoryIds = [] }, user) => {
  const postId = randomUUID();

  const baseSlug = generateSlug(title);

  if (!baseSlug) {
    const error = new Error("Unable to generate a valid post slug");
    error.statusCode = 400;
    throw error;
  }

  // Generate a unique slug for every post.
  const slug = `${baseSlug}-${postId}`;

  try {
    const post = await postRepository.createPost({
      id: postId,
      title,
      content,
      slug,
      authorId: user.id,
      categoryIds
    });

    return post;
  } catch (error) {
    if (error.code === "23505") {
      const conflictError = new Error(
        "A conflict occurred while creating the post"
      );
      conflictError.statusCode = 409;
      throw conflictError;
    }

    if (error.code === "23503") {
      const validationError = new Error(
        "One or more category IDs are invalid"
      );
      validationError.statusCode = 400;
      throw validationError;
    }

    throw error;
  }
};

const getAllPosts = async (filters, user) => {
  const {
    limit = 10,
    cursor,
    status,
    authorId,
    categoryId,
    search
  } = filters;

  let cursorDate = null;
  let cursorId = null;

  // Decode cursor if provided.
  if (cursor) {
    try {
      const decodedCursor = JSON.parse(
        Buffer.from(cursor, "base64url").toString("utf8")
      );

      if (
        !decodedCursor.createdAt ||
        !decodedCursor.id ||
        Number.isNaN(Date.parse(decodedCursor.createdAt)) ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedCursor.id)
      ) {
        throw new Error("Invalid cursor");
      }

      cursorDate = decodedCursor.createdAt;
      cursorId = decodedCursor.id;
    } catch {
      const error = new Error("Invalid pagination cursor");
      error.statusCode = 400;
      throw error;
    }
  }

  // Fetch one extra record to determine whether another page exists.
  const posts = await postRepository.findAllPosts({
    limit,
    cursorDate,
    cursorId,
    status,
    authorId,
    categoryId,
    search,
    userId: user.id,
    userRole: user.role
  });

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, limit) : posts;

  // Generate the next cursor from the last returned post.
  let nextCursor = null;

  if (hasNextPage && items.length > 0) {
    const lastPost = items[items.length - 1];

    nextCursor = Buffer.from(
      JSON.stringify({
        createdAt: lastPost.created_at,
        id: lastPost.id
      })
    ).toString("base64url");
  }

  return {
    posts: items,
    pagination: {
      limit,
      hasNextPage,
      nextCursor
    }
  };
};

// Get By Id
const getPostById = async (postId, user) => {
  const post = await postRepository.findPostById(postId);

  // Check whether the post exists.
  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  // Admin can view every post.
  if (user.role === "admin") {
    return post;
  }

  // Author can view published posts and their own drafts.
  if (user.role === "author") {
    const isOwnPost = post.author_id === user.id;
    const isPublished = post.status === "published";

    if (isOwnPost || isPublished) {
      return post;
    }
  }

  // Reader can view published posts only.
  if (user.role === "reader" && post.status === "published") {
    return post;
  }

  const error = new Error("You are not allowed to view this post");
  error.statusCode = 403;
  throw error;
};

// Update Post
const updatePost = async (postId, updates, user) => {
  // 1. Check whether the post exists.
  const existingPost = await postRepository.findPostById(postId);

  if (!existingPost) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check ownership.
  const isAdmin = user.role === "admin";
  const isOwner = existingPost.author_id === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error(
      "You are not allowed to update this post"
    );
    error.statusCode = 403;
    throw error;
  }

  // 3. Check optimistic locking version.
  if (updates.version !== existingPost.version) {
    const error = new Error(
      "Post has been modified. Please refresh and try again."
    );
    error.statusCode = 409;
    throw error;
  }

  // 4. Generate a new slug only when title is updated.
  let slug;

  if (updates.title !== undefined) {
    const baseSlug = generateSlug(updates.title);

    if (!baseSlug) {
      const error = new Error("Unable to generate a valid post slug");
      error.statusCode = 400;
      throw error;
    }

    // Preserve unique slug using the existing post ID.
    slug = `${baseSlug}-${postId}`;
  }

  try {
    const updatedPost = await postRepository.updatePost({
      postId,
      authorId: user.id,
      isAdmin,
      version: updates.version,
      title: updates.title,
      content: updates.content,
      categoryIds: updates.categoryIds,
      slug
    });

    // Another request may have updated the post after our initial check.
    if (!updatedPost) {
      const error = new Error(
        "Post was modified by another request. Please refresh and try again."
      );
      error.statusCode = 409;
      throw error;
    }

    return updatedPost;
  } catch (error) {
    if (error.code === "23503") {
      const validationError = new Error(
        "One or more category IDs are invalid"
      );
      validationError.statusCode = 400;
      throw validationError;
    }

    if (error.code === "23505") {
      const conflictError = new Error("Post slug already exists");
      conflictError.statusCode = 409;
      throw conflictError;
    }

    throw error;
  }
};

// Delete Post
const deletePost = async (postId, user) => {
  // 1. Check whether the post exists.
  const existingPost = await postRepository.findPostById(postId);

  if (!existingPost) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check ownership and admin permission.
  const isAdmin = user.role === "admin";
  const isOwner = existingPost.author_id === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error(
      "You are not allowed to delete this post"
    );
    error.statusCode = 403;
    throw error;
  }

  // 3. Delete the post.
  const deletedPost = await postRepository.deletePost(postId);

  if (!deletedPost) {
    const error = new Error(
      "Post could not be deleted. Please try again."
    );
    error.statusCode = 409;
    throw error;
  }

  return deletedPost;
};

// Changes Status from Draft to Publish

const publishPost = async (postId, user) => {
  // 1. Check whether the post exists.
  const existingPost = await postRepository.findPostById(postId);

  if (!existingPost) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check ownership or admin permission.
  const isAdmin = user.role === "admin";
  const isOwner = existingPost.author_id === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error(
      "You are not allowed to publish this post"
    );
    error.statusCode = 403;
    throw error;
  }

  // 3. Prevent publishing an already published post.
  if (existingPost.status === "published") {
    const error = new Error("Post is already published");
    error.statusCode = 409;
    throw error;
  }

  // 4. Publish the post.
  const publishedPost = await postRepository.publishPost(postId);

  if (!publishedPost) {
    const error = new Error(
      "Post could not be published. Please refresh and try again."
    );
    error.statusCode = 409;
    throw error;
  }

  return publishedPost;
};


export default {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost
};
