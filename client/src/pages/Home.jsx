import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from "react-cookie";
import UpdateRecipe from '../pages/UpdateRecipe';
import DeleteRecipe from '../pages/DeleteRecipe';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]); 
  const userID = useGetUserID();
  const [authToken, setAuthToken] = useState(""); // State to store the authentication token

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

    fetchRecipes();
    if (cookies.access_token) {
      fetchSavedRecipes();
      setAuthToken(cookies.access_token); // Set the authentication token
    }
  }, [cookies.access_token, userID]);

  const saveRecipe = async (recipeID) => {
    try {
      const alreadySaved = savedRecipes.includes(recipeID);

      if (alreadySaved) {
        // If already saved, remove it from saved recipes
        const response = await axios.delete("http://localhost:3001/recipes", {
          data: { recipeID, userID },
          headers: { authorization: authToken }
        });
        setSavedRecipes(savedRecipes.filter(id => id !== recipeID));
      } else {
        // If not saved, save it
        const response = await axios.put("http://localhost:3001/recipes", {
          recipeID,
          userID
        }, {
          headers: { authorization: authToken }
        });
        setSavedRecipes([...savedRecipes, recipeID]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const updateRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => saveRecipe(recipe._id)}>
                {isRecipeSaved(recipe._id) ? "Unsave" : "Save"}
              </button>
              {recipe.userOwner === userID && (
                <>
                  <UpdateRecipe recipeID={recipe._id} userID={userID} authToken={authToken} updateRecipes={updateRecipes} />
                  <DeleteRecipe recipeID={recipe._id} userID={userID} authToken={authToken} updateRecipes={updateRecipes} />
                </>
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
