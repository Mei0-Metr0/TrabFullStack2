import { createSlice } from "@reduxjs/toolkit";

// Cria a slice de paginação, que gerencia o estado relacionado à paginação de dados.
const paginationSlice = createSlice({
  // Nome do slice
  name: "pagination",

  initialState: {
    currentPage: 1, // Página inicial
    limit: 12, // Número de itens por página
    totalPages: 0, // Inicialmente não há total de páginas definidas
  },
  reducers: {
    // Define e atualiza a página atual
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // O valor da nova página atual é obtido a partir do payload da ação.
    },
    // Define e atualiza o total de páginas
    setTotalPages: (state, action) => {
      state.totalPages = action.payload; // Atualiza o total de páginas com o valor recebido no payload.
      // Se a página atual for maior do que o total de páginas, redefine a página atual para 1.
      if (state.currentPage > action.payload) {
        state.currentPage = 1;
      }
    },

    // Define a quantidade de itens apresentados por página
    setLimit: (state, action) => {
      state.limit = action.payload; // Atualiza o limite de itens por página com o valor recebido no payload.
    },
  },
});

export const { setCurrentPage, setTotalPages, setLimit } = paginationSlice.actions;
export default paginationSlice.reducer;