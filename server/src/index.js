import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'

import { userRouter } from './routes/users.js'

const app = express();


// json middleware, will convert it to json. You wont get data from frontend without it.

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);


mongoose.connect("mongodb+srv://MiltonK:test123@recipedatabase.i7qnalj.mongodb.net/"
);


app.listen(3001, () => console.log("SERVER STARTED!"));