// src/controllers/userController.js
import db from '../configs/db.js';

// Find user by ID or email
export const findUser = async (userId, email) => {
    const sqlUser = "SELECT * FROM users WHERE id=? OR email=?";
    const [resUser] = await db.execute(sqlUser, [userId, email]);
    return resUser[0];
}

// Create a new user
export const createUser = async (id, name, email, password) => {
    const sqlCreate = "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sqlCreate, [id, name, email, password]);
    return result;
}

// Update user details
export const updateUser = async (userId, fields) => {
    const setString = Object.keys(fields).map(key => `${key}=?`).join(', ');
    const values = Object.values(fields);
    values.push(userId);
    const sqlUpdate = `UPDATE users SET ${setString} WHERE id=?`;
    const [result] = await db.execute(sqlUpdate, values);
    return result;
}

// Get user profile by user ID
export const getUserProfile = async (userId) => {
    const sqlProfile = "SELECT u.id, u.name, u.avatar, u.email, u.joined, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id=?";
    const [resProfile] = await db.execute(sqlProfile, [userId]);
    return resProfile[0];
}

// Update or create user profile
export const updateUserProfile = async (userId, fields) => {
    if (!fields || Object.keys(fields).length === 0) {
        throw new Error("No profile fields provided");
    }

    const columns = Object.keys(fields);
    const values = Object.values(fields);

    // insert columns
    const insertCols = ["user_id", ...columns].join(", ");
    const insertPlaceholders = ["?", ...columns.map(() => "?")].join(", ");

    // update columns
    const updateSet = columns.map(col => `${col} = VALUES(${col})`).join(", ");

    const sql = `
        INSERT INTO profiles (${insertCols})
        VALUES (${insertPlaceholders})
        ON DUPLICATE KEY UPDATE ${updateSet}
    `;

    const [result] = await db.execute(sql, [userId, ...values]);
    return result;
};

// Delete user by ID
export const deleteUser = async (userId) => {
    const sqlDelete = "DELETE FROM users WHERE id=?";
    const [result] = await db.execute(sqlDelete, [userId]);
    return result;
}
