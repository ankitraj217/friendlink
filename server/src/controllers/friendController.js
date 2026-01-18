// src/controllers/friendController.js
import db from '../configs/db.js';

export const getFriendStatus = async (authUserId, otherUserId) => {
    // self profile
    if (authUserId === otherUserId) {
        return { status: 'self' };
    }
    const [rows] = await db.query(
        `
        SELECT user1_id, user2_id, status, requested_by
        FROM friends
        WHERE 
            (user1_id = ? AND user2_id = ?)
            OR
            (user1_id = ? AND user2_id = ?)
        LIMIT 1
        `,
        [authUserId, otherUserId, otherUserId, authUserId]
    );
    if (rows.length === 0) {
        return { status: 'none' };
    }
    const friendship = rows[0];
    // accepted
    if (friendship.status === 1) {
        return { status: 'friends' };
    }
    // pending
    if (friendship.requested_by === authUserId) {
        return { status: 'requested' };
    }
    return { status: 'pending' };
}

// Get friends list with user details
export const getFriendsList = async (userId) => {
    const sqlFriends = `
        SELECT u.id, u.name, u.avatar
        FROM friends f
        JOIN users u
            ON u.id = IF(f.user1_id = ?, f.user2_id, f.user1_id)
        WHERE 
            f.status = TRUE
        AND ? IN (f.user1_id, f.user2_id);
    `;

    const [resFriends] = await db.execute(sqlFriends, [userId, userId]);
    return resFriends;
};

// IMPORTANT: keep order same as DB constraint (user1_id < user2_id)
const normalizeUsers = (a, b) => (a < b ? [a, b] : [b, a]);

// Create a new friend request
export const createFriendRequest = async (fromUserId, toUserId) => {
    const [user1, user2] = normalizeUsers(fromUserId, toUserId);

    const sql = `
        INSERT INTO friends (user1_id, user2_id, status)
        VALUES (?, ?, FALSE)
    `;

    const [response] = await db.execute(sql, [user1, user2]);
    return response;
};

// Accept a friend request
export const acceptFriendRequest = async (userId, otherUserId) => {
    const [user1, user2] = normalizeUsers(userId, otherUserId);

    const sql = `
        UPDATE friends
        SET status = TRUE
        WHERE user1_id = ? AND user2_id = ? AND status = FALSE
    `;

    const [response] = await db.execute(sql, [user1, user2]);
    return response;
};

// Delete a friend
export const deleteFriend = async (userId, otherUserId) => {
    const [user1, user2] = normalizeUsers(userId, otherUserId);

    const sql = `
        DELETE FROM friends
        WHERE user1_id = ? AND user2_id = ?
    `;

    const [response] = await db.execute(sql, [user1, user2]);
    return response;
};

// Get friends' IDs
export const getFriends = async (userId) => {
    const sql = `
        SELECT
            CASE
                WHEN user1_id = ? THEN user2_id
                ELSE user1_id
            END AS friend_id
        FROM friends
        WHERE (user1_id = ? OR user2_id = ?)
          AND status = TRUE
    `;

    const [response] = await db.execute(sql, [userId, userId, userId]);
    return response;
};

// Get incoming friend requests
export const getFriendRequests = async (userId) => {
    const sql = `
        SELECT
            CASE
                WHEN user1_id = ? THEN user2_id
                ELSE user1_id
            END AS requester_id
        FROM friends
        WHERE (user1_id = ? OR user2_id = ?)
          AND status = FALSE
    `;

    const [response] = await db.execute(sql, [userId, userId, userId]);
    return response;
};
