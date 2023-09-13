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


app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre application front-end (removed trailing slash)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Activez les cookies CORS
}));
// Configuration de la sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Autoriser les connexions à localhost:3005
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
    secret: process.env.SESSION_SECRET, // Utilisez la clé secrète depuis .env
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
app.use('/api', userRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue!', user: req.user });
});


app.get('/protected', (req, res) => {
    if (req.user) {
        res.json({ message: "Vous êtes authentifié!" });
    } else {
        res.status(401).json({ message: "Non authentifié" });
    }
});

// Middleware for handling errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle 404 - always keep this as the last route
app.use((req, res, next) => {
    res.status(404).json({ error: 'Page non trouvée' });
});


// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
// Configuration CORS (avant l'utilisation de routes)


app.listen('3005', () => {
    console.log('Serveur port : 3005');
});

module.exports = app;
