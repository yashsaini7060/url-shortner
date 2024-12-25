import express from 'express';
import { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics } from '../controllers/analyticsController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import limiter from '../middleware/rateLimiter.js';
const router = express.Router();

router.get('/overall', isAuthenticated, limiter, getOverallAnalytics);
router.get('/:alias', isAuthenticated, limiter, getUrlAnalytics);
router.get('/topic/:topic', isAuthenticated, limiter, getTopicAnalytics);

/**
 * @swagger
 * /api/analytics/{shortId}:
 *   get:
 *     summary: Get URL analytics
 *     description: Retrieve analytics for a specific shortened URL
 *     tags: [Analytics]
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: The short ID of the URL
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clicks:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found
 */

export default router;
