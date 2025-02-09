import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Pokemon from './src/models/Pokemon.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

connectDB();

const sessionStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.APPNAME}`,
  collectionName: 'sessions'
});

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 // 1MB limit
  }
});

app.use(express.json());
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

// Add this after your app declaration but before your routes
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true // This is important for sessions to work
}));

// Auth middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Auth routes
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve all users in the User collection
    const allUsers = await User.find();
    //console.log("All users in the collection:");
    // allUsers.forEach(user => console.log(user));

    // Check if there is a match for username and password
    let authenticatedUser = null;

    //console.log(username);
    //let cryptUsername = await bcrypt.hash(username, 10);
    //console.log(cryptUsername);

    //console.log(password);
    //let cryptPassword = await bcrypt.hash(password, 10);
    //console.log(cryptPassword);

    for (const user of allUsers) {
      //console.log(user);
      const usernameMatch = await bcrypt.compare(username, user.username);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (usernameMatch && passwordMatch) {
        authenticatedUser = user;
        break; // Exit the loop if a match is found
      }
    }

    if (!authenticatedUser) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Authentication successful
    req.session.user = { username: authenticatedUser.username };
    console.log(`User authenticated: ${authenticatedUser.username}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
  res.json({ isAuthenticated: !!req.session.user });
});

// Protect API routes
app.use('/api/pokemon', authMiddleware);

// Pokemon routes
app.post('/api/pokemon/create', upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Picture is required' });
    }

    // Get the current count of Pokemon to determine the next number
    const count = await Pokemon.countDocuments();
    const nextNumber = 1026 + count;

    const pokemon = new Pokemon({
      name: req.body.name,
      number: nextNumber,
      type: parseInt(req.body.type),
      picture: req.file.buffer
    });

    await pokemon.save();
    
    // Return the created Pokemon without the binary picture data
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

// Add this with your other Pokemon routes
app.get('/api/pokemon/custom', authMiddleware, async (req, res) => {
  try {
    const customPokemon = await Pokemon.find({}, {
      name: 1,
      number: 1,
      type: 1
    });
    res.json(customPokemon);
  } catch (error) {
    console.error('Error fetching custom Pokemon:', error);
    res.status(500).json({ message: 'Error fetching custom Pokemon' });
  }
});

// Add this route to get a specific Pokemon's picture
app.get('/api/pokemon/:id/picture', authMiddleware, async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon || !pokemon.picture) {
      return res.status(404).json({ message: 'Pokemon picture not found' });
    }
    res.set('Content-Type', 'image/jpeg');
    res.send(pokemon.picture);
  } catch (error) {
    console.error('Error fetching Pokemon picture:', error);
    res.status(500).json({ message: 'Error fetching Pokemon picture' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));