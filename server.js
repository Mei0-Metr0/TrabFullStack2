import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Pokemon from './src/models/Pokemon.js';
import cacheService from './src/config/cache.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Conecta ao banco de dados
connectDB();

// Configura armazenamento de sessões no MongoDB
const sessionStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.APPNAME}`,
  collectionName: 'sessions'
});

// Configura multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 // 1MB limit
  }
});

// Middlewares
app.use(express.json());
// Configuração de sessões
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.EXPIRE) * 1000
  }
}));

// Configuração CORS
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true // Importante para sessões
}));

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Rota de login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca todos os usuários
    const allUsers = await User.find();
    let authenticatedUser = null;

    // Verifica credenciais
    for (const user of allUsers) {
      const usernameMatch = await bcrypt.compare(username, user.username);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (usernameMatch && passwordMatch) {
        authenticatedUser = user;
        break; 
      }
    }

    if (!authenticatedUser) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Cria sessão
    req.session.user = { username: authenticatedUser.username };
    console.log(`User authenticated: ${authenticatedUser.username}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rota de logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Rota para verificar autenticação
app.get('/api/check-auth', (req, res) => {
  res.json({ isAuthenticated: !!req.session.user });
});

// Protege rotas da API
app.use('/api/pokemon', authMiddleware);

// Rota para criar Pokemon
app.post('/api/pokemon/create', upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Picture is required' });
    }

    // Gera número sequencial para novo Pokemon
    const count = await Pokemon.countDocuments();
    const nextNumber = 1026 + count;

    // Cria novo Pokemon
    const pokemon = new Pokemon({
      name: req.body.name,
      number: nextNumber,
      type: parseInt(req.body.type),
      picture: req.file.buffer
    });

    await pokemon.save();
    
    // Invalida cache
    cacheService.del('custom_pokemon_list');
    
     // Prepara resposta
    const response = {
      _id: pokemon._id,
      name: pokemon.name,
      number: pokemon.number,
      type: pokemon.type
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating Pokemon:', error);
    res.status(500).json({ message: 'Error creating Pokemon' });
  }
});

// Rota para listar Pokemon personalizados
app.get('/api/pokemon/custom', authMiddleware, async (req, res) => {
  try {
    const customPokemon = await cacheService.getOrSet(
      'custom_pokemon_list',
      async () => {
        const pokemon = await Pokemon.find({}, {
          name: 1,
          number: 1,
          type: 1
        });
        return pokemon;
      },
      1800 // Cache por 30 minutos
    );
    res.json(customPokemon);
  } catch (error) {
    console.error('Error fetching custom Pokemon:', error);
    res.status(500).json({ message: 'Error fetching custom Pokemon' });
  }
});

// Rota para buscar imagem do Pokemon
app.get('/api/pokemon/:id/picture', authMiddleware, async (req, res) => {
  try {
    const cacheKey = `pokemon_picture_${req.params.id}`;
    const pokemonPicture = await cacheService.getOrSet(
      cacheKey,
      async () => {
        const pokemon = await Pokemon.findById(req.params.id);
        if (!pokemon || !pokemon.picture) {
          throw new Error('Pokemon picture not found');
        }
        return pokemon.picture;
      },
      3600 // Cache por 1 hora
    );
    
    res.set('Content-Type', 'image/jpeg');
    res.send(pokemonPicture);
  } catch (error) {
    console.error('Error fetching Pokemon picture:', error);
    if (error.message === 'Pokemon picture not found') {
      return res.status(404).json({ message: 'Pokemon picture not found' });
    }
    res.status(500).json({ message: 'Error fetching Pokemon picture' });
  }
});

// Configuração para produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));