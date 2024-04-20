// LikeRecipe.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LikeRecipe = ({ recipe, userID, authToken, updateLikes }) => {
  const [liked, setLiked] = useState(false);

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
    } catch (error) {
      console.error(error);
      // Provide more specific error messages based on different error scenarios
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error || "Recipe is not liked by the user");
      } else {
        alert("Failed to like recipe");
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
