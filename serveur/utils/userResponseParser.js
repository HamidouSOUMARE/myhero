// Définition d'une fonction qui formate l'objet utilisateur pour la réponse

/**
 * Cette fonction prend en paramètre un objet utilisateur et retourne 
 * une version simplifiée et sécurisée de cet objet. 
 * Elle permet d'éviter d'exposer des informations sensibles 
 * (comme les mots de passe) lors de la réponse à une requête client.
 *
 * @param {Object} user - Objet utilisateur provenant de la base de données.
 * @returns {Object} Un objet contenant des informations sélectionnées de l'utilisateur.
 */
exports.userResponseParser = (user) => {
    return {
        // ID de l'utilisateur (peut être null si non défini)
        id: user._id || null,

        // Email de l'utilisateur
        email: user.email,

        // Nom d'utilisateur (username)
        username: user.username
    }
}