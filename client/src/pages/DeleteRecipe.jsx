import React from 'react';
import axios from 'axios';

const DeleteRecipe = ({ recipeID, userID, authToken }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/delete-recipe/${recipeID}`, {
        data: { userID },
        headers: { authorization: authToken } // Include the authentication token in headers
      });
      alert("Recipe deleted successfully");
      // You can redirect the user to another page or update the state as needed
    } catch (error) {
      console.error(error);
      alert("Failed to delete recipe");
    }
  };

  return (
    <div>
      <button className="btn btn-danger mt-2" onClick={handleDelete}>Delete Recipe</button>
    </div>
  );
};

export default DeleteRecipe;
