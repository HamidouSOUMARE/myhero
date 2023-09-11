const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const path = require('path');

// Chargement des variables d'environnement
dotenv.config();

exports.getRegister = (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
};

exports.postRegister = async (req, res) => {
    const { username, email, password } = req.body;

    // Validation basique des entrées
    if (!username || !email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création de l\'utilisateur. Veuillez réessayer.');
    }
};

exports.getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
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

            res.redirect('/profil');
        } else {
            res.status(401).send('Email ou mot de passe incorrect.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la connexion. Veuillez réessayer.');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};
