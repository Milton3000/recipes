
import express from 'express';
import { addReview } from '../controllers/ReviewController.js';
import { getReviews } from '../controllers/ReviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


// Review Recipe Route
router.post('/', verifyToken, addReview);
router.get('/:recipeId', getReviews);

export default router;
