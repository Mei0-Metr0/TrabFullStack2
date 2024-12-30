// Arquivo para gerenciar a paginação

import { createSlice } from "@reduxjs/toolkit";

// Cria a slice de paginação
const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    currentPage: 1,
    limit: 12,
    totalPages: 0,
  },
  reducers: {
    // Define e atualiza a página atual
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Define e atualiza o total de páginas
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
      // Reset para página 1 se a página atual for maior que o total de páginas
      if (state.currentPage > action.payload) {
        state.currentPage = 1;
      }
    },
    // Define a quantidade de itens apresentados por página
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
});

export const { setCurrentPage, setTotalPages, setLimit } = paginationSlice.actions;
export default paginationSlice.reducer;