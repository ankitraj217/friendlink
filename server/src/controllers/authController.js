// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function generateUserId() {
    return 'user_' + crypto.randomBytes(19).toString('base64url').slice(0, 25);
}

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
}

export const generateResetToken = (userId) => {
    return jwt.sign(
        { uid: userId, type: 'PASSWORD_RESET' },
        process.env.JWT_RESET_SECRET_KEY,
        { expiresIn: '15m' }
    );
}

export const generateEmailVerifyToken = (userId) => {
    return jwt.sign(
        { uid: userId, type: 'EMAIL_VERIFY' },
        process.env.JWT_VERIFY_SECRET_KEY,
        { expiresIn: '30m' }
    );
};

export const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const matchPassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
}