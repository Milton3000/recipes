import { UserModel } from '../models/Users.js';
import { RecipeModel } from "../models/Recipes.js";

// Function för aved recipes IDs
export const getSavedRecipeIDs = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (error) {
        res.json(error)
    }
};

// Function för saved recipes details
export const getSavedRecipes = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: {$in: user.savedRecipes },
        });
        res.json({ savedRecipes });
    } catch (error) {
        res.json(error)
    }
};
