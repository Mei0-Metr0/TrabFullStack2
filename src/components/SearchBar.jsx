// Componente com uma barra de busca para pesquisar Pokemons

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../slices/filterSlice";

function SearchBar() {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validação do input
  const validateInput = (input) => {
    // Padrão Regex que só permite números, letras e hífen
    const validPattern = /^[a-zA-Z0-9-]*$/;
    
    if (!validPattern.test(input)) {
      // Encontra caracteres inválidos
      const invalidChars = input.match(/[^a-zA-Z0-9-]/g);
      const uniqueInvalidChars = [...new Set(invalidChars)].join(" ");
      
      setErrorMessage(`Caracteres inválidos: ${uniqueInvalidChars}`);
      return false;
    }
    
    setErrorMessage("");
    return true;
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Só atualiza listagem se o input for válido
    if (validateInput(newValue)) {
      dispatch(setSearchQuery(newValue.toLowerCase()));
    }
  };

  // Limpa campo de mensagem de erro quando a busca estiver vazia
  useEffect(() => {
    if (inputValue === "") {
      setErrorMessage("");
      dispatch(setSearchQuery(""));
    }
  }, [inputValue, dispatch]);

  return (
    <div className="mb-4 space-y-2">
      <div className="relative">
        <input
          type="text"
          className={`form-control w-full ${errorMessage ? 'border-2 border-red-500' : ''}`}
          placeholder="Buscar Pokémon por nome ou número"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
