
import { ReviewModel } from '../models/Review.js';

export const addReview = async (req, res) => {
  try {
    console.log('Received review submission request');
    console.log('Recipe ID:', req.body.recipeId);
    console.log('Review:', req.body.review);

    const { recipeId, userId, review } = req.body;
    const newReview = new ReviewModel({
      recipe: recipeId,
      user: userId,
      review,
    });
    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await ReviewModel.find({ recipe: recipeId }).populate('user', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};