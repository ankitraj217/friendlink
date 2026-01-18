// src/controllers/likeController.js
import db from '../configs/db.js';

// Create a new like
export const createLike = async (userId, postId) => {
    const sql = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
    const [response] = await db.execute(sql, [userId, postId]);
    return response;
};

// Delete an existing like
export const deleteLike = async (userId, postId) => {
    const sql = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
    const [response] = await db.execute(sql, [userId, postId]);
    return response;
};