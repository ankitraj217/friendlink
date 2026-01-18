// src/controllers/postController.js
import db from '../configs/db.js';

// Get posts by user ID
export const getPostsByUserId = async (userId) => {
    const sqlPosts = "SELECT * FROM posts WHERE user_id=? ORDER BY created DESC";
    const [resPosts] = await db.execute(sqlPosts, [userId]);
    return resPosts;
}

// Get post by post ID
export const getPostById = async (postId) => {
    const sqlPost = `   
        SELECT p.*, u.name, u.avatar, up.username
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN profiles up ON u.id = up.user_id
        WHERE p.id = ?
    `;
    const [resPost] = await db.execute(sqlPost, [postId]);
    return resPost[0];
}

// Create a new post
export const createPost = async (userId, mediaUrl, mediaType, caption, location) => {
    const sqlCreatePost = `
        INSERT INTO posts (user_id, media_url, media_type, caption, location) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [resCreatePost] = await db.execute(sqlCreatePost, [userId, mediaUrl, mediaType, caption, location]);
    return resCreatePost;
}

// Delete a post by post ID
export const deletePost = async (postId) => {
    const sqlDeletePost = "DELETE FROM posts WHERE id=?";
    const [resDeletePost] = await db.execute(sqlDeletePost, [postId]);
    return resDeletePost;
}