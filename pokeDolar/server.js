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
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { logger, requestLogger, errorLogger, logAuthEvent } from './src/config/logger.js';

import { body, validationResult } from 'express-validator'; // Validação de entradas
import xss from 'xss-clean'; // Proteção contra XSS
import mongoSanitize from 'express-mongo-sanitize'; // Proteção contra NoSQL Injection

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para proteção contra NoSQL Injection
app.use(mongoSanitize());

// Middleware para proteção contra XSS
app.use(xss());

// Aplica RateLimiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  standardHeaders: true, // Retorna info de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
  // Quando limite é excedido
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json({
      message: 'Too many requests, please try again later.'
    });
  }
});

// Aplica o limiter globalmente para todas as rotas
app.use(limiter);

// Adiciona middleware de logging para todas as requisições
app.use(requestLogger);

// Determinar quais requisições devem ser comprimidas
const shouldCompress = (req, res) => {
  // Não comprimir se o cliente especificar que não quer compressão
  if (req.headers['x-no-compression']) {
    return false;
  }
  // Usar a função padrão de compressão do middleware
  return compression.filter(req, res);
};

// Aplica compressão com configurações personalizadas
app.use(compression({
  filter: shouldCompress,
  level: 9, // Nível de compressão (0-9, sendo 9 o máximo)
  threshold: 100 * 1024, // Comprimir apenas respostas maiores que 100kb
}));

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

// Rota de login com logging
app.post('/api/login', [
  // Validações para o campo username
  body('username')
    .trim()
    .notEmpty().withMessage('O nome de usuário é obrigatório')
    .isLength({ min: 3, max: 30 }).withMessage('O usuário deve ter entre 3 e 30 caracteres')
    .escape(),
  
  // Validações para o campo password
  body('password')
    .trim()
    .notEmpty().withMessage('A senha é obrigatória')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
    .escape()
], async (req, res) => {
  
  // Verifica se há erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

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

    // Se não encontrou usuário válido
    if (!authenticatedUser) {
      logAuthEvent(username, false, 'Credenciais inválidas');
      return res.status(401).json({ 
        success: false,
        message: 'Nome de usuário ou senha incorretos' 
      });
    }

    // Cria sessão
    req.session.user = { 
      username: authenticatedUser.username,
      id: authenticatedUser._id
    };
    
    // Registra evento de login bem-sucedido
    logAuthEvent(authenticatedUser.username, true);
    
    // Retorna sucesso
    res.json({ 
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        username: authenticatedUser.username
      }
    });

  } catch (error) {
    // Registra erro no servidor
    logger.error('Erro durante o login', { 
      error: error.message,
      stack: error.stack
    });
    
    // Retorna erro para o cliente
    res.status(500).json({ 
      success: false,
      message: 'Erro ao processar o login. Tente novamente mais tarde.'
    });
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
// O middleware de upload de imagens deve vim antes da de validação
app.post('/api/pokemon/create', upload.single('picture'), [
  // Validações
  body('name')
    .trim()
    .notEmpty().withMessage('O nome do Pokémon é obrigatório')
    .isLength({ min: 3, max: 30 }).withMessage('O nome deve ter entre 3 e 30 caracteres')
    .escape(),
  body('type')
    .isInt({ min: 0, max: 18 }).withMessage('Tipo do Pokémon inválido')
], async (req, res) => {
  try {

    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'A imagem do Pokémon é obrigatória' 
      });
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
    logger.error('Error creating Pokemon:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao criar Pokémon, tente novamente'
    });
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
    logger.error('Error fetching custom Pokemon:', error);
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
    logger.error('Error fetching Pokemon picture:', error);
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

// Middleware de logging de erros
app.use(errorLogger);

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));