
import pool from "../config/database.js";

const createPost = async ({
  id,
  title,
  content,
  slug,
  authorId,
  categoryIds = []
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert post.
    const postResult = await client.query(
      `INSERT INTO posts (
        id,
        title,
        content,
        slug,
        author_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        title,
        content,
        slug,
        status,
        author_id,
        version,
        published_at,
        created_at,
        updated_at`,
      [id, title, content, slug, authorId]
    );

    const post = postResult.rows[0];

    // Insert post-category relationships.
    if (categoryIds.length > 0) {
      const values = [];

      const placeholders = categoryIds.map((categoryId, index) => {
        const postIdParam = index * 2 + 1;
        const categoryIdParam = index * 2 + 2;

        values.push(post.id, categoryId);

        return `($${postIdParam}, $${categoryIdParam})`;
      });

      await client.query(
        `INSERT INTO post_categories (
          post_id,
          category_id
        )
        VALUES ${placeholders.join(", ")}
        ON CONFLICT (post_id, category_id) DO NOTHING`,
        values
      );
    }

    await client.query("COMMIT");

    return {
      ...post,
      categoryIds
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// GetAllPost with pagination , filtering and search  
const findAllPosts = async ({
  limit = 10,
  cursorDate = null,
  cursorId = null,
  status = null,
  authorId = null,
  categoryId = null,
  search = null,
  userId,
  userRole
}) => {
  const values = [];
  const conditions = [];

  const addCondition = (condition, value) => {
    values.push(value);
    conditions.push(condition.replace("?", `$${values.length}`));
  };

  // Visibility rules
  if (userRole === "reader") {
    conditions.push("p.status = 'published'");
  } else if (userRole === "author") {
    conditions.push(
      "(p.status = 'published' OR p.author_id = " +
      `(SELECT id FROM users WHERE id = $${values.push(userId)}))`
    );
  }

  // Optional filters
  if (status) {
    addCondition("p.status = ?", status);
  }

  if (authorId) {
    addCondition("p.author_id = ?", authorId);
  }

  if (categoryId) {
    addCondition(
      `EXISTS (
        SELECT 1
        FROM post_categories pc
        WHERE pc.post_id = p.id
          AND pc.category_id = ?
      )`,
      categoryId
    );
  }

  if (search) {
    addCondition("p.title ILIKE ?", `%${search}%`);
  }

  // Cursor pagination
  if (cursorDate && cursorId) {
    values.push(cursorDate, cursorId);

    conditions.push(
      `(p.created_at, p.id) < ($${values.length - 1}::timestamptz, $${values.length}::uuid)`
    );
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  values.push(limit + 1);

  const result = await pool.query(
    `SELECT
      p.id,
      p.title,
      p.content,
      p.slug,
      p.status,
      p.author_id,
      p.version,
      p.published_at,
      p.created_at,
      p.updated_at,
      u.name AS author_name,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'slug', c.slug
            )
          )
          FROM post_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.post_id = p.id
        ),
        '[]'::json
      ) AS categories
    FROM posts p
    JOIN users u ON u.id = p.author_id
    ${whereClause}
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT $${values.length}`,
    values
  );

  return result.rows;
};

// Get By Id
const findPostById = async (postId) => {
  const result = await pool.query(
    `SELECT
      p.id,
      p.title,
      p.content,
      p.slug,
      p.status,
      p.author_id,
      p.version,
      p.published_at,
      p.created_at,
      p.updated_at,
      u.name AS author_name,
      u.email AS author_email,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'slug', c.slug
            )
          )
          FROM post_categories pc
          JOIN categories c ON c.id = pc.category_id
          WHERE pc.post_id = p.id
        ),
        '[]'::json
      ) AS categories
    FROM posts p
    JOIN users u ON u.id = p.author_id
    WHERE p.id = $1
    LIMIT 1`,
    [postId]
  );

  return result.rows[0] || null;
};

// Update Post
const updatePost = async ({
  postId,
  authorId,
  isAdmin,
  version,
  title,
  content,
  categoryIds
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const values = [postId, version, isAdmin, authorId];
    const updates = [];

    // Update only provided fields.
    if (title !== undefined) {
      values.push(title);
      updates.push(`title = $${values.length}`);
    }

    if (content !== undefined) {
      values.push(content);
      updates.push(`content = $${values.length}`);
    }

    // Always increment version when an update succeeds.
    updates.push("version = version + 1");
    updates.push("updated_at = CURRENT_TIMESTAMP");

    const postResult = await client.query(
      `UPDATE posts
       SET ${updates.join(", ")}
       WHERE id = $1
         AND version = $2
         AND ($3::boolean = TRUE OR author_id = $4)
       RETURNING
         id,
         title,
         content,
         slug,
         status,
         author_id,
         version,
         published_at,
         created_at,
         updated_at`,
      values
    );

    const updatedPost = postResult.rows[0];

    // No matching post, unauthorized author, or outdated version.
    if (!updatedPost) {
      await client.query("ROLLBACK");
      return null;
    }

    // Replace categories only when categoryIds is provided.
    if (categoryIds !== undefined) {
      await client.query(
        `DELETE FROM post_categories
         WHERE post_id = $1`,
        [postId]
      );

      if (categoryIds.length > 0) {
        const categoryValues = [];

        const placeholders = categoryIds.map((categoryId, index) => {
          const postIdParam = index * 2 + 1;
          const categoryIdParam = index * 2 + 2;

          categoryValues.push(postId, categoryId);

          return `($${postIdParam}, $${categoryIdParam})`;
        });

        await client.query(
          `INSERT INTO post_categories (
            post_id,
            category_id
          )
          VALUES ${placeholders.join(", ")}
          ON CONFLICT (post_id, category_id) DO NOTHING`,
          categoryValues
        );
      }
    }

    await client.query("COMMIT");

    return {
      ...updatedPost,
      categoryIds
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Delete Post 
const deletePost = async (postId) => {
  const result = await pool.query(
    `DELETE FROM posts
     WHERE id = $1
     RETURNING
       id,
       title,
       slug,
       status,
       author_id`,
    [postId]
  );

  return result.rows[0] || null;
};

// change status from draft to publish
const publishPost = async (postId) => {
  const result = await pool.query(
    `UPDATE posts
     SET
       status = 'published',
       published_at = CURRENT_TIMESTAMP,
       version = version + 1,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status = 'draft'
     RETURNING
       id,
       title,
       content,
       slug,
       status,
       author_id,
       version,
       published_at,
       created_at,
       updated_at`,
    [postId]
  );

  return result.rows[0] || null;
};

export default {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
  publishPost
};
