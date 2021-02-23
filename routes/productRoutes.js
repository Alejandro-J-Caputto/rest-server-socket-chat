
const express = require('express')
const {check} = require('express-validator');
const {
getProducts,
createProduct,
getProductsByID,
editProduct,
deleteProduct} = require('../controllers/productController');
const { checkIdExists, validarCampos, checkParamCategory } = require('../middlewares/customValidators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { restrictTo } = require('../middlewares/verifyRol');
const { Product } = require('../models');


const router = express.Router({mergeParams: true})

router.route('/')
  .get( 
    checkParamCategory,
    getProducts
    )
  .post(
    validateJWT, 
    check('name', 'name is required').not().isEmpty(),
    check('description').not().isEmpty(),
    check('category').not().isEmpty(),
    validarCampos,
    restrictTo('ADMIN'), 
    createProduct
    )
router.route('/:id')
  .get(
    check('id', 'Is not a valid mongoID').isMongoId(),
    checkIdExists(Product),
    validarCampos,
    getProductsByID)
  .patch(validateJWT, 
    checkIdExists(Product) ,
    editProduct)
  .delete(validateJWT, 
    restrictTo('ADMIN'), 
    checkIdExists(Product),
    check('id', 'Is not a valid mongoID').isMongoId(), 
    deleteProduct)



module.exports = router;