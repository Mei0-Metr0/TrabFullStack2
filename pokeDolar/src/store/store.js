import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice';
import galleryReducer from "../slices/gallerySlice";
import paginationReducer from "../slices/paginationSlice";
import dollarPokemonReducer from "../slices/dollarPokemonSlice";
import filterReducer from "../slices/filterSlice";
import customPokemonReducer from '../slices/customPokemonSlice';

export const store = configureStore({
  // Cria a store do Redux e configura todos os reducers combinados.
  reducer: {
    auth: authReducer, // Mapeia o reducer de autenticação para o estado 'auth'.
    gallery: galleryReducer, // Mapeia o reducer da galeria de Pokémons para o estado 'gallery'.
    pagination: paginationReducer, // Mapeia o reducer da paginação para o estado 'pagination'.
    dollarPokemon: dollarPokemonReducer, // Mapeia o reducer do Pokémon da cotação do dólar para o estado 'dollarPokemon'.
    filter: filterReducer, // Mapeia o reducer de filtros para o estado 'filter'.
    customPokemon: customPokemonReducer, // Mapeia o reducer de Pokémons personalizados para o estado 'customPokemon'.
  },
});