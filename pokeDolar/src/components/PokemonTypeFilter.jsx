// Componente para dropdown box para filtragem de Pokemons por tipo

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedType } from '../slices/filterSlice';

const PokemonTypeFilter = () => {
  const dispatch = useDispatch();
  const selectedTypeIndex = useSelector((state) => state.filter.selectedType);

  // Lista de tipos de Pokemons
  const pokemonTypes = [
    "none",
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy"
  ];

  const handleTypeChange = (event) => {
    // Parse do valor para um inteiro
    const index = parseInt(event.target.value, 10);
    // Dispatch com base no índice da lista
    dispatch(setSelectedType(index));
  };

  return (
    <div className="mb-4">
      <select 
        className="form-select"
        // Configura o valor para o índice selecionado
        value={selectedTypeIndex}
        onChange={handleTypeChange}
        aria-label="Filter Pokemon by type"
      >
        {pokemonTypes.map((type, index) => (
          <option key={type} value={index}>
            {type === "none" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PokemonTypeFilter;
