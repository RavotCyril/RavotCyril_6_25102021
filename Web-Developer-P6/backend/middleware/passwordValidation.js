/* Vérifier le mot de passe et s'y il est bien conforme au schémaPassword */

const passwordSchema = require("../models/PasswordValidator");

module.exports = (req, res, next) => {

    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({
            message: "Le mot de passe doit contenir au moins 8 caractères.Une majuscule, Une miniscule, 2 chiffres et pas d'espace"
        });
    } else {
        next(); /*  Si ok, passe au prochain middleware */
    }
}