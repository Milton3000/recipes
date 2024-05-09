import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";

const LikeRecipe = ({ recipe, userID, authToken, updateLikes }) => {
  const [liked, setLiked] = useState(false);
  const [cookies, _] = useCookies(["access_token"]);

  useEffect(() => {
    // Laddar liked recipe IDs från localStorage på mounten
    let savedLikes = JSON.parse(localStorage.getItem('likedRecipes'));
    savedLikes = Array.isArray(savedLikes) ? savedLikes : [];
    setLiked(savedLikes.includes(recipe._id.toString()));
  }, [recipe._id]);

  const handleLike = async () => {
    try {
      console.log("Liking recipe...");
      if (!recipe || userID === recipe.userOwner) {
        alert("You can't like your own recipe.");
        return;
      }
      if (!cookies.access_token) {
        alert("You are not authorized to do this. Please login or register first.");
        return;
      }


      // Kollar om det redan är likeat
      if (liked) {
        // Skickar unlike request
        await axios.put(`http://localhost:3001/liked-recipes/${recipe._id}/unlike`, { userID: recipe.userOwner }, {
          headers: { authorization: authToken }
        });
      } else {
        // Skickar like request
        await axios.put(`http://localhost:3001/liked-recipes/${recipe._id}/like`, { userID: recipe.userOwner }, {
          headers: { authorization: authToken }
        });
      }

      // Togglar like state och triggar updateLikes function
      setLiked(!liked);
      updateLikes();

      // Uppdatera liked recipes i localStorage
      let savedLikes = JSON.parse(localStorage.getItem('likedRecipes'));
      savedLikes = Array.isArray(savedLikes) ? savedLikes : [];
      if (liked) {
        savedLikes = savedLikes.filter(id => id !== recipe._id.toString());
      } else {
        savedLikes.push(recipe._id.toString());
      }
      localStorage.setItem('likedRecipes', JSON.stringify(savedLikes));

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <button onClick={handleLike} className={`btn ${liked ? 'btn-secondary' : 'btn-primary'}`} disabled={!recipe || userID === recipe.userOwner}>
        {liked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default LikeRecipe;
