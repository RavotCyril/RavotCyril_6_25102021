const ModelsSauce = require('../models/ModelsSauce');
const fs = require('fs');

exports.createModelsSauce = (req, res, next) => {
    const ModelsSauceObject = JSON.parse(req.body.ModelsSauce);
    delete ModelsSauceObject._id;
    const modelsSauce = new ModelsSauce({
        ...ModelsSauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    modelsSauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneModelsSauce = (req, res, next) => {
    ModelsSauce.findOne({
        _id: req.params.id
    }).then(
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

exports.modifyModelsSauce = (req, res, next) => {
    const ModelsSauceObject = req.file ? {
        ...JSON.parse(req.body.ModelsSauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    ModelsSauce.updateOne({ _id: req.params.id }, {...ModelsSauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};
exports.deleteModelsSauce = (req, res, next) => {
    ModelsSauce.findOne({ _id: req.params.id })
        .then(ModelsSauce => {
            const filename = ModelsSauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                ModelsSauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

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