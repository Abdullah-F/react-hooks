import { useReducer, useCallback } from "react";
const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.data,
        extra: action.extra
      };
    case "ERROR":
      return {
        loading: false,
        error: action.errorMessage,
        extra: null
      };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      throw new Error(" you must handle something");
  }
};
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
  });
  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: "SEND", identifier: identifier });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        console.log("[this is the id from the useHTTP]", extra);
        dispatchHttp({ type: "RESPONSE", data: responseData, extra: extra });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", errorMessage: "something went wrong" });
        //setError(error.message);
      });
  }, []);

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    extra: httpState.extra,
    identifier: httpState.identifier
  };
};

export default useHttp;
