import express from 'express';
import { createShortUrl, redirectUrl } from '../controllers/urlController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
const router = express.Router();

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create short URL
 *     description: Creates a shortened URL from a long URL
 *     tags: [URLs]
 *     security:
 *       - googleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original URL to shorten
 *     responses:
 *       200:
 *         description: Short URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.post('/shorten', isAuthenticated, createShortUrl);
router.get('/shorten/:alias', redirectUrl);
export default router;