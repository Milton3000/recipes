import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

const app = express();


// json middleware, will convert it to json. You wont get data from frontend without it.

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);


mongoose.connect("mongodb+srv://MiltonK:test123@recipedatabase.i7qnalj.mongodb.net/recipedatabase"
);


app.listen(3001, () => console.log("SERVER STARTED!"));

