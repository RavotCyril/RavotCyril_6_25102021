/* Gestions des fichiers envoyés à L'API */

/* Importation du package multer.
Multer est un middleware node.js pour la gestion des données multipart/form-data,
qui est principalement utilisé pour le téléchargement de fichiers.*/
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
/* Créer un object de configuration pour multer  */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
/* Exporte le middleware multer */
module.exports = multer({ storage: storage }).single('image');