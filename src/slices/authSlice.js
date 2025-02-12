import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Login
export const login = createAsyncThunk('auth/login', async (credentials) => {
  // Faz requisição POST para API de login
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error('Login failed');

  // Retorna dados do login
  return await response.json();
});

// Verifica autenticação
export const checkAuth = createAsyncThunk('auth/check', async () => {
  // Verifica status da autenticação na API
  const response = await fetch('/api/check-auth');

  return await response.json();
});

// Logout
export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  // Faz requisição POST para API de logout
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) throw new Error('Logout failed');

  return await response.json();
});

// Criação do slice de autenticação
const authSlice = createSlice({

  name: 'auth',

  // Estado inicial
  initialState: {
    isAuthenticated: false,
    status: 'idle',
    error: null
  },

  // Reducers síncronos
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
    }
  },

  // Reducers para ações assíncronas
  extraReducers: (builder) => {
    builder
      // Casos de login
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Caso de verificação de autenticação
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      // Casos de logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;