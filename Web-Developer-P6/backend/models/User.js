/* On importe Mongoose */
const mongoose = require('mongoose');
/* L'adresse email ne peut être utilisé qu'une seule fois. */
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, }
});
/* Prés-validation des informations avant de les enregistrer avec le plugin de Mangoose-uniqueValidator */
userSchema.plugin(uniqueValidator);

/* Exporter le schéma  */
module.exports = mongoose.model('User', userSchema);