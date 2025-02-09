import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, unique: true, required: true },
  type: { type: Number, required: true },
  picture: { type: Buffer, required: true } // Binary data for the image
});

export default mongoose.model('Pokemon', pokemonSchema);
