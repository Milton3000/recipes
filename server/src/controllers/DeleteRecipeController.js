
import { RecipeModel } from "../models/Recipes.js";

export const deleteRecipe = async (req, res) => {
    try {
        const { recipeID } = req.params;
        const { userID } = req.body;

        // Find recipe
        const recipe = await RecipeModel.findById(recipeID);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        // Check if the user is the owner of the recipe
        if (recipe.userOwner.toString() !== userID) {
            return res.status(403).json({ error: "You are not authorized to delete this recipe" });
        }

        // Delete
        await recipe.deleteOne();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
