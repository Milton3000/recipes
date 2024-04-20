// LikeRecipe.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LikeRecipe = ({ recipe, userID, authToken, updateLikes }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Load liked recipe IDs from localStorage on component mount
    let savedLikes = JSON.parse(localStorage.getItem('likedRecipes'));
    savedLikes = Array.isArray(savedLikes) ? savedLikes : []; // Ensure savedLikes is an array
    setLiked(savedLikes.includes(recipe._id.toString())); // Convert recipe ID to string
  }, [recipe._id]);

  const handleLike = async () => {
    try {
      console.log("Liking recipe...");
      // Check if the user is the creator of the recipe or recipe is undefined
      if (!recipe || userID === recipe.userOwner) {
        alert("You can't like your own recipe.");
        return;
      }

      // Send the like request
      await axios.put(`http://localhost:3001/recipes/like/${recipe._id}`, { userID }, {
        headers: { authorization: authToken }
      });

      // Update the like state and trigger the updateLikes function
      setLiked(true);
      updateLikes();

      // Update liked recipes in localStorage
      let savedLikes = JSON.parse(localStorage.getItem('likedRecipes'));
      savedLikes = Array.isArray(savedLikes) ? savedLikes : []; // Ensure savedLikes is an array
      savedLikes.push(recipe._id.toString());
      localStorage.setItem('likedRecipes', JSON.stringify(savedLikes));

    } catch (error) {
      console.error(error);
      // Provide more specific error messages based on different error scenarios
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error || "Recipe is not liked by the user");
      } else {
        alert("You are unauthorized to do this. Please login or register first");
      }
    }
  };

  const handleUnlike = async () => {
    try {
      console.log("Unliking recipe...");
      // Check if the user is the creator of the recipe or recipe is undefined
      if (!recipe || userID === recipe.userOwner) {
        alert("You can't like your own recipe.");
        return;
      }

      // Send the like request
      await axios.put(`http://localhost:3001/recipes/like/${recipe._id}`, { userID }, {
        headers: { authorization: authToken }
      });
      // Update the like state and trigger the updateLikes function
      setLiked(false);
      updateLikes();

      // Update liked recipes in localStorage
      let savedLikes = JSON.parse(localStorage.getItem('likedRecipes'));
      savedLikes = Array.isArray(savedLikes) ? savedLikes : []; // Ensure savedLikes is an array
      const index = savedLikes.indexOf(recipe._id.toString());
      if (index !== -1) {
        savedLikes.splice(index, 1);
      }
      localStorage.setItem('likedRecipes', JSON.stringify(savedLikes));
    } catch (error) {
      console.error(error);
      alert("Failed to unlike recipe");
    }
  };

  return (
    <div>
      <button onClick={liked ? handleUnlike : handleLike} className={`btn ${liked ? 'btn-primary' : 'btn-outline-primary'}`} disabled={!recipe || userID === recipe.userOwner}>
        {liked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default LikeRecipe;
