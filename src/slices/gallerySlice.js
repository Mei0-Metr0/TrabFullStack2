import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPokemonList } from "../services/apiService";

// Obtém todos os nomes de pokemons da API
export const fetchAllPokemonNames = createAsyncThunk(
  // Nome da ação
  "gallery/fetchAllPokemonNames",
  async (_, { rejectWithValue }) => {
    try {
      // Busca a lista de todos os Pokémon da API, limitando a 1025 entradas
      const allPokemon = await fetchPokemonList(0, 1025);

      // Retorna apenas os nomes dos Pokémon
      return allPokemon.map((pokemon) => pokemon.name);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cria a slice para gerenciar a galeria de Pokémon
const gallerySlice = createSlice({
  // Nome do slice
  name: "gallery",

  // Estado inicial
  initialState: {
    allPokemonNames: [], // Lista com os nomes de todos os Pokémon
    status: "idle", // Estado da requisição: idle (inativo), pending (carregando), fulfilled (sucesso), rejected (falha)
    error: null, // Armazena erros em caso de falha na requisição
  },

  // Reducers síncronos
  reducers: {},

  // Reducers para ações assíncronas
  extraReducers: (builder) => {
    builder
      // Quando a requisição está pendente
      .addCase(fetchAllPokemonNames.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      // Quando a requisição é concluída com sucesso
      .addCase(fetchAllPokemonNames.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.allPokemonNames = action.payload;
        state.error = null;
      })
      // Quando a requisição falha
      .addCase(fetchAllPokemonNames.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload; // Armazena a mensagem de erro
      });
  },
});

export const { addPokemon } = gallerySlice.actions;

export default gallerySlice.reducer;