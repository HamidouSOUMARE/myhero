// ========== Importation des modules nécessaires ==========

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/UserRoutes');
const { initDatabase } = require('./config/Database');
const { isLoggedIn } = require('./middlewares/auth');

// ========== Configuration et initialisation de l'application ==========

const app = express();

// Initialisation de la base de données
initDatabase();

// Configuration de la sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "localhost:3005"] // Autoriser les connexions à localhost:3005
            // Ajoutez ici d'autres directives si nécessaire
        }
    }
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
}));

// Configuration des middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configuration des messages flash
app.use((req, res, next) => {
    res.locals.flashMessages = req.session.flashMessages;
    delete req.session.flashMessages;
    next();
});

// Middleware pour vérifier si l'utilisateur est authentifié
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
            if (!err && decodedUser) {
                req.user = decodedUser;
            }
        });
    }
    next();
});

// Application routes
app.use('/', userRoutes);
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/protected', (req, res) => {
    if (req.user) {
        res.json({ message: "Vous êtes authentifié!" });
    } else {
        res.status(401).json({ message: "Non authentifié" });
    }
});

// Fallback route for React frontend
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Middleware for handling errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle 404 - always keep this as the last route
app.use((req, res, next) => {
    res.status(404).render('404');
});

app.use(cors({
    origin: 'http://localhost:3000', // Autorisez le domaine de votre frontend
    credentials: true,  // Autoriser les cookies
}));

app.listen('3005', () => {
    console.log('Serveur port : 3005');
});

module.exports = app;
