// src/configs/storage.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UploadsDir } from './path.js';

// Helpers
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const createStorage = (subFolder) => {
    const targetDir = path.join(UploadsDir, subFolder);

    ensureDir(targetDir);

    return multer.diskStorage({
        destination: (_, __, cb) => cb(null, targetDir),
        filename: (_, file, cb) => {
            const ext = path.extname(file.originalname);
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            cb(null, uniqueName);
        }
    });
};

//  File filter to allow only images
const imageOnly = (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
};

// Exported multer instances
// Profile pictures
export const uploadUserAvatar = multer({
    storage: createStorage('avatars'),
    fileFilter: imageOnly,
    limits: { fileSize: 2 * 1024 * 1024 }
});
// Post media
export const uploadUserPost = multer({
    storage: createStorage('posts'),
    limits: { fileSize: 10 * 1024 * 1024 }
});