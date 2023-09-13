const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Middleware pour vérifier si l'utilisateur est connecté.
 * Si l'utilisateur est connecté (token valide), il continue vers la prochaine route/middleware.
 * Sinon, il est redirigé vers la page de connexion.
 */
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            res.clearCookie('token'); // Supprime le token invalide ou expiré
            return res.redirect('/login');
        }
        req.user = decodedUser; // Attache les informations décodées de l'utilisateur à la requête
        next();
    });
}

/**
 * Middleware pour rediriger l'utilisateur s'il est déjà connecté.
 * Si l'utilisateur est connecté (token valide), il est redirigé vers la page de profil.
 * Sinon, il continue vers la prochaine route/middleware.
 */
function redirectIfLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next(); // Si l'utilisateur n'est pas connecté, continuez

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (!err && decodedUser) {
            return res.redirect('/profile'); // Si l'utilisateur est connecté, redirigez-le vers le profil
        }
        next();
    });
}

const requireAuth = (req, res, next) => {
    // Récupérez le token à partir des cookies ou d'un en-tête de requête, par exemple
    const token = req.cookies.token || req.header('x-auth-token');
  
    // Vérifiez si le token existe
    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
  
    // Vérifiez le token en utilisant la clé secrète
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
      if (err) {
        // Si le token est invalide ou expiré, renvoyez une réponse de non-authentification
        return res.status(401).json({ message: 'Non authentifié' });
      }
  
      // Si le token est valide, attachez les informations de l'utilisateur décodées à la requête
      req.user = decodedUser;
      next(); // Continuez vers la route suivante
    });
  };

module.exports = {
    isLoggedIn,
    redirectIfLoggedIn,
    requireAuth
};