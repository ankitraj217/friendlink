// src/routes/userRoute.js
import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';
import { getPostsByUserId } from '../controllers/postController.js';
import { getFriendsList } from '../controllers/friendController.js';
import { uploadUserAvatar } from '../configs/storage.js';

const userRouter = express.Router();

userRouter
    .get('/profile/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const userProfile = await getUserProfile(userId);
            if (!userProfile) return res.status(404).send('User Not Found');
            res.send({ profile: userProfile, message: 'Profile Retrieved' });
        } catch (err) {
            console.log('Error : Get/user/profile/:userId', err);
            return res.status(500).send("Server Error");
        }
    })
    .get('/posts/:userId', async (req, res) => {
        const { userId } = req.params;
        try {
            const userPosts = await getPostsByUserId(userId ? userId : req.user);
            if (!userPosts) return res.status(404).send('No Posts Found');
            res.send({ posts: userPosts, message: 'Posts Retrieved' });
        } catch (err) {
            console.log('Error : Get/user/posts/:userId', err);
            return res.status(500).send("Server Error");
        }
    })
    .get('/profile', requireAuth, async (req, res) => {
        try {
            const userProfile = await getUserProfile(req.user);
            if (!userProfile) return res.status(404).send('User Not Found');
            res.send({ profile: userProfile, message: 'Profile Retrieved' });
        } catch (err) {
            console.log('Error : Get/user/profile', err);
            return res.status(500).send("Server Error");
        }
    })
    .get('/friends/:userId', requireAuth, async (req, res) => {
        const { userId } = req.params;
        try {
            const friendsList = await getFriendsList(userId ? userId : req.user);
            if (!friendsList) return res.status(404).send('No Friends Found');
            res.send({ friends: friendsList, message: 'Friends Retrieved' });
        } catch (err) {
            console.log('Error : Get/user/friends/:userId', err);
            return res.status(500).send("Server Error");
        }
    })
    .put('/avatar', requireAuth, uploadUserAvatar.single('avatar'), async (req, res) => {
        const userId = req.user;
        // User avatar url
        const media = req.file ? req.file.filename : null;
        const avatarUrl = media ? `${process.env.SEVER_URL}/static/avatars/${media}` : null;
        try {
            await updateUserProfile(userId, { avatar: avatarUrl });
            res.send({ message: 'Avatar Updated', avatarPath });
        } catch (err) {
            console.log('Error : Put/user/avatar', err);
            return res.status(500).send("Server Error");
        }
    })
    .put('/profile/update', requireAuth, async (req, res) => {
        const userId = req.user;
        const fieldsToUpdate = req.body;
        try {
            await updateUserProfile(userId, fieldsToUpdate);
            res.send({ message: 'Profile Updated' });
        } catch (err) {
            console.log('Error : Post/user/profile/update', err);
            return res.status(500).send("Server Error");
        }
    })
    .delete('/delete', requireAuth, async (req, res) => {
        try {
            await deleteUser(req.user);
            res.send({ message: 'User Deleted' });
        } catch (err) {
            console.log('Error : Delete/user/delete', err);
            return res.status(500).send("Server Error");
        }
    });

export default userRouter;
