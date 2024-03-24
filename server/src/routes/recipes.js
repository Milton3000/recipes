import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from "../models/Recipes.js";

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




export {router as recipesRouter};