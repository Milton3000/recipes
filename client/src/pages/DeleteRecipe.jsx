import React from 'react';
import axios from 'axios';

const DeleteRecipe = ({ recipeID, userID, authToken, updateRecipes }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`http://localhost:3001/delete-recipe/${recipeID}`, {
          data: { userID },
          headers: { authorization: authToken }
        });
        alert("Recipe deleted successfully");
        updateRecipes(); // Refresh recipes after deletion
      } catch (error) {
        console.error(error);
        alert("Failed to delete recipe");
      }
    }
  };

  return (
    <div>
      <button className="btn btn-danger mt-2" onClick={handleDelete}>Delete Recipe</button>
    </div>
  );
};

export default DeleteRecipe;
