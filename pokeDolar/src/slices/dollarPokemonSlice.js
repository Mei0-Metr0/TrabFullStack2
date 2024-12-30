// Arquivo para gerenciar a obtenção do valor de cotação de USD, e sua conversão para BRL

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDollarRate, fetchPokemonByNumber } from "../services/apiService";

// Obtém a cotação atual e apresenta o respectivo Pokemon
export const fetchDollarPokemon = createAsyncThunk(
  "pokemon/fetchDollarPokemon",
  async () => {
    const { exchangeRate, pokemonNumber } = await fetchDollarRate();
    const pokemonData = await fetchPokemonByNumber(pokemonNumber);
    return { pokemonData, exchangeRate };
  }
);

// Cria a slice
const dollarPokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    dollarPokemon: null,
    exchangeRate: null,
    status: "idle", // idle, pending, fulfilled, rejected
  },
  reducers: {},
  // Gerencia alterações de estado
  extraReducers: (builder) => {
    builder
      .addCase(fetchDollarPokemon.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchDollarPokemon.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.dollarPokemon = action.payload.pokemonData;
        state.exchangeRate = action.payload.exchangeRate;
      })
      .addCase(fetchDollarPokemon.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default dollarPokemonSlice.reducer;