
import React, { useState } from 'react';
import UpdateRecipeModal from './UpdateRecipeModal';

const UpdateRecipe = ({ recipeID, userID, authToken, updateRecipes, recipe }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-info ml-2">Update</button>
      {showModal && (
        <UpdateRecipeModal
          isOpen={showModal}
          onRequestClose={closeModal}
          recipeID={recipeID}
          userID={userID}
          authToken={authToken}
          updateRecipes={updateRecipes}
          recipe={recipe}
        />
      )}
    </>
  );
};

export default UpdateRecipe;
