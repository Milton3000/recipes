// routes/users.js

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Importing the middleware

const router = express.Router();

// Middleware to log requests
const logRequests = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Apply the logRequests middleware to /register and /login endpoints
router.post("/register", logRequests, async (req, res) => {
  const { username, password } = req.body;

  // Making request to this collection here. It will return a promise so either try/catch or async/await.

  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: " User Registered Successfully!" });
});

router.post("/login", logRequests, async (req, res) => {
  const { username, password } = req.body;
  console.log("Received login request for username:", username);

  const user = await UserModel.findOne({ username });

  // Check if user exists
  if (!user) {
    console.log("User not found.");
    return res.json({ message: "User Doesn't Exist." });
  }

  // Compare hashed passwords
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Incorrect password.");
      return res.json({ message: "Username or Password Is Incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "secret");
    console.log("Login successful for username:", username);
    res.json({ token, userID: user._id });
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { router as userRouter };
