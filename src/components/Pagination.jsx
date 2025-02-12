// Arquivo de Paginação, para navegação entre páginas

import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../slices/paginationSlice";

function Pagination() {
  const dispatch = useDispatch();
  const { currentPage, totalPages } = useSelector((state) => state.pagination);

  // Não renderiza a paginação se houver apenas uma página
  if (totalPages <= 1) {
    return null;
  }

  // Página anterior
  const handlePrevious = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  // Página seguinte
  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  return (
    <div className="d-flex justify-content-between mt-3 mb-4">
      <button
        className="btn btn-primary"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>Página {currentPage} de {totalPages}</span>
      <button
        className="btn btn-primary"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Próximo
      </button>
    </div>
  );
}

export default Pagination;