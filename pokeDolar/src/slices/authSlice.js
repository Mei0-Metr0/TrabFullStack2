import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return await response.json();
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const response = await fetch('/api/check-auth');
  return await response.json();
});

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Logout failed');
  return await response.json();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    status: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
      })
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