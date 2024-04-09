import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from "react-cookie";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/savedRecipes/ids/${userID}`);
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLikedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/likedRecipes/ids/${userID}`);
        setLikedRecipes(response.data.likedRecipes || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
    fetchLikedRecipes();

    if (cookies.access_token) fetchSavedRecipes();
  }, [cookies.access_token, userID]); /* can skip the dependency array perhaps */

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", { recipeID, userID }, { headers: { authorization: cookies.access_token } } );
      setSavedRecipes(response.data.savedRecipes || []);
    } catch (error) {
      console.error(error);
    }
  };

  const likeRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes/like", { recipeID, userID });
      setLikedRecipes(response.data.likedRecipes || []);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Functionality to add it to the button using disabled true/false. Button will not be clickable if it's saved.
  const isRecipeSaved = (id) => savedRecipes.includes(id);
  const isRecipeLiked = (id) => likedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>

{recipe.userOwner && !recipe.userOwner.includes(userID) && recipe.userOwner !== userID && (
  <button onClick={() => likeRecipe(recipe._id)} disabled={isRecipeLiked(recipe._id)}>
    {isRecipeLiked(recipe._id) ? "Liked" : "Like ❤️"}
  </button>
)}

            </div>
            <div className='instructions'>
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
