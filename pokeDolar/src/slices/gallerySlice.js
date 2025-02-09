import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPokemonList } from "../services/apiService";

// Obtém todos os nomes de pokemons da API
export const fetchAllPokemonNames = createAsyncThunk(
  "gallery/fetchAllPokemonNames",
  async (_, { rejectWithValue }) => {
    try {
      const allPokemon = await fetchPokemonList(0, 1025);
      return allPokemon.map((pokemon) => pokemon.name);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cria a slice de galeria
const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    allPokemonNames: [],
    //customPokemon: [], // Add this to store custom Pokemon
    status: "idle", // idle, pending, fulfilled, rejected
    error: null,
  },
  reducers: {
    // Add the addPokemon reducer
    addPokemon: (state, action) => {
      //state.customPokemon.push(action.payload);
      // Add the new Pokemon name to allPokemonNames as well
      //state.allPokemonNames.push(action.payload.name);
    }
  },
  // Gerenciamento de mudanças de estado
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPokemonNames.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchAllPokemonNames.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.allPokemonNames = action.payload;
        state.error = null;
      })
      .addCase(fetchAllPokemonNames.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

// Export the action
export const { addPokemon } = gallerySlice.actions;

export default gallerySlice.reducer;