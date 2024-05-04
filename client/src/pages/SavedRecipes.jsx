import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/${userID}`);
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  return (
    <div>
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
            </div>
            <div className="card-text">
    <strong>Ingredients:</strong>
    {recipe.ingredients.map((ingredient, index) => (
      <span key={index}>
        {index > 0 && ", "} {/* Add comma and space for all ingredients except the first one */}
        {ingredient}
      </span>
    ))}
  </div>
            <div className='instructions'>
              <span> <strong> How to: </strong>{recipe.instructions}</span>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <br/>
            <span>Cooking Time: {recipe.cookingTime} (minutes)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedRecipes;
