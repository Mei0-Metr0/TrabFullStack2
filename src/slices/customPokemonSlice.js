import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cria uma ação assíncrona (Thunk) para buscar Pokémon personalizados da API
export const fetchCustomPokemon = createAsyncThunk(
  // Nome da ação para referência no Redux.
  'customPokemon/fetchAll', 
  async () => {
    // Faz uma requisição HTTP para buscar os Pokémon personalizados
    const response = await fetch('/api/pokemon/custom');

    if (!response.ok) throw new Error('Failed to fetch custom Pokemon');

    return response.json();
  }
);

// Cria um slice para gerenciar o estado dos Pokémon personalizados
const customPokemonSlice = createSlice({
  // Nome do slice, que será usado nos reducers e actions
  name: 'customPokemon',

  // Estado inicial
  initialState: {
    pokemon: [], // Lista onde os Pokémon personalizados serão armazenados
    status: 'idle', // Status da requisição: 'idle' (inativo), 'loading', 'succeeded' ou 'failed'
    error: null // Armazena mensagens de erro, caso ocorram
  },

  // Reducers síncronos
  reducers: {},

  // Reducers para ações assíncronas
  extraReducers: (builder) => {
    builder
      // Quando a requisição é iniciada, define o status como 'loading'
      .addCase(fetchCustomPokemon.pending, (state) => {
        state.status = 'loading';
      })
      // Quando a requisição é bem-sucedida, define o status como 'succeeded' e armazena os Pokémon recebidos.
      .addCase(fetchCustomPokemon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pokemon = action.payload;
      })
      // Quando a requisição falha, define o status como 'failed' e armazena a mensagem de erro.
      .addCase(fetchCustomPokemon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default customPokemonSlice.reducer;