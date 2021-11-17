const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneModelsSauce);
router.post('/', auth, multer, saucesCtrl.createModelsSauce);
router.post('/:id/like', auth, saucesCtrl.createLikeSauce);
router.put('/:id', auth, multer, saucesCtrl.modifyModelsSauce);
router.delete('/:id', auth, saucesCtrl.deleteModelsSauce);

module.exports = router;