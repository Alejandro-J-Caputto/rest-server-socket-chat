const express = require('express')
const {check} = require('express-validator');
const { 
  getCategories,
  getCategory,
  createCategory,
  editCategory,
  deleteCategory
 } = require('../controllers/categoriesController');
const { validateJWT } = require('../middlewares/validate-jwt');
const { restrictTo } = require('../middlewares/verifyRol');
const productRouter = require('../routes/productRoutes');


const router = express.Router()

router.use('/:categorie/products', productRouter)

router.route('/')
.get(getCategories)
.post( validateJWT, createCategory)

router.route('/:id')
  .get(getCategory)
  .patch(validateJWT, editCategory)
  .delete(validateJWT,restrictTo('ADMIN'), deleteCategory)




module.exports = router;