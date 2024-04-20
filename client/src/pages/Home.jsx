// Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from "react-cookie";
import UpdateRecipe from '../pages/UpdateRecipe';
import DeleteRecipe from '../pages/DeleteRecipe';
import LikeRecipe from '../pages/LikeRecipe'; // Import the LikeRecipe component
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const updateLikes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Recipes</h1>
      {recipes.map((recipe) => (
        <div key={recipe._id} className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">{recipe.instructions}</p>
                <p className="card-text">Cooking Time: {recipe.cookingTime} (minutes)</p>
                <img src={recipe.imageUrl} className="card-img-top" alt={recipe.name} />
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <button onClick={() => saveRecipe(recipe._id)} className={`btn ${isRecipeSaved(recipe._id) ? 'btn-secondary' : 'btn-primary'}`}>
                    {isRecipeSaved(recipe._id) ? "Unsave" : "Save"}
                  </button>
                  {recipe.userOwner === userID && (
                    <DeleteRecipe recipeID={recipe._id} userID={userID} authToken={authToken} updateRecipes={updateRecipes} />
                  )}
                  {recipe.userOwner !== userID && (
                    <LikeRecipe recipe={recipe} userID={userID} authToken={authToken} updateLikes={updateLikes} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {recipe.userOwner === userID && (
            <div className="col-md-8">
              <UpdateRecipe recipeID={recipe._id} userID={userID} authToken={authToken} updateRecipes={updateRecipes} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
