// src/routes/postRoute.js
import express from 'express';
import { uploadUserPost } from '../configs/storage.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getPostById, createPost, deletePost } from '../controllers/postController.js';

const postRouter = express.Router();

postRouter
    .get('/:postId', requireAuth, async (req, res) => {
        const { postId } = req.params;
        try {
            const postData = await getPostById(postId);
            if (!postData) return res.status(404).send('Post Not Found');
            res.status(200).send({ post: postData });
        } catch (err) {
            console.error('Error : GET /post/:postId'.red, err);
            res.status(500).send("Server Error");
        }
    })
    .post('/create', requireAuth, uploadUserPost.single('media'), async (req, res) => {
        const userId = req.user;
        const { mediaType, caption, location } = req.body;
        // Media URL
        const media = req.file ? req.file.filename : null;
        const mediaUrl = media ? `${process.env.SERVER_URL}/static/posts/${media}` : null;

        try {
            const newPost = await createPost(userId, mediaUrl, mediaType, caption, location);
            if (!newPost) return res.status(404).send('Post Creation Failed');
            res.send({ messages: "Post Created", postId: newPost.insertId });
        } catch (err) {
            console.error('Error : POST /post/create'.red, err);
            res.status(500).send("Server Error");
        }
    })
    .delete('/delete/:postId', requireAuth, async (req, res) => {
        const { postId } = req.params;
        try {
            const deletedPost = await deletePost(postId);
            if (deletedPost.affectedRows === 0) return res.status(404).send('Post Not Found or Already Deleted');
            res.send({ messages: "Post Deleted" });
        } catch (err) {
            console.error('Error : DELETE /post/delete/:postId'.red, err);
            res.status(500).send("Server Error");
        }
    });

export default postRouter;
