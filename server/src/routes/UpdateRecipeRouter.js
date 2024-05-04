// routes/UpdateRecipeRouter.js

import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { updateRecipe } from '../controllers/UpdateRecipeController.js';

const router = express.Router();

// Update recipe route
router.put("/:recipeID", verifyToken, updateRecipe);

export default router;
