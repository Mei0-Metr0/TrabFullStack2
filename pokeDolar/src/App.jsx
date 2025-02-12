import React, { useEffect, useState } from "react";

// Hooks do Redux para acessar e manipular o estado global
import { useSelector, useDispatch } from "react-redux";

// Ações relacionadas à autenticação
import { checkAuth, logoutAsync } from "./slices/authSlice";

// Componentes da aplicação
import Login from "./components/Login";
import PokemonGallery from "./components/PokemonGallery";
import PokemonDisplay from "./components/PokemonDisplay";
import PokemonCreateForm from "./components/PokemonCreateForm";

// Estilos do Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Componente principal da aplicação
function App() {

  // Inicializa o dispatch do Redux
  const dispatch = useDispatch();

  // Extrai estado de autenticação do Redux store
  const { isAuthenticated, error } = useSelector((state) => state.auth);
   // Estado para controlar modal de para adicionar novo Pokémon
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Efeito para verificar autenticação ao carregar
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Se não estiver autenticado, mostra tela de login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Renderiza a aplicação principal
  return (
    <div className="container">
      {/* Cabeçalho com título e botões */}
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <h1 className="m-0">Pokemon Gallery</h1>
        <div>
          {/* Botão para abrir modal para adicionar novo Pokémon */}
          <button 
            className="btn btn-primary me-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Pokemon
          </button>
          {/* Botão de logout */}
          <button 
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Exibe mensagens de erro se houver */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Componentes principais da aplicação */}
      <PokemonDisplay />
      <PokemonGallery />
      {/* Modal de criação de Pokemon */}
      <PokemonCreateForm 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default App;