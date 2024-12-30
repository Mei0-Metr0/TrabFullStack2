// Arquivo Store que combina os reducers em um único arquivo de gerenciamento

import { configureStore } from "@reduxjs/toolkit";
import galleryReducer from "../slices/gallerySlice";
import paginationReducer from "../slices/paginationSlice";
import dollarPokemonReducer from "../slices/dollarPokemonSlice";
import filterReducer from "../slices/filterSlice";

export const store = configureStore({
  reducer: {
    gallery: galleryReducer,
    pagination: paginationReducer,
    dollarPokemon: dollarPokemonReducer,
    filter: filterReducer,
  },
});