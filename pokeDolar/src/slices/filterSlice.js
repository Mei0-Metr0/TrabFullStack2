// Arquivo para gerenciar a funcionalidade de filtragem de Pokemons

// filterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    searchQuery: "",
    selectedType: 0,
    typeFilteredPokemon: [],
    customTypeFilteredPokemon: [] // Add this new state
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setPokemonTypes: (state, action) => {
      state.typeFilteredPokemon = action.payload;
    },
    // Add new reducer for custom Pokemon
    setCustomPokemonTypes: (state, action) => {
      state.customTypeFilteredPokemon = action.payload;
    }
  }
});

export const { 
  setSearchQuery, 
  setSelectedType, 
  setPokemonTypes,
  setCustomPokemonTypes 
} = filterSlice.actions;
export default filterSlice.reducer;