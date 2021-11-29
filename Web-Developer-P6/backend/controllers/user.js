const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); /* Jeton Token */

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) /* Le sel à utiliser dans le cryptage. S'il est spécifié sous forme de nombre, un sel sera généré avec le nombre de tours spécifié et utilisé. */
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(403).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        /*  Id généré par MongoDB */
                        token: jwt.sign({ userId: user._id }, /* Token d'authentification */
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' } /* Temps de validité du Token */
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};