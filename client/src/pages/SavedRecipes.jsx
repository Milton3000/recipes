import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [authToken, setAuthToken] = useState("");
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

    const fetchAuthToken = async () => {
      try {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=').map(c => c.trim());
          acc[name] = value;
          return acc;
        }, {});
        setAuthToken(cookies["access_token"]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedRecipes();
    fetchAuthToken();
  }, [userID]);

  const unsaveRecipe = async (recipeID) => {
    try {
      await axios.delete("http://localhost:3001/recipes", {
        data: { recipeID, userID },
        headers: { authorization: authToken }
      });

      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeID));
      alert("Recipe unsaved");
    } catch (error) {
      console.error(error);
      alert("Failed to unsave recipe");
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
          <h1 style={{ color: 'black' }}>Saved Recipes</h1>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-6 g-4">
        {savedRecipes.map((recipe, index) => (
          <div key={recipe._id} className="col">
            <div className="card h-80">
              <div className="card-body">
                <h5 className="card-title"># {index + 1}</h5>
                <h4 className="card-subtitle mb-2 text-muted">{recipe.name}</h4>
                <div className="card-text">
                  <strong>Ingredients: </strong>
                  {recipe.ingredients.map((ingredient, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      {ingredient}
                    </span>
                  ))}
                </div>
                <div className="instructions">
                  <span><strong>How to: </strong>{recipe.instructions}</span>
                </div>
                <img src={recipe.imageUrl} className="card-img-top" alt={recipe.name} />
                <p className="card-text">Cooking Time: {recipe.cookingTime} (minutes)</p>
                <button onClick={() => unsaveRecipe(recipe._id)} className="btn btn-secondary">Unsave Recipe</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;
