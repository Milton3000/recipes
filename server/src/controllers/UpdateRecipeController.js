
import { RecipeModel } from "../models/Recipes.js";

export const updateRecipe = async (req, res) => {
  try {
    const { recipeID } = req.params;
    const { userID, name, ingredients, instructions, imageUrl, cookingTime } = req.body;

    // Find the recipe
    const recipe = await RecipeModel.findById(recipeID);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user is the owner of the recipe
    if (recipe.userOwner.toString() !== userID) {
      return res.status(403).json({ error: "You are not authorized to update this recipe" });
    }

    // Uppdatera recipe fields
    recipe.name = name;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.imageUrl = imageUrl;
    recipe.cookingTime = cookingTime;

    // Save uppdaterade recip
    await recipe.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
