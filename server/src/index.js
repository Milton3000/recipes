// index.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';
import updateRecipeRouter from './routes/UpdateRecipeRouter.js'; 
import deleteRecipeRouter from './routes/DeleteRecipeRouter.js';
import likedRecipesRouter from './routes/LikedRecipesRouter.js'; // Import the LikedRecipesRouter

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
app.use("/update-recipe", updateRecipeRouter);
app.use("/delete-recipe", deleteRecipeRouter);
app.use("/liked-recipes", likedRecipesRouter); // Mount the LikedRecipesRouter

mongoose.connect("mongodb+srv://MiltonK:test123@recipedatabase.i7qnalj.mongodb.net/recipedatabase");

app.listen(3001, () => console.log("SERVER STARTED!"));
