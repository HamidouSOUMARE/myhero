// Importation du module express-session
const session = require('express-session');

// Configuration et exportation de la session pour une utilisation dans l'app Express
module.exports = session({
    secret: process.env.SESSION_SECRET, // Utilisez la variable d'environnement pour le secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Utilisez 'secure: true' en production si vous utilisez HTTPS
});
