// src/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import colors from 'colors';
import dotenv from 'dotenv';

import { initializedDatabase } from './src/configs/db.js';
import { ProjectRoot, UploadsDir } from './src/configs/path.js';
import {
    authRoutes, userRoutes, postRoutes,
    likeRoutes, friendRoutes,
    commentRoutes, uiRoutes, searchRoutes
} from './src/routes/index.js';

dotenv.config(); // Load environment variables
initializedDatabase(); // Database connection

// Express App
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public Static Files
app.use(express.static(path.join(ProjectRoot, 'public')));

// Uploads
app.use('/static/avatars', express.static(path.join(UploadsDir, 'avatars')));
app.use('/static/posts', express.static(path.join(UploadsDir, 'posts')));

// Routes
app.use('/api', uiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/notifications', notificationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`FriendLink Server running on port:${PORT}`.green.bold);
});