const User = require('../models/User');
const { userResponseParser } = require('../utils/userResponseParser');

// Function pour récupérer le profil de l'utilisateur
exports.getProfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({error: 'Utilisateur non trouvé'});
        }

        const userData = userResponseParser(user); // Supposant que cela renvoie un objet contenant les données de l'utilisateur
        res.json(userData);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur de récupération du profil'});
    }
};
        
// Function pour modifier le profil de l'utilisateur
exports.updateProfil = async (req, res) => {
    try {
        const {username, email} = req.body;
        const user = await User.findByIdAndUpdate(req.user.userId, {username, email}, {new: true});

        const updatedData = userResponseParser(user); // Supposant que cela renvoie un objet contenant les données de l'utilisateur mises à jour
        res.json(updatedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur de modification du profil'});
    }
};

// Function pour supprimer le profil de l'utilisateur
exports.deleteProfil = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.json({success: 'Profil supprimé avec succès'});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Erreur lors de la suppression du profil'});
    }
};
