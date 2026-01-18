// src/routes/friendRoute.js
import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
    createFriendRequest,
    acceptFriendRequest,
    deleteFriend,
    getFriends,
    getFriendRequests,
    getFriendStatus
} from '../controllers/friendController.js';

const friendRoute = express.Router();

friendRoute
    .get('/', requireAuth, async (req, res) => {
        try {
            const friends = await getFriends(req.user);
            res.json(friends);
        } catch (err) {
            console.error('Error : GET /friends', err);
            res.status(500).send('Server Error');
        }
    })
    .get('/status/:userId', requireAuth, async (req, res) => {
        try {
            const authUserId = req.user;
            const otherUserId = req.params.userId;

            const result = await getFriendStatus(authUserId, otherUserId);
            res.json(result);
        } catch (err) {
            console.error('Error : GET /friends/status', err);
            res.status(500).send('Server Error');
        }
    })
    .get('/requests', requireAuth, async (req, res) => {
        try {
            const requests = await getFriendRequests(req.user);
            res.json(requests);
        } catch (err) {
            console.error('Error : GET /friends/requests', err);
            res.status(500).send('Server Error');
        }
    })
    .post('/request/:userId', requireAuth, async (req, res) => {
        const fromUserId = req.user;
        const toUserId = req.params.userId;
        // Prevent sending friend request to oneself
        if (fromUserId === toUserId) {
            return res.status(400).send('Cannot send request to yourself');
        }
        try {
            await createFriendRequest(fromUserId, toUserId);
            res.status(201).send('Friend request sent');
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('Friend request already exists');
            }
            console.error('Error : POST /friends/request', err);
            res.status(500).send('Server Error');
        }
    })
    .post('/accept/:userId', requireAuth, async (req, res) => {
        const userId = req.user;
        const otherUserId = req.params.userId;
        try {
            const result = await acceptFriendRequest(userId, otherUserId);
            // Check if any rows were affected (i.e., if the request existed)
            if (result.affectedRows === 0) {
                return res.status(404).send('Friend request not found');
            }
            res.send('Friend request accepted');
        } catch (err) {
            console.error('Error : POST /friends/accept', err);
            res.status(500).send('Server Error');
        }
    })
    .delete('/:userId', requireAuth, async (req, res) => {
        const userId = req.user;
        const otherUserId = req.params.userId;
        try {
            const result = await deleteFriend(userId, otherUserId);
            // Check if any rows were affected (i.e., if the friendship existed)
            if (result.affectedRows === 0) {
                return res.status(404).send('Friend not found');
            }
            res.send('Friend removed');
        } catch (err) {
            console.error('Error : DELETE /friends', err);
            res.status(500).send('Server Error');
        }
    });

export default friendRoute;
