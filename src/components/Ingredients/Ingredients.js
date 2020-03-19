import React, { useReducer, useState, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...httpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      throw new Error(" you must handle something");
  }
};
function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  //const [ingredients, setIngredients] = useState([]);
  //  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: "SEND" });
    fetch("https://react-hooks-f8a9d.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(resposnse => {
        dispatchHttp({ type: "RESPONSE" });
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
    dispatchHttp({ type: "SEND" });
    fetch(`https://react-hooks-f8a9d.firebaseio.com/ingredients/${id}.json`, {
      method: "DELETE"
    })
      .then(response => {
        dispatchHttp({ type: "RESPONSE" });
        //        setIngredients(prevIngredients => [
        //          ...prevIngredients.filter(ingredient => ingredient.id !== id)
        //        ]);
        dispatch({ type: "DELETE", id: id });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", errorMessage: "something went wrong" });
        //setError(error.message);
      });
  };

  const clearError = () => {
    dispatchHttp({ type: "CLEAR" });
    //    setError(null);
    //  setIsLoading(false);
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}> {httpState.error} </ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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
