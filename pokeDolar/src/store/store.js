// Arquivo Store que combina os reducers em um único arquivo de gerenciamento

import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice';
import galleryReducer from "../slices/gallerySlice";
import paginationReducer from "../slices/paginationSlice";
import dollarPokemonReducer from "../slices/dollarPokemonSlice";
import filterReducer from "../slices/filterSlice";
import customPokemonReducer from '../slices/customPokemonSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
    pagination: paginationReducer,
    dollarPokemon: dollarPokemonReducer,
    filter: filterReducer,
    customPokemon: customPokemonReducer,
  },
});