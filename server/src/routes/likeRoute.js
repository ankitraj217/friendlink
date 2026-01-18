// src/routes/likeRoute.js
import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { createLike, deleteLike } from '../controllers/likeController.js';

const likeRoute = express.Router();

likeRoute
    .post('/:postId', requireAuth, async (req, res) => {
        const userId = req.user;
        const { postId } = req.params;
        try {
            const result = await createLike(userId, postId);
            if (!result) return res.status(400).send('Unable to like this post');
            res.status(201).send(result);
        } catch (err) {
            console.log('Error : Post/like/create'.red, err);
            res.status(500).send('Server Error');
        }
    })
    .delete('/:postId', requireAuth, async (req, res) => {
        const userId = req.user;
        const { postId } = req.params;
        try {
            const result = await deleteLike(userId, postId);
            if (!result) return res.status(400).send('Unable to unlike this post');
            res.status(200).send(result);
        } catch (err) {
            console.log('Error : Delete/like/delete'.red, err);
            res.status(500).send('Server Error');
        }
    });

export default likeRoute;