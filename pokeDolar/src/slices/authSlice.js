import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Faz requisição POST para API de login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      
      // Se a resposta não for bem-sucedida, rejeita com a primeira mensagem de erro
      if (!response.ok) {
        // Retorna apenas a primeira mensagem de erro encontrada
        if (data.errors && data.errors.length > 0) {
          return rejectWithValue(data.errors[0].msg);
        }
        return rejectWithValue(data.message || 'Falha no login');
      }

      // Retorna dados do login
      return data;
    } catch (error) {
      return rejectWithValue('Erro de conexão com o servidor');
    }
  }
);

// Verifica autenticação
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      // Verifica status da autenticação na API
      const response = await fetch('/api/check-auth', {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Falha ao verificar autenticação');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erro de conexão com o servidor');
    }
  }
);

// Logout
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Faz requisição POST para API de logout
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Falha ao fazer logout');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erro de conexão com o servidor');
    }
  }
);

// Criação do slice de autenticação
const authSlice = createSlice({
  name: 'auth',

  // Estado inicial
  initialState: {
    user: null,
    isAuthenticated: false,
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },

  // Reducers síncronos
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    }
  },

  // Reducers para ações assíncronas
  extraReducers: (builder) => {
    builder
      // Casos de login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.error = action.payload || 'Falha no login';
      })
      
      // Caso de verificação de autenticação
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.status = 'succeeded';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'failed';
      })
      
      // Casos de logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.error = action.payload || 'Falha ao fazer logout';
      });
  }
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
