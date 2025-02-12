// Arquivo que fornece funcionaldiades para interação com a API

import axios from "axios";

// Obtém a lista de Pokemons
export const fetchPokemonList = async (offset = 0, limit = 20) => {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  return response.data.results;
};

// Obtém a cotação de USD
export const fetchDollarRate = async () => {
  const response = await axios.get("https://economia.awesomeapi.com.br/last/USD-BRL");
  const exchangeRate = parseFloat(response.data.USDBRL.bid);
  const pokemonNumber = Math.round(exchangeRate * 100);
  return { exchangeRate, pokemonNumber };
};

// Obtém Pokemons pelo número
export const fetchPokemonByNumber = async (number) => {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}/`);
  return response.data;
};

// Obtém Pokemons por tipo
export const fetchPokemonByType = async (typeId) => {
  const response = await axios.get(`https://pokeapi.co/api/v2/type/${typeId}`);
  return response.data.pokemon;
};