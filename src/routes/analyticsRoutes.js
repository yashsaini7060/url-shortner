
import express from 'express';
import { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics } from '../controllers/analyticsController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overall', isAuthenticated, getOverallAnalytics);
router.get('/:alias', isAuthenticated, getUrlAnalytics);
router.get('/topic/:topic', isAuthenticated, getTopicAnalytics);
export default router;
