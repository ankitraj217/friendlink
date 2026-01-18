// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET_KEY;

export const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send('Unauthorized - No token');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Unauthorized - Token missing');
        }
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded.userId;
        next();

    } catch (err) {
        console.log('Auth error:'.red, err.message);
        return res.status(401).send('Invalid or expired token');
    }
};
