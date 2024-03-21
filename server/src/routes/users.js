import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/Users.js'

const router = express.Router();


router.post("/register", async (req, res) => {
const { username, password } = req.body;

// Making request to this collection here. It will return a promise so either try/catch or async/await.
const user = await UserModel.findOne({ username });

if (user) {
    return res.json({ message: "User already exists!" })
}

const hashedPassword = await bcrypt.hash(password, 10) 

const newUser = new UserModel({ username, password: hashedPassword });
await newUser.save();

res.json({message: " User Registered Successfully!" });
});



router.post("/login");



export { router as userRouter };
