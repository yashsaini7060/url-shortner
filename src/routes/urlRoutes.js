import express from 'express';
import { createShortUrl, redirectUrl } from '../controllers/urlController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/shorten', isAuthenticated, createShortUrl);
router.get('/shorten/:alias', redirectUrl);
export default router;