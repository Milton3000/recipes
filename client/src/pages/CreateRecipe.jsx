import React, { useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(['access_token']);

  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    cookingTime: 0,
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3001/recipes', recipe, {
        headers: { authorization: cookies.access_token },
      });
      alert('Recipe Created');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url('/bg.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh', 
      }}
    >
<div className="create-recipe" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
        <h2 className="text-center">Create Recipe</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="name" style={{ fontSize: '20px' }}>Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} />

          <label htmlFor="ingredients" style={{ fontSize: '20px' }}>Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              name="ingredients"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, index)}
            />
          ))}

          <button type="button" onClick={addIngredient}>
            Add Ingredient
          </button>

          <label htmlFor="instructions" style={{ fontSize: '20px' }}>Instructions</label>
    <textarea id="instructions" name="instructions" onChange={handleChange}></textarea>

    <label htmlFor="imageUrl" style={{ fontSize: '20px' }}>Image URL</label>
    <input type="text" id="imageUrl" name="imageUrl" onChange={handleChange} />

    <label htmlFor="cookingTime" style={{ fontSize: '20px' }}>Cooking Time (minutes)</label>
    <input type="number" id="cookingTime" name="cookingTime" onChange={handleChange} />
    <br />

          <button type="submit" style={{ fontSize: '20px' }}>Create Recipe</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
