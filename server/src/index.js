import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';
import updateRecipeRouter from './routes/UpdateRecipeRouter.js'; 
import deleteRecipeRouter from './routes/DeleteRecipeRouter.js';

const app = express();


// json middleware, will convert it to json. You wont get data from frontend without it.

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);
app.use("/update-recipe", updateRecipeRouter); // Mount the UpdateRecipeRouter
app.use("/delete-recipe", deleteRecipeRouter); // Mount the DeleteRecipeRouter


mongoose.connect("mongodb+srv://MiltonK:test123@recipedatabase.i7qnalj.mongodb.net/recipedatabase"
);


app.listen(3001, () => console.log("SERVER STARTED!"));

