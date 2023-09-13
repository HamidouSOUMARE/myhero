var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Character = require('../models/Character');

// Importation des contrôleurs
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const { requireAuth } = require('../middlewares/auth.js');

// Importation des middlewares d'authentification
const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth.js');

// Routes GET liées à l'authentification
// router.get('/register', authController.getRegister, redirectIfLoggedIn);
// router.get('/login', authController.getLogin, redirectIfLoggedIn);
router.get('/logout', authController.logout);
// Route pour la vérification de l'authentification
router.get('/check-auth', requireAuth, (req, res) => {
  // Si le middleware requireAuth autorise la requête, cela signifie que l'utilisateur est authentifié
  res.status(200).json({ message: 'Authentifié' });
});
router.get('/profile', userController.getProfil, isLoggedIn);
router.get('/delete', userController.deleteProfil, isLoggedIn);
router.get('/getUsername', async (req, res) => {
  try {
    const { email } = req.query;

    // Recherchez l'utilisateur dans la base de données en utilisant l'adresse e-mail
    const user = await User.findOne({ email });

    if (user) {
      // Si l'utilisateur est trouvé, renvoyez son nom d'utilisateur
      res.status(200).json({ username: user.username });
    } else {
      // Si l'utilisateur n'est pas trouvé, renvoyez une erreur
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du nom d\'utilisateur', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/persos', async (req, res) => {
  try {
    const characters = await Character.find(); // Ceci récupère tous les personnages
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des personnages');
  }
});

// Routes POST liées à l'authentification et aux opérations de l'utilisateur
router.post('/register', authController.postRegister, redirectIfLoggedIn);
router.post('/login', authController.postLogin, redirectIfLoggedIn);
router.post('/profile', userController.updateProfil, isLoggedIn);
router.post('/persos', async (req, res) => {
  try {
    const character = new Character(req.body);
    const savedCharacter = await character.save();
    res.json(savedCharacter);
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout du personnage');
  }
});

// Mettre à jour un personnage
router.put('/persos/:id', async (req, res) => {
  try {
      const updatedCharacter = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedCharacter) {
          return res.status(404).send('Personnage non trouvé');
      }
      res.json(updatedCharacter);
  } catch (error) {
      res.status(500).send('Erreur lors de la mise à jour du personnage');
  }
});

// Supprimer un personnage
router.delete('/persos/:id', async (req, res) => {
  try {
      const deletedCharacter = await Character.findByIdAndRemove(req.params.id);
      if (!deletedCharacter) {
          return res.status(404).send('Personnage non trouvé');
      }
      res.json(deletedCharacter);
  } catch (error) {
      res.status(500).send('Erreur lors de la suppression du personnage');
  }
});

module.exports = router;