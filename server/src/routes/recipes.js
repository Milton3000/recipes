import express from 'express';
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getSavedRecipeIDs, getSavedRecipes } from '../controllers/SavedRecipesController.js';

const router = express.Router();


// Don't have any conditions, we want to find all of the documents (recipes) to be shown at the Home page.
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


// We want to be able to save a recipe by changing the model of our Users to include a field called "saved recipes" and that field will be an array of recipes that you saved. Added "Saved Recipes" in UserSchema.
// userId = To find which user we want to change their saved recipes field.
// recipeId = To insert into that array.

router.put("/", verifyToken, async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe); // Want to add it
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.json(error)
    }
});

router.delete("/", verifyToken, async (req, res) => {
    try {
        const { recipeID, userID } = req.body;
        
        // Find the user
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove the recipe ID from the user's savedRecipes array
        user.savedRecipes = user.savedRecipes.filter(savedRecipeID => savedRecipeID.toString() !== recipeID.toString());
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// In the Frontend we want to get a list of all the recipe ID's that a user who is logged in to at the moment have saved. Need to make a specific route that is going to get the ID's that were saved by a user.

router.get("/savedRecipes/ids/:userID", getSavedRecipeIDs); // Linking to the function
router.get("/savedRecipes/:userID", getSavedRecipes); // Linking to the function


export {router as recipesRouter};

