
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'recipes', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model('reviews', ReviewSchema);

export { ReviewModel };
