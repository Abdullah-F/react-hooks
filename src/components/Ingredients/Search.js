import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFiler] = useState("");
  useEffect(() => {
    const query =
      enteredFilter.lengh === 0
        ? ""
        : `?orderBy="title"&equalTo="${enteredFilter}"`;

    fetch(`https://react-hooks-f8a9d.firebaseio.com/ingredients.json${query}`)
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
        onLoadIngredients(loadedIngredients);
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFiler(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
