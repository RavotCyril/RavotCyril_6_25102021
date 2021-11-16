const ModelsSauce = require('../models/ModelsSauce');
const fs = require('fs');

// Créer une sauce
exports.createModelsSauce = (req, res, next) => {
    // Appel du body de la sauce.
    let sauce = JSON.parse(req.body.sauce);
    delete sauce._id;
    const modelsSauce = new ModelsSauce({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
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

exports.createLikeSauce = (req, res, next) => {
    let sauce
    JSON.parse(JSON.stringify(req.body.sauce));
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.usersLiked = 0;
    sauce.usersDisliked = 0;
    let likes = document.querySelector('likes');

    likes.addEventListener("click", function() {
        sauce.likes += 1;
        sauce.usersLiked += 1;
    })
    let dislikes = document.querySelector('dislikes');
    dislikes.addEventListener("click", function() {
        sauce.dislikes += 1;
        sauce.usersDisliked += 1;
    })
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