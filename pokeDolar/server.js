import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import bcrypt from 'bcryptjs';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

connectDB();

const sessionStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.APPNAME}`,
  collectionName: 'sessions'
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

// Mock users database
const users = [
  { username: 'admin', password: 'admin123' }
];

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
    console.log("All users in the collection:");
    // allUsers.forEach(user => console.log(user));

    // Check if there is a match for username and password
    let authenticatedUser = null;

    console.log(username);
    let cryptUsername = await bcrypt.hash(username, 10);
    console.log(cryptUsername);

    console.log(password);
    let cryptPassword = await bcrypt.hash(password, 10);
    console.log(cryptPassword);

    for (const user of allUsers) {
      console.log(user);
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));