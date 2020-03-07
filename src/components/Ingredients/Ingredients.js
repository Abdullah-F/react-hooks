import React, { useState, useEffect } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch("https://react-hooks-f8a9d.firebaseio.com/ingredients.json")
      .then(resposnse => resposnse.json())
      .then(responseData => {
        console.log("[RESPONSE DATA]", responseData);
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            amount: responseData[key].amount,
            title: responseData[key].title
          });
        }
        console.log("[FROM USE EFFECT]", loadedIngredients);
        setIngredients(loadedIngredients);
      });
  }, []);

  const addIngredientHandler = ingredient => {
    fetch("https://react-hooks-f8a9d.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(resposnse => {
        return resposnse.json();
      })
      .then(responseData => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
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
