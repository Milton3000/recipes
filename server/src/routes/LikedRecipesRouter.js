// routes/LikedRecipesRouter.js
import express from 'express';
import { verifyToken } from './users.js';
import { RecipeModel } from '../models/Recipes.js';
import { UserModel } from '../models/Users.js';
import { LikeModel } from '../models/LikeModel.js'; // Import LikeModel

const router = express.Router();

router.put('/:recipeID/like', verifyToken, async (req, res) => {
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

    // Check if the user has already liked the recipe
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
});

router.put('/:recipeID/unlike', verifyToken, async (req, res) => {
  try {
    const { userID } = req.body;
    console.log('Unliking recipe for user:', userID);

    // Find the like record associated with the user and recipe
    const like = await LikeModel.findOne({ user: userID, recipe: req.params.recipeID });
    console.log('Found like:', like); // Add this line for debugging
    if (!like) {
      // Handle case when like doesn't exist
      console.log('No existing like found.'); // Add this line for debugging
      return res.json({ success: true, message: 'No existing like found.' });
    }

    // Remove the like record
    await LikeModel.deleteOne({ _id: like._id });
    console.log('Like removed successfully.'); // Add this line for debugging

    // Decrement the like count of the associated recipe
    await RecipeModel.findByIdAndUpdate(req.params.recipeID, { $inc: { likes: -1 } });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;

// // Backend: recipes.js KAN SKIPPA FÖRMODLIGEN, KÖR BARA PUT.
// router.delete("/like/:recipeID", verifyToken, async (req, res) => {
//     try {
//         const { userID } = req.query;
//         console.log("Unliking recipe for user:", userID);
//         // Find the user
//         const user = await UserModel.findById(userID);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Check if the user has likedRecipes array
//         if (!user.likedRecipes) {
//             user.likedRecipes = [];
//         }

//         // Check if the recipe is in the user's likedRecipes
//         const index = user.likedRecipes.indexOf(recipeID);
//         if (index !== -1) {
//             // If the recipe is liked, remove it from the likedRecipes array
//             user.likedRecipes.splice(index, 1);
//             await user.save();
//             res.json({ success: true });
//         } else {
//             // If the recipe is not liked, send an error message
//             res.status(404).json({ error: "Recipe is not liked by the user" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
