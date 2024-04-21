import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the user who liked the recipe
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'recipes', required: true }, // Reference to the liked recipe
});

// Ensure that each user can only like a recipe once
LikeSchema.index({ user: 1, recipe: 1 }, { unique: true });

const LikeModel = mongoose.model('likes', LikeSchema);

export { LikeModel };
