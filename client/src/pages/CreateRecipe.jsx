import React, { useState } from 'react'
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';

const CreateRecipe = () => {
  const userID = useGetUserID();

  // An object containing all of the inputs
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });



  //Quite a big form and all of the functions are the same so we create a handleChange that will do all of the logic.
  // Function below is just changing one specific part of the object.

  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients; // Just making a copy of it.
    ingredients[index] = value; // Change the element in the index equal to index.
    setRecipe({ ...recipe, ingredients });
  };


  // Put a name property on each input (down below) so it serves as the key equal to the object information, so whenever we want to handle the change we can modify by accessing the name. Each of them refering to each specific object info.

  // Setting the recipe to whatever it was before (...recipe). Called the Spread operator. 
  // Whatever we put after the comma, is what's gonna change in the object. In this case we're changing the ingredients field. Initially it's an empty array, but now we're changing it to whatever the ingredients list was before (...spread operator again). So now it just adds an empty string to the end of the array. 
  // We can generate the ingredients input based on the {recipe.ingredients list.} So we will .map the item. 
  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/recipes", recipe);
      alert("Recipe Created");
    } catch (error) {
      console.error(error);
    }
  };
  console.log(recipe.ingredients);
  return (
    <div className='create-recipe'>

      <h2> Create Recipe </h2>
      <form onSubmit={onSubmit}>
        <label htmlFor='name'> Name </label>
        <input type='text' id='name' name='name' onChange={handleChange} />

        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, index)}
          />
        ))}

        <button onClick={addIngredient} type='button'> Add Ingredient </button>

        <label htmlFor='instructions'> Inscructions </label>
        <textarea id='instructions' name='instructions' onChange={handleChange}></textarea>

        <label htmlFor='imageUrl'> Image URL </label>
        <input type='text' id='imageUrl' name='imageUrl' onChange={handleChange} />

        <label htmlFor='cookingTime'> Cooking Time (minutes) </label>
        <input type='number' id='cookingTime' name='cookingTime' onChange={handleChange} />

        <button type='submit'> Create Recipe </button>
      </form>
    </div>
  )
}

export default CreateRecipe