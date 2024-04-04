import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useGetUserID } from '../hooks/useGetUserID';

const Home = () => {

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipe();
    fetchSavedRecipe();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {recipeID, userID});
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };

  // Functionality to add it to the button using disabled true/false. Button will not be clickable if it's saved.
  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div> 

      <h1> Recipes </h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2> {recipe.name} </h2>
              <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}> Save </button>
              <button> Like ❤️ </button>
            </div>
            <div className='instructions'>
          <p> {recipe.instructions} </p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p> Cooking Time: {recipe.cookingTime} (minutes) </p>
          </li>
        ))}
      </ul>
    </div>
  )
};

export default Home