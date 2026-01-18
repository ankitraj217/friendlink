// src/routes/searchRoutes.js
import express from "express";
import db from "../configs/db.js";
import { requireAuth } from '../middlewares/authMiddleware.js';

const searchRouter = express.Router();


// SEARCH USERS
// GET /api/search/users?q=ank
searchRouter
    .get("/users", requireAuth, async (req, res) => {
        try {
            const q = req.query.q?.trim();

            if (!q || q.length < 2) {
                return res.json([]); // avoid heavy queries
            }

            const sql = `
                SELECT 
                    u.id,
                    u.name,
                    u.avatar,
                    p.username

                FROM users u
                JOIN profiles p ON p.user_id = u.id

                WHERE 
                    u.name LIKE ?
                    OR p.username LIKE ?

                ORDER BY p.verified DESC, p.username ASC
                LIMIT 10
            `;

            const like = `%${q}%`;
            const [rows] = await db.execute(sql, [like, like]);

            res.json(rows);
        } catch (err) {
            console.error("User search error:".red, err);
            res.status(500).json({ error: "Search failed" });
        }
    });

export default searchRouter;