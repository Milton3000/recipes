
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { deleteRecipe } from '../controllers/DeleteRecipeController.js';

const router = express.Router();

// Delete recipe route
router.delete("/:recipeID", verifyToken, deleteRecipe);

export default router;
