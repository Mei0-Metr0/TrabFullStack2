import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth, logoutAsync } from "./slices/authSlice";
import Login from "./components/Login";
import PokemonGallery from "./components/PokemonGallery";
import PokemonDisplay from "./components/PokemonDisplay";
import PokemonCreateForm from "./components/PokemonCreateForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
        <h1 className="m-0">Pokemon Gallery</h1>
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Pokemon
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <PokemonDisplay />
      <PokemonGallery />
      <PokemonCreateForm 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default App;