
const {Router} = require('express');
const {check} = require('express-validator');
const { uploadFile, uploadProfileIMAGE, getImage, uploadImageCloudinary } = require("../controllers/uploadsController");
const { validarCampos, allowedColections } = require('../middlewares/customValidators');


const router = Router();


router.post('/', uploadFile)

// router.put('/:colection/:id', [
//   check('id', 'Id shoold be of MongoID type').isMongoId(),
//   check('colection').custom( col => allowedColections( col, ['users', 'products'])),
//   validarCampos
// ] ,uploadProfileIMAGE )
router.put('/:colection/:id', [
  check('id', 'Id shoold be of MongoID type').isMongoId(),
  check('colection').custom( col => allowedColections( col, ['users', 'products'])),
  validarCampos
] ,uploadImageCloudinary )

router.get('/:colection/:id', [
  check('id', 'Id shoold be of MongoID type').isMongoId(),
  check('colection').custom( col => allowedColections( col, ['users', 'products'])),
  validarCampos
], getImage
)


module.exports = router;