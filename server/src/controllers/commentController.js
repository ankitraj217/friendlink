// src/controllers/commentController.js
import db from '../configs/db.js';

// Get comments by post ID
export const getCommentsByPostId = async (postId) => {
    const sql = `
        SELECT c.*, u.name, u.avatar, up.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        JOIN profiles up ON u.id = up.user_id
        WHERE c.post_id = ?
        ORDER BY c.created DESC
    `;
    const [response] = await db.execute(sql, [postId]);
    return response;
};

// Create a new comment
export const createComment = async (userId, postId, comment) => {
    const sql = "INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)";
    const [response] = await db.execute(sql, [userId, postId, comment]);
    return response;
};

// Delete a comment
export const deleteComment = async (userId, postId) => {
    const sql = "DELETE FROM comments WHERE user_id = ? AND post_id = ?";
    const [response] = await db.execute(sql, [userId, postId]);
    return response;
};