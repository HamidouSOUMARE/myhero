//Importation des modules nécessaires
const User = require('../models/User');
const { userResponseParser } = require('../utils/userResponseParser');



// Function pour récupérer le profil de l'utilisateur
exports.getProfil = async (req, res) => {
    try {
        // Chereche l'utilisateur en fonction de son id stocké dans le cookie
        const user = await User.findById(req.user.userId);
        //si l'utilisateur n'existe pas, on renvoie une erreur
        if (!user) {
            return res.status(404).json({error: 'Utilisateur non trouvé'});
        }
        // si l'utilisateur existe, on renvoie ses données
        res.render('pages/profil', {user: userResponseParser(user)});

    } catch (error) {
        console.error(error);
        // en cas d'erreur, on renvoie une erreur 500
        res.status(500).send('Erreur de récupération du profil');

    }
};
        
// Function pour modifier le profil de l'utilisateur
exports.updateProfil = async (req, res) => {
    try {
        const {username, email} = req.body;

        // Mettre à jour l'utilisateur en fonction de son id stocké dans le cookie
        await User.findByIdAndUpdate(req.user.userId, {username, email});

        // Rediriger l'utilisateur vers la page profil
        res.redirect('/profil');

    } catch (error) {
        console.error(error);
        // en cas d'erreur, on renvoie une erreur 500
        res.status(500).send('Erreur de modification du profil');
    }
};

// Function pour supprimer le profil de l'utilisateur
exports.deleteProfil = async (req, res) => {
    try {
        //Supprimer l'utilisateur en fonction de son id stocké dans le cookie
        await User.findByIdAndDelete(req.user.userId);
        res.redirect('/register');
    }
    catch (error) {
        console.error(error);
        // en cas d'erreur, on renvoie une erreur 500
        res.status(500).send('Erreur lors de la suppression du profil');
    }
};

// ajouter d'autres métgodes de votre choix pour gérer les autres fonctionnalités de votre application