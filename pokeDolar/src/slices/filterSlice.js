
import { createSlice } from "@reduxjs/toolkit";

// Cria um slice para gerenciar filtros de busca e tipos de Pokémon
const filterSlice = createSlice({
  // Nome do slice, usado para identificar as actions no Redux
  name: "filter",

  // Estado inicial
  initialState: {
    searchQuery: "", // Armazena o texto digitado na busca
    selectedType: 0, // Tipo de Pokémon selecionado para filtragem
    typeFilteredPokemon: [], // Lista de Pokémons filtrados pelo tipo selecionado
    customTypeFilteredPokemon: [] // Lista de Pokémons filtrados, considerando customizações (novos estados adicionados)
  },

  reducers: {
    // Atualiza o texto da busca
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Atualiza o tipo de Pokémon selecionado para filtragem
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    // Atualiza a lista de Pokémons filtrados pelo tipo selecionado
    setPokemonTypes: (state, action) => {
      state.typeFilteredPokemon = action.payload;
    },
    // Atualiza a lista de Pokémons filtrados de um conjunto personalizado
    setCustomPokemonTypes: (state, action) => {
      state.customTypeFilteredPokemon = action.payload;
    }
  }
});

// Exporta as actions geradas automaticamente pelo `createSlice`
export const { 
  setSearchQuery, // Definir o texto da busca
  setSelectedType, // Definir o tipo selecionado
  setPokemonTypes, // Definir Pokémons filtrados pelo tipo
  setCustomPokemonTypes // Definir Pokémons filtrados personalizados
} = filterSlice.actions;
export default filterSlice.reducer;