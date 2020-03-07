import React, { useState } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    fetch("https://react-hooks-f8a9d.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify({ ingredients }),
      headers: { "Content-Type": "application/json" }
    })
      .then(resposnse => {
        return resposnse.json();
      })
      .then(responseDate => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseDate.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = id => {
    setIngredients(prevIngredients => [
      ...prevIngredients.filter(ingredient => ingredient.id !== id)
    ]);
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
