import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Cria um novo esquema (schema) para o modelo de "User" (usuário) no MongoDB.
const userSchema = new mongoose.Schema({
  // Define que o campo 'username' deve ser uma string, é obrigatório (required), e deve ser único (unique).
  username: { type: String, required: true, unique: true },
  // Define que o campo 'password' deve ser uma string e é obrigatório (required).
  password: { type: String, required: true }
});

// Define um middleware que será executado antes de um usuário ser salvo no banco de dados.
// 'this' se refere ao próprio documento de usuário.
userSchema.pre('save', async function(next) {
  // Verifica se o campo 'password' foi modificado. Se sim, ele será processado para ser armazenado de forma segura.
  if (this.isModified('password')) {
    // Se a senha foi modificada, ela é 'hashada' usando o bcrypt. O número 10 é a quantidade de saltos (complexidade) do hash.
    // O bcrypt gera um hash da senha original, o que garante que a senha nunca seja armazenada em texto simples no banco de dados.
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  // Chama o próximo middleware ou função, permitindo que o processo de salvar o usuário continue após a modificação da senha.
  next();
});

// Cria e exporta o modelo 'User' baseado no 'userSchema'.
export default mongoose.model('User', userSchema);
