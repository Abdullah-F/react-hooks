import React, { useReducer, useCallback, useMemo, useEffect } from "react";
import useHttp from "../../hooks/http";
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

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    extra,
    identifier,
    clear
  } = useHttp();
  //const [ingredients, setIngredients] = useState([]);
  //  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (identifier === "REMOVE_INGREDIENT") {
        console.log("[ddddddsaaaaaaaaaaaaa]", extra);
        dispatch({ type: "DELETE", id: extra });
      } else if (error != null && identifier === "ADD_INGREDIENT") {
        dispatch({
          type: "ADD",
          ingredient: { id: data.name, ...extra }
        });
      }
    }
  }, [data, extra, identifier, isLoading, error]);

  const addIngredientHandler = useCallback(
    ingredient => {
      sendRequest(
        "https://react-hooks-f8a9d.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    id => {
      console.log("[this is the id]", id);
      sendRequest(
        `https://react-hooks-f8a9d.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
