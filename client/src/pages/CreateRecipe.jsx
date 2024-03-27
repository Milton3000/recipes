import React, { useState } from 'react'

const CreateRecipe = () => {

  // An object containing all of the inputs
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: 0,
  });

  // Function below is just changing one specific part of the object.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  }

  //Quite a big form and all of the functions are the same so we create a handleChange that will do all of the logic.

  // Put a name property on each input (down below) so it serves as the key equal to the object information, so whenever we want to handle the change we can modify by accessing the name. Each of them refering to each specific object info.

  return (
    <div className='create-recipe'>

      <h2> Create Recipe </h2>
      <form>
        <label htmlFor='name'> Name </label>
        <input type='text' id='name' name='name' onChange={handleChange} />

        <label htmlFor='description'> Description </label>
        <textarea id='description' name='description'></textarea>

        <label htmlFor='ingredients'> Ingredients </label>

        <label htmlFor='instructions'> Inscructions </label>
        <textarea id='instructions' name='instructions'></textarea>

        <label htmlFor='imageUrl'> Image URL </label>
        <input type='text' id='imageUrl' name='imageUrl' />

        <label htmlFor='cookingTime'> Cooking Time (minutes) </label>
        <input type='number' id='cookingTime' name='cookingTime' />
      </form>
    </div>
  )
}

export default CreateRecipe