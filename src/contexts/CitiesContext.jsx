import { createContext, useCallback, useContext, useReducer } from "react";

import cities from "../data/cities";

const CitiesContext = createContext();

const initialState = {
  cities,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "city/loaded":
      return {
        ...state,
        currentCity: state.cities
          .filter((city) => city.id === action.payload)
          .at(0),
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("unkown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, currentCity }, dispatch] = useReducer(reducer, initialState);

  const getCity = useCallback(
    function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({
        type: "city/loaded",
        payload: id,
      });
    },
    [currentCity.id]
  );

  function createCity(newCity) {
    dispatch({ type: "city/created", payload: newCity });
  }

  function deleteCity(id) {
    dispatch({ type: "city/deleted", payload: id });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was use outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
