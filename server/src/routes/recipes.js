import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';

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

router.post("/", async (req, res) => {
    const recipe = new RecipeModel(req.body)
    try {
        // const response = await RecipeModel.find({});
        const response = await recipe.save();
        res.json(recipe);
    } catch (error) {
        res.json(error)
    }
});

// We want to be able to save a recipe by changing the model of our Users to include a field called "saved recipes" and that field will be an array of recipes that you saved. Added "Saved Recipes" in UserSchema.
// userId = To find which user we want to change their saved recipes field.
// recipeId = To insert into that array.

router.put("/", async (req, res) => {
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.json(error)
    }
});




export {router as recipesRouter};