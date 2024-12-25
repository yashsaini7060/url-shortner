import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from './config/oauth.js'
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js'
import cookieParser from 'cookie-parser';
import { isAuthenticated } from './middleware/authMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import errorHandler from './middleware/errorHandler.js';
dotenv.config('../.env');
const PORT = process.env.PORT || 4000;


// Connect to MongoDB
connectDB();


const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());
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

// Add Swagger configuration before app initialization
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for URL Shortener service',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        googleAuth: {
          type: 'oauth2',
          description: 'Google OAuth2 authentication',
          flows: {
            implicit: {
              authorizationUrl: '/auth/google',
              scopes: {},
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

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
app.use("/api", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

// Add Swagger UI route before other routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/ping', (req, res) => {
  res.send("Pong");
})
// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
})