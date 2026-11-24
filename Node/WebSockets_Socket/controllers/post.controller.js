import { createPost, getAllPosts } from "../services/post.service.js";
import { eventBus } from "../eventBus/events/eventBus.js";

export function createPostController(req, res) {
    try {
        const { title, content } = req.body;

        // Get authenticated user from socket authentication equivalent
        const user = req.user;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // 1. Create post
        const post = createPost({
            title,
            content,
            user
        });

        // 2. Publish event after successful creation
        eventBus.emit("post.created", {
            actor: {
                id: user.id,
                name: user.name
            },
            post: {
                id: post.id,
                title: post.title
            }
        });

        // 3. Return response
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create post error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create post"
        });
    }
}

export function getAllPostsController(req, res) {
    try {
        const posts = getAllPosts();

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error("Get posts error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve posts"
        });
    }
}