import { randomUUID } from "node:crypto";

const posts = [];

export function createPost({ title, content, user }) {
    const post = {
        id: randomUUID(),
        title,
        content,
        userId: user.id,
        userName: user.name,
        createdAt: new Date().toISOString()
    };

    posts.push(post);

    return post;
}

export function getAllPosts() {
    return posts;
}