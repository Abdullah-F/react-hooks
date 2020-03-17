import React, { useReducer, useState, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
function Ingredients() {
  const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
      case "SET":
        return action.ingredients;
      case "ADD":
        return [...currentIngredients, action.ingredient];
      case "DELETE":
        return currentIngredients.filter(cing => cing.id !== action.id);
      default:
        throw new Error(" you must handle something");
    }
  };
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  //const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch("https://react-hooks-f8a9d.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(resposnse => {
        setIsLoading(false);
        return resposnse.json();
      })
      .then(responseData => {
        //        setIngredients(prevIngredients => [
        //          ...prevIngredients,
        //          { id: responseData.name, ...ingredient }
        //        ]);
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient }
        });
      });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://react-hooks-f8a9d.firebaseio.com/ingredients/${id}.json`, {
      method: "DELETE"
    })
      .then(response => {
        setIsLoading(false);
        //        setIngredients(prevIngredients => [
        //          ...prevIngredients.filter(ingredient => ingredient.id !== id)
        //        ]);
        dispatch({ type: "DELETE", id: id });
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}> {error} </ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
