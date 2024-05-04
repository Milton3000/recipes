// routes/LikedRecipesRouter.js

import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { likeRecipe, unlikeRecipe } from '../controllers/LikeRecipeController.js';

const router = express.Router();

router.put('/:recipeID/like', verifyToken, likeRecipe);
router.put('/:recipeID/unlike', verifyToken, unlikeRecipe);

export default router;
