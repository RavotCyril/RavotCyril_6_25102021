const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; /* Récupération du token après séparation du bearer (espace) */
        const decodedToken = jwt.verify(token, process.env.DB_TOKEN); /* Décode le token */
        const userId = decodedToken.userId; /* userId du token décodé précedemment */
        if (req.body.userId && req.body.userId !== userId) {
            /* Si on a un userId dans la requete et qu'il est différent de l'userId encodé 
            dans le token cela envoie " invalid user id " */
            throw 'Invalid user ID';
        } else {
            next(); /* Si ok, passe au prochain middleware */
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};