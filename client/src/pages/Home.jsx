import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from "react-cookie";
import UpdateRecipe from '../pages/UpdateRecipe';
import DeleteRecipe from '../pages/DeleteRecipe';
import LikeRecipe from '../pages/LikeRecipe';
import Review from '../pages/Review';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const [authToken, setAuthToken] = useState("");

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
      setAuthToken(cookies.access_token);
    }
  }, [cookies.access_token, userID]);

  const saveRecipe = async (recipeID) => {
    try {
      if (!cookies.access_token) {
        alert("You are not authorized to do this. Please login or register first.");
        return;
      }

      const alreadySaved = savedRecipes.includes(recipeID);

      if (alreadySaved) {
        await axios.delete("http://localhost:3001/recipes", {
          data: { recipeID, userID },
          headers: { authorization: authToken }
        });
        console.log("Recipe unsaved:", recipeID);
        setSavedRecipes(savedRecipes.filter(id => id !== recipeID));
      } else {
        await axios.put("http://localhost:3001/recipes", {
          recipeID,
          userID
        }, {
          headers: { authorization: authToken }
        });
        console.log("Recipe saved:", recipeID);
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
    <div className="container-fluid" style={{ backgroundImage: `url('/bg.jpg')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '300px',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <h1 style={{ color: 'black' }}>Recipes</h1>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-6 g-4">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="col-md-3 mb-4">
            <div className="card h-80">
              <div className="card-body">
                <h3 className="card-title">{recipe.name}</h3>
                <span className="card-text">{recipe.instructions}</span>
                <div className="card-text">
                  <strong>Ingredients: </strong>
                  {recipe.ingredients.map((ingredient, index) => (
                    <span key={index}>
                      {index > 0 && ", "}
                      {ingredient}
                    </span>
                  ))}
                </div>

                <img src={recipe.imageUrl} className="card-img-top" alt={recipe.name} />
                <span className="card-text">Cooking Time: {recipe.cookingTime} (minutes)</span>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center mb-2">
                <div>
                  <button onClick={() => saveRecipe(recipe._id)} className={`mb-2 btn ${isRecipeSaved(recipe._id) ? 'btn-secondary' : 'btn-primary'}`}>
                    {isRecipeSaved(recipe._id) ? "Unsave" : "Save"}
                  </button>
                  {recipe.userOwner === userID && (
                    <DeleteRecipe recipeID={recipe._id} userID={userID} authToken={authToken} updateRecipes={updateRecipes} />
                  )}
                  {recipe.userOwner !== userID && (
                    <LikeRecipe recipe={recipe} userID={userID} authToken={authToken} updateLikes={updateLikes} />
                  )}
                </div>
                <span>{recipe.likes} ❤️</span>
              </div>
              {recipe.userOwner === userID && (
                <div className="card-footer">
                  <UpdateRecipe recipeID={recipe._id} userID={userID} authToken={authToken} recipe={recipe} updateRecipes={updateRecipes} />
                </div>
              )}
              <div style={{ fontSize: '20px', padding: '20px' }}>
                <Review recipeID={recipe._id} authToken={authToken} userID={userID} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
