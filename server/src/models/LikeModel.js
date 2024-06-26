import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Referens till user som gillade recipe
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'recipes', required: true }, // Referense till liked recipe
});

// Ensure that each user can only like a recipe once
LikeSchema.index({ user: 1, recipe: 1 }, { unique: true });

const LikeModel = mongoose.model('likes', LikeSchema);

export { LikeModel };
