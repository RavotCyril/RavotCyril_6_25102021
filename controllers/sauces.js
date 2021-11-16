const ModelsSauce = require('../models/ModelsSauce');
const fs = require('fs');

// Créer une sauce
exports.createModelsSauce = (req, res, next) => {
    // Appel du body de la sauce.
    let sauce = JSON.parse(req.body.sauce);
    // delete sauce._id;
    const modelsSauce = new ModelsSauce({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    modelsSauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => {
            res.status(400).json({ error })
        });
};

// Afficher une seule sauce

exports.getOneModelsSauce = (req, res, next) => {
    ModelsSauce.findOne({
            _id: req.params.id,
        })
        .then(
            (ModelsSauce) => {
                res.status(200).json(ModelsSauce);
            }
        ).catch(
            (error) => {
                res.status(404).json({
                    error: error
                });
            }
        );
};
// Modifier une sauce 

exports.modifyModelsSauce = (req, res, next) => {
    if (req.file) {
        // Si l'image est modifiée L'ancienne image dans le  dossier/ Image doit être supprimé.
        ModelsSauce.findOne({ _id: req.params.id })
            .then(modelsSauce => {
                const filename = modelsSauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // Une fois que l'ancienne image est supprimée dans le dossier image.On peut mettre à jour le reste des données de la sauce. 
                    const sauce = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    ModelsSauce.updateOne({ _id: req.params.id }, {...sauce, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // Si l'image n'est jamais modifiée
        const sauce = {...req.body };
        ModelsSauce.updateOne({ _id: req.params.id }, {...sauce, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
            .catch(error => res.status(400).json({ error }));
    }
};
// Supprimer une sauce

exports.deleteModelsSauce = (req, res, next) => {
    ModelsSauce.findOne({ _id: req.params.id })
        .then(ModelsSauce => {
            const filename = ModelsSauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                ModelsSauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
// Afficher toutes les sauces

exports.getAllSauces = (req, res, next) => {
    ModelsSauce.find().then(
        (ModelsSauces) => {
            res.status(200).json(ModelsSauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
// Définit le statut "like" pour l'userId fourni. 

exports.createLikeSauce = (req, res, next) => {
    if (req.body.userId)
        ModelsSauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            let likes = document.querySelector('likes');
            let dislikes = document.querySelector('dislikes');

            likes.addEventListener("click", function() {
                // Si like = 1, L'utilisateur aime ( = like ) la sauce.
                if (sauce.likes === 0) {
                    sauce.usersLiked += 1;
                }
                // Si like = 0, L'utilisateur annule son like ou son dislike.
                else if (sauce.likes === 1) {
                    sauce.usersLiked -= 1;
                    sauce.usersDisliked = 0;
                }
                // Si like = -1, l'utilisateur n'aime pas (=dislike) la sauce.
                else if (sauce.likes === 0) {
                    sauce.usersLiked -= 1;
                    sauce.usersDisliked += 1;
                }
            })
            dislikes.addEventListener("click", function() {

                // Si like = 0, L'utilisateur annule son like ou son dislike.
                if (sauce.likes === 1) {
                    sauce.usersLiked -= 1;
                    sauce.usersDisliked -= 1;
                }
                // Si like = -1, l'utilisateur n'aime pas (=dislike) la sauce.
                else if (sauce.likes === 0) {
                    sauce.usersLiked -= 1;
                    sauce.usersDisliked += 1;
                }
            })
            ModelsSauce.updateOne({ _id: req.params.id }, {...sauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(403).json({ error }));
};