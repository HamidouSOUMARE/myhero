// Importation du module express-session
const session = require('express-session');

// Configuration et exportation de la session pour une utilisation dans l'app Express
module.exports = session({
    secret: 'JWT_SECRET', // Secret utilisé pour signer le cookie de session
    resave: false,        // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store.
    cookie: { secure: false } // Utilisez 'secure: true' en production si vous utilisez HTTPS
});