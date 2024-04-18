import React, { useState } from 'react';
import axios from 'axios';

const UpdateRecipe = ({ recipeID, userID, authToken, updateRecipes }) => {
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [""], // Initial ingredient field
    instructions: "",
    imageUrl: "",
    cookingTime: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if all required fields are provided
      if (!formData.name || !formData.instructions || !formData.imageUrl || !formData.cookingTime) {
        alert("Please fill in all required fields.");
        return;
      }

      await axios.put(`http://localhost:3001/update-recipe/${recipeID}`, { userID, ...formData }, {
        headers: { authorization: authToken }
      });
      alert("Recipe updated successfully");
      setFormData({
        name: "",
        ingredients: [""],
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
    <div className="update-recipe-form">
      <h2>Update Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Ingredients:</label>
          {formData.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="form-control mb-2"
            />
          ))}
          <button type="button" onClick={addIngredientField} className="btn btn-sm btn-secondary">Add Ingredient</button>
        </div>
        <div className="form-group">
          <label>Instructions:</label>
          <textarea name="instructions" value={formData.instructions} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Cooking Time (minutes):</label>
          <input type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Update Recipe</button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
