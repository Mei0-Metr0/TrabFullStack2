import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCustomPokemon = createAsyncThunk(
  'customPokemon/fetchAll',
  async () => {
    const response = await fetch('/api/pokemon/custom');
    if (!response.ok) throw new Error('Failed to fetch custom Pokemon');
    return response.json();
  }
);

const customPokemonSlice = createSlice({
  name: 'customPokemon',
  initialState: {
    pokemon: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomPokemon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomPokemon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pokemon = action.payload;
      })
      .addCase(fetchCustomPokemon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default customPokemonSlice.reducer;