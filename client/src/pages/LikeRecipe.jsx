import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";

const LikeRecipe = ({ recipe, userID, authToken, updateLikes }) => {
  const [liked, setLiked] = useState(false);
  const [cookies, _] = useCookies(["access_token"]); 

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
      if (!cookies.access_token) {
        alert("You are not authorized to do this. Please login or register first.");
        return;
      }
  
  
      // Check if the recipe is already liked
      if (liked) {
        // Send the unlike request
        await axios.put(`http://localhost:3001/liked-recipes/${recipe._id}/unlike`, { userID: recipe.userOwner }, {
            headers: { authorization: authToken }
        });
      } else {
        // Send the like request
        await axios.put(`http://localhost:3001/liked-recipes/${recipe._id}/like`, { userID: recipe.userOwner }, {
            headers: { authorization: authToken }
        });
      }
  
      // Toggle the like state and trigger the updateLikes function
      setLiked(!liked);
      updateLikes();
  
      // Update liked recipes in localStorage
      let savedLikes = JSON.parse(localStorage.getItem('likedRecipes'));
      savedLikes = Array.isArray(savedLikes) ? savedLikes : []; // Ensure savedLikes is an array
      if (liked) {
        // Remove recipe ID from liked recipes if unliking
        savedLikes = savedLikes.filter(id => id !== recipe._id.toString());
      } else {
        savedLikes.push(recipe._id.toString());
      }
      localStorage.setItem('likedRecipes', JSON.stringify(savedLikes));
  
    } catch (error) {
        console.error(error);
        // Handle errors
    }
  };
  

  return (
    <div>
      <button onClick={handleLike} className={`btn ${liked ? 'btn-primary' : 'btn-outline-primary'}`} disabled={!recipe || userID === recipe.userOwner}>
        {liked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default LikeRecipe;
