import Pokemon from '../models/Pokemon.js';

export const dbFetchPokemonList = async () => {
  const pokemon = await Pokemon.find()
  return pokemon;
};

export const dbFetchPokemonByNumber = async (number) => {
  const pokemon = await Pokemon.findOne({ number })
    .select('-picture');
  return pokemon;
};

export const dbFetchPokemonByType = async (typeId) => {
  const pokemon = await Pokemon.find({ type: typeId })
    .select('-picture');
  return pokemon;
};

export const dbFetchPokemonPicture = async (id) => {
  const pokemon = await Pokemon.findById(id)
    .select('picture');
  return pokemon?.picture;
};

export const dbCreatePokemon = async (pokemonData, picture) => {
  const count = await Pokemon.countDocuments();
  const pokemon = new Pokemon({
    ...pokemonData,
    number: 1026 + count,
    picture
  });
  await pokemon.save();
  return pokemon;
};