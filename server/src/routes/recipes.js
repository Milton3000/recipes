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
        user.savedRecipes.push(recipe); // Want to add it
        await user.save();
        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.json(error)
    }
});


// In the Frontend we want to get a list of all the recipe ID's that a user who is logged in to at the moment have saved. Need to make a specific route that is going to get the ID's that were saved by a user.

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (error) {
        res.json(error)
    }
});

router.get("/savedRecipes", async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userID);
        const savedRecipes = await RecipeModel.find({
            _id: {$in: user.savedRecipes },
        });
        res.json({ savedRecipes });
    } catch (error) {
        res.json(error)
    }
});

// Above code: Trying to get those where their ID is in the user.savedRecipes. So saved recipes from the user is an array of recipe id's.
// So we want to grab the saved recipes where their id is inside of the list over here: _id: {$in: user.savedRecipes }.

router.get("/likedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ likedRecipes: user?.likedRecipes });
    } catch (error) {
        res.json(error)
    }
});




export {router as recipesRouter};