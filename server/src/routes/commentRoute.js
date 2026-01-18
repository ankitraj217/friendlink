// src/routes/commentRoute.js
import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { createComment, deleteComment, getCommentsByPostId } from '../controllers/commentController.js';

const commentRoute = express.Router();

commentRoute
    .get('/:postId', requireAuth, async (req, res) => {
        const { postId } = req.params;
        try {
            const comments = await getCommentsByPostId(postId);
            res.status(200).send({ comments });
        } catch (err) {
            console.log('Error : Get/comment/:postId'.red, err);
            res.status(500).send('Server Error');
        }
    })
    .post('/:postId', requireAuth, async (req, res) => {
        const userId = req.user;
        const { postId } = req.params;
        const { comment } = req.body;
        try {
            const result = await createComment(userId, postId, comment);
            if (!result) return res.status(400).send('Unable to comment this post');
            res.status(201).send(result);
        } catch (err) {
            console.log('Error : Post/comment/create'.red, err);
            res.status(500).send('Server Error');
        }
    })
    .delete('/:postId', requireAuth, async (req, res) => {
        const userId = req.user;
        const { postId } = req.params;
        try {
            const result = await deleteComment(userId, postId);
            if (!result) return res.status(400).send('Unable to uncomment this post');
            res.status(200).send(result);
        } catch (err) {
            console.log('Error : Delete/comment/delete'.red, err);
            res.status(500).send('Server Error');
        }
    });

export default commentRoute;