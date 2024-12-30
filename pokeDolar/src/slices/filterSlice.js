// Arquivo para gerenciar a funcionalidade de filtragem de Pokemons

import { createSlice } from "@reduxjs/toolkit";

// Cria a slice de filtros
const filterSlice = createSlice({
  name: "filter",
  initialState: {
    searchQuery: "",
    selectedType: 0,
    typeFilteredPokemon: []
  },
  reducers: {
    // Atualização da entrada no campo de texto
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Atualização do tipo de Pokemon selecionado na dropdown box
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    // Armazena os pokemons filtrados por tipo
    setPokemonTypes: (state, action) => {
      state.typeFilteredPokemon = action.payload;
    }
  }
});

export const { setSearchQuery, setSelectedType, setPokemonTypes } = filterSlice.actions;
export default filterSlice.reducer;