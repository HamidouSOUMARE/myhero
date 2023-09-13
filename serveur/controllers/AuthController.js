const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

// Chargement des variables d'environnement
dotenv.config();

exports.postRegister = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ message: 'Inscription réussie.' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur. Veuillez réessayer.' });
    }
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const user = await User.findOne({ email });

        if (user && await bcryptjs.compare(password, user.password)) {
            const token = jwt.sign({ 
                userId: user._id, 
                username: user.username 
            }, process.env.JWT_SECRET, {
                expiresIn: '2h'
            });

            res.cookie('token', token, {
                expires: new Date(Date.now() + 7200000),
                httpOnly: true,
                secure: false // Pour HTTPS, changez cela en 'true'
            });

            res.status(200).json({ message: 'Connexion réussie.' });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion. Veuillez réessayer.' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie.' });
};
