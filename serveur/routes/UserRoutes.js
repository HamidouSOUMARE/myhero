var express = require('express');
var router = express.Router();

// Importation des contrôleurs
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

// Importation des middlewares d'authentification
const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth.js');

//================
// Routes liées à l'authentification
//================

// Route pour afficher le formulaire d'inscription
router.get('/register', authController.getRegister, redirectIfLoggedIn);

// Route pour soumettre le formulaire d'inscription
router.post('/register', authController.postRegister, redirectIfLoggedIn);

// Route pour afficher le formulaire de connexion
router.get('/login', authController.getLogin, redirectIfLoggedIn);

// Route pour soumettre le formulaire de connexion
router.post('/login', authController.postLogin, redirectIfLoggedIn);

// Route pour se déconnecter
router.get('/logout', authController.logout);


//================
// Routes liées aux opérations de l'utilisateur
// Ces routes nécessitent d'être connecté pour fonctionner
//================

// Route pour afficher le profil de l'utilisateur
router.get('/profile', userController.getProfil, isLoggedIn);

// Route pour modifier le profil de l'utilisateur
router.post('/profile', userController.updateProfil, isLoggedIn);

// Route pour supprimer le profil de l'utilisateur
router.get('/delete', userController.deleteProfil, isLoggedIn);


module.exports = router;