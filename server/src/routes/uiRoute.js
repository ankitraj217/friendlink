// src/rotues/uiRoute.js
import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getFeed, getExploreContent, getReels } from '../controllers/uiController.js';

const uiRouter = express.Router();

uiRouter
    .get('/feed', requireAuth, async (req, res) => {
        const userId = req.user;
        try {
            const feed = await getFeed(userId);
            res.send({ feed, message: 'Feed Retrieved' });
        } catch (err) {
            console.log('Error : Get/ui/feed'.red, err);
            return res.status(500).send("Server Error");
        }
    })
    .get('/explore', requireAuth, async (req, res) => {
        const userId = req.user;
        try {
            const exploreContent = await getExploreContent(userId);
            res.send({ explore: exploreContent, message: 'Explore Content Retrieved' });
        } catch (err) {
            console.log('Error : Get/ui/explore'.red, err);
            return res.status(500).send("Server Error");
        }
    })
    .get('/reels', requireAuth, async (req, res) => {
        const userId = req.user;
        try {
            const reels = await getReels(userId);
            res.send({ reels, message: 'Reels Retrieved' });
        } catch (err) {
            console.log('Error : Get/ui/reels'.red, err);
            return res.status(500).send("Server Error");
        }
    });

export default uiRouter;
