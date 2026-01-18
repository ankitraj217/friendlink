// src/configs/path.js
import path from 'path';

export const ProjectRoot = path.resolve(import.meta.dirname, '../../'); // Project root directory
export const UploadsDir = path.join(ProjectRoot, 'uploads'); // Uploads directory