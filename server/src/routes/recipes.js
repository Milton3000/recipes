import express from 'express';
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from '../models/Users.js';
import { verifyToken } from './users.js';

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

// Add this DELETE route to your recipesRouter

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

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes });
    } catch (error) {
        res.json(error)
    }
});

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
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

// PUT REQUEST FOR 

router.put("/like/:recipeID", verifyToken, async (req, res) => {
    try {
        const { userID } = req.body;
        console.log("Liking recipe for user:", userID);
        // Check if the user is the creator of the recipe or if recipe exists
        const recipe = await RecipeModel.findById(req.params.recipeID);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        if (recipe.userOwner === userID) {
            return res.status(403).json({ error: "You can't like your own recipe" });
        }

        // Find the user
        const user = await UserModel.findById(userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user has likedRecipes array
        if (!user.likedRecipes) {
            user.likedRecipes = [];
        }

        const index = user.likedRecipes.indexOf(req.params.recipeID);
        if (index !== -1) {
            // If already liked, remove the like
            user.likedRecipes.splice(index, 1);
        } else {
            // If not liked, add the like
            user.likedRecipes.push(req.params.recipeID);
        }
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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



export {router as recipesRouter};

