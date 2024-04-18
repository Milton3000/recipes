import React, { useState } from 'react';
import axios from 'axios';

const UpdateRecipe = ({ recipeID, userID, authToken, updateRecipes }) => {
  const [formData, setFormData] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    imageUrl: "",
    cookingTime: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if all required fields are provided
      if (!formData.name || !formData.ingredients || !formData.instructions || !formData.imageUrl || !formData.cookingTime) {
        alert("Please fill in all required fields.");
        return;
      }

      await axios.put(`http://localhost:3001/update-recipe/${recipeID}`, { userID, ...formData }, {
        headers: { authorization: authToken }
      });
      alert("Recipe updated successfully");
      setFormData({
        name: "",
        ingredients: "",
        instructions: "",
        imageUrl: "",
        cookingTime: 0
      });
      updateRecipes();
    } catch (error) {
      console.error(error);
      alert("Failed to update recipe");
    }
  };

  return (
    <div>
      <h2>Update Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <label>Ingredients:</label>
        <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} />
        <label>Instructions:</label>
        <textarea name="instructions" value={formData.instructions} onChange={handleChange} />
        <label>Image URL:</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        <label>Cooking Time (minutes):</label>
        <input type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} />
        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
