/* Importe le package password-validator de npm */
const passwordValidator = require('password-validator');

// Créer le schéma du password-validator
const passwordSchema = new passwordValidator();

/*  Avec les proprietés schémas suivantes Mot de passe utilisateur 
Entre 8-100 caractères, une minuscule, une majuscule, au minimum 2 chiffres et pas d'espace : */
passwordSchema
    .is().min(8) // Minimum 8 caractères
    .is().max(100) // Maximum 100 caractères
    .has().uppercase() // Il doit y avoir une majuscule
    .has().lowercase() // Il doit y avoir une miniscule
    .has().digits(2) // Il doit y avoir au moins 2 chiffres
    .has().not().spaces() // Il ne doit pas y avoir d'espace
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist les valeurs suivantes " Passw0ord Password123"

passwordSchema.not().uppercase(1, 'Il doit y avoir une majuscule');


// Exporter le schéma 

module.exports = passwordSchema;