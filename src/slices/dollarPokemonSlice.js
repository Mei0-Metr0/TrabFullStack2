// Arquivo para gerenciar a obtenção do valor de cotação de USD, e sua conversão para BRL

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDollarRate, fetchPokemonByNumber } from "../services/apiService";

// Obtém a cotação atual do dólar e o Pokémon correspondente ao valor da cotação
export const fetchDollarPokemon = createAsyncThunk(
  // Nome da action para referência no Redux
  "pokemon/fetchDollarPokemon",

  async () => {
    // Obtém a taxa de câmbio e o número do Pokémon associado
    const { exchangeRate, pokemonNumber } = await fetchDollarRate();

    // Busca os dados do Pokémon com base no número retornado
    const pokemonData = await fetchPokemonByNumber(pokemonNumber);

    // Retorna os dados do Pokémon e a taxa de câmbio
    return { pokemonData, exchangeRate };
  }
);

// Cria um slice para gerenciar o estado do Pokémon relacionado ao dólar
const dollarPokemonSlice = createSlice({
  // Nome do slice, que será usado nos reducers e actions
  name: "pokemon",

  // Estado inicial
  initialState: {
    dollarPokemon: null, // Armazena dados do Pokémon correspondente à cotação
    exchangeRate: null, // Armazena o valor da cotação do dólar
    status: "idle", // Indica o status da requisição: 'idle', 'pending', 'fulfilled' ou 'rejected'
  },

  // Reducers síncronos
  reducers: {},

  // Reducers para ações assíncronas
  extraReducers: (builder) => {
    builder
      // Caso a requisição esteja em andamento, define o status como 'pending'
      .addCase(fetchDollarPokemon.pending, (state) => {
        state.status = "pending";
      })
      // Quando a requisição for bem-sucedida, armazena os dados do Pokémon e a taxa de câmbio
      .addCase(fetchDollarPokemon.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.dollarPokemon = action.payload.pokemonData;
        state.exchangeRate = action.payload.exchangeRate;
      })
      // Se a requisição falhar, define o status como 'rejected'
      .addCase(fetchDollarPokemon.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default dollarPokemonSlice.reducer;