import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from './config/oauth.js'

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { isAuthenticated } from './middleware/authMiddleware.js';
dotenv.config('../.env');

const PORT = process.env.PORT || 4000;


// Connect to MongoDB
connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());



// Home route
app.get("/", (req, res) => {
  res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
});

// Dashboard route to display profile name (protected)
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`<h1>Welcome, ${req.user.name}</h1><a href="/auth/logout">Logout</a>`);
});


// Use authentication routes
app.use("/auth", authRoutes);


app.use('/ping', (req, res) => {
  res.send("Pong");
})


app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
})