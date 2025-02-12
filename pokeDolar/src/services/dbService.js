import Pokemon from '../models/Pokemon.js';

// Busca todos os Pokémon no banco de dados.
export const dbFetchPokemonList = async () => {
  // Busca todos os documentos na coleção Pokemon
  const pokemon = await Pokemon.find()
  return pokemon;
};

// Busca um Pokémon pelo seu número na Pokédex.
export const dbFetchPokemonByNumber = async (number) => {
  // Busca um Pokémon cujo campo `number` corresponda ao valor fornecido.
  // `.select('-picture')` exclui o campo `picture` do resultado.
  const pokemon = await Pokemon.findOne({ number }).select('-picture');
  return pokemon;
};

// Busca todos os Pokémon de um determinado tipo.
export const dbFetchPokemonByType = async (typeId) => {
  // Busca todos os Pokémon cujo campo `type` corresponda ao `typeId` fornecido.
  // `.select('-picture')` exclui o campo `picture` do resultado.
  const pokemon = await Pokemon.find({ type: typeId }).select('-picture');
  return pokemon;
};

// Busca a imagem (`picture`) de um Pokémon pelo seu ID.
export const dbFetchPokemonPicture = async (id) => {
  // Busca um Pokémon pelo seu ID e seleciona apenas o campo `picture`.
  const pokemon = await Pokemon.findById(id).select('picture');
  // Retorna apenas a imagem do Pokémon, ou `undefined` caso não exista.
  return pokemon?.picture;
};

// Cria um novo Pokémon no banco de dados.
export const dbCreatePokemon = async (pokemonData, picture) => {
  // Conta quantos documentos existem na coleção Pokemon
  const count = await Pokemon.countDocuments();

  // Cria um novo Pokémon
  const pokemon = new Pokemon({
    ...pokemonData, // Copia todos os dados fornecidos
    number: 1026 + count, // Define um número único baseado no total de Pokémon já cadastrados
    picture // Adiciona a imagem ao Pokémon
  });

  // Salva o novo Pokémon no BD
  await pokemon.save();

  return pokemon;
};