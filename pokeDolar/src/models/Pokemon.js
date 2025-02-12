import mongoose from 'mongoose';

// Define o esquema do Pokemon, que especifica como os dados de um Pokémon devem ser armazenados no MongoDB.
const pokemonSchema = new mongoose.Schema({
  // O nome do Pokémon deve ser uma string e é obrigatório.
  name: { type: String, required: true },
  // O número do Pokémon deve ser um número, é único (não pode repetir) e é obrigatório.
  number: { type: Number, unique: true, required: true },
  // O tipo do Pokémon deve ser um número e é obrigatório (presumivelmente, um identificador de tipo, como 1 para "fogo", 2 para "água", etc.).
  type: { type: Number, required: true },
  // A imagem do Pokémon será armazenada como dados binários (Buffer), e é obrigatória. O Buffer é adequado para armazenar arquivos binários como imagens.
  picture: { type: Buffer, required: true } 
});

// Cria um modelo mongoose baseado no esquema pokemonSchema.
export default mongoose.model('Pokemon', pokemonSchema);