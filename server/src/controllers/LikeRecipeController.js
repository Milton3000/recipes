
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { LikeModel } from "../models/LikeModel.js";

export const likeRecipe = async (req, res) => {
  try {
    const { userID } = req.body;
    console.log('Liking recipe for user:', userID);

    const recipe = await RecipeModel.findById(req.params.recipeID);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    if (recipe.userOwner === userID) {
      return res.status(403).json({ error: "You can't like your own recipe" });
    }

    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const like = await LikeModel.findOne({ user: userID, recipe: req.params.recipeID });
    if (like) {
      // User already liked the recipe, return success without incrementing likes
      return res.json({ success: true });
    }

    // User hasn't liked the recipe before, increment likes and save the like
    recipe.likes++;
    await Promise.all([recipe.save(), LikeModel.create({ user: userID, recipe: req.params.recipeID })]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const unlikeRecipe = async (req, res) => {
  try {
    const { userID } = req.body;
    console.log('Unliking recipe for user:', userID);

    // Find the like record associated with the user and recipe
    const like = await LikeModel.findOne({ user: userID, recipe: req.params.recipeID });
    console.log('Found like:', like); // Debugging
    if (!like) {
      // Hantera om like inte existerar
      console.log('No existing like found.'); // Debugging
      return res.json({ success: true, message: 'No existing like found.' });
    }

    // Ta bort like record
    await LikeModel.deleteOne({ _id: like._id });
    console.log('Like removed successfully.'); // Debugging

    // Decrement the like count of the associated recipe
    await RecipeModel.findByIdAndUpdate(req.params.recipeID, { $inc: { likes: -1 } });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
