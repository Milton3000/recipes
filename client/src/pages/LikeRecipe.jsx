import React, { useState } from 'react';
import axios from 'axios';

const LikeRecipe = ({ recipeID, userID, authToken, updateLikes }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      // Check if the user is the creator of the recipe
      if (userID === recipe.userOwner) {
        alert("You can't like your own recipe.");
        return;
      }

      // Check if the recipe is already liked by the user
      if (liked) {
        // If already liked, remove the like
        await axios.delete(`http://localhost:3001/recipes/like/${recipeID}`, {
          data: { userID },
          headers: { authorization: authToken }
        });
      } else {
        // If not liked, add the like
        await axios.put(`http://localhost:3001/recipes/like/${recipeID}`, {
          userID
        }, {
          headers: { authorization: authToken }
        });
      }

      // Update the liked state and trigger the updateLikes function
      setLiked(!liked);
      updateLikes();
    } catch (error) {
      console.error(error);
      alert("Failed to like recipe");
    }
  };

  return (
    <div>
      <button onClick={handleLike} className={`btn ${liked ? 'btn-primary' : 'btn-outline-primary'}`} disabled={userID === recipe.userOwner}>
        {liked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default LikeRecipe;
