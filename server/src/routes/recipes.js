import express from 'express';
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getSavedRecipeIDs, getSavedRecipes } from '../controllers/SavedRecipesController.js';

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        res.json(response);
    } catch (error) {
        res.json(error)
    }
});

// Inkludera userOwner i nytt recept

router.post("/", verifyToken, async (req, res) => {
    const { name, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;
    try {
        const recipe = new RecipeModel({ name, ingredients, instructions, imageUrl, cookingTime, userOwner });
        const response = await recipe.save();
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put("/", verifyToken, async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe); // Addera
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.json(error)
    }
});

router.delete("/", verifyToken, async (req, res) => {
    try {
        const { recipeID, userID } = req.body;
        
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.savedRecipes = user.savedRecipes.filter(savedRecipeID => savedRecipeID.toString() !== recipeID.toString());
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Saved Recipes Routes

router.get("/savedRecipes/ids/:userID", getSavedRecipeIDs);
router.get("/savedRecipes/:userID", getSavedRecipes); 


export {router as recipesRouter};

