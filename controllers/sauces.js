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

    const userId = req.body.userId;
    const like = req.body.like;
    const sauce = req.params.id;
    ModelsSauce.findOne({ _id: sauce })
        .then(sauce => {
            console.log(sauce)
            switch (like) {
                // Dislike : Si like = -1, l'utilisateur n'aime pas la sauce.

                case -1:
                    console.log('Je n`aime pas');
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes -= 1;
                    break;
                    // Je ne sais pas  : Si like = 0, L'utilisateur annule son like ou son dislike.

                case 0:
                    console.log('je sais pas');
                    sauce.usersDisliked.splice(userId, 1)
                    sauce.usersLiked.splice(userId, 1)

                    break;

                    // like : Si like = 1, L'utilisateur aime la sauce.

                case 1:
                    console.log('j`aime');
                    sauce.usersLiked.push(userId);
                    sauce.likes += 1;
                    break;
            };
            sauce.save()
                .then(() => res.status(200).json({ message: 'Sauce notée' }))
                .catch(error => res.status(403).json({ error }))
        });
    console.log("alert3");
};