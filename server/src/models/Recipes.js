// models/Recipes.js
import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  userOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  likes: { type: Number, default: 0 }, // New field to store the number of likes
});

const RecipeModel = mongoose.model('recipes', RecipeSchema);

export { RecipeModel };
