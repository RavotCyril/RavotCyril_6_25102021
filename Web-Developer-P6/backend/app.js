/* Application */

/* Framework node.js */
const express = require('express');
/* Rend les interactions fluides entre MongoDB et Node.Js */
const mongoose = require('mongoose');
/* Dotenv est un module sans dépendance qui charge les variables d'environnement 
d'un fichier .env dans process.env.
Le stockage de la configuration dans l'environnement séparé du code est basé sur
la méthodologie de l'application Twelve-Factor. */
require('dotenv').config()
    /* Définit des en têtes http supplémentaires securisés  */
const helmet = require('helmet');
/* Donne accès au chemin de nos fichiers. */
const path = require('path');
/* Importe les routes User et Sauces */
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Connexion à la base de données MongoDb

mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_NAME + ".lwef4.mongodb.net/P6-Piquante?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Lancement d'express 

const app = express();

// Middlewares
/*   
Configuration des cors (Cross-origin resource sharing) 
Le Cross-Origin Resource Sharing ou CORS est un mécanisme qui permet à des ressources restreintes 
d'une page web d'être récupérées par un autre domaine extérieur au domaine 
à partir duquel la première ressource a été servie.
*/
const cors = require('cors');
const corsOption = {
    origin: '*'
}
app.use(cors(corsOption));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Parse le body des requêtes en Json ( analyse le corps de la requête )

app.use(express.json());

// Permet de sécuriser les headers de l'application
/*  app.use(helmet());...is equivalent to this:The top-level helmet function is a wrapper around 15 smaller middlewares,
11 of which are enabled by default.
  
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

*/
app.use(helmet());

// Routes Images-sauce - Authentication 

/* Gestion des fichiers images */

app.use('/images', express.static(path.join(__dirname, 'images')));
/* Enregistre les routes sauces et auth de l'application */
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;