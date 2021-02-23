const express = require('express')
const {check} = require('express-validator');

const { 
  getUsers, 
  createUser,
  getUserById,
  deleteUser,
  editUser, 
} = require('../controllers/userController');
//USANDO MIS MIDDLEWARES TO VALIDATE
const { emailExist, checkPassword, checkIdExists, validarCampos } = require('../middlewares/customValidators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { restrictTo } = require('../middlewares/verifyRol');

const router = express.Router()


router.route('/')
  .get(getUsers)
  .post(checkPassword, emailExist, createUser);
router.route('/:id')
  .get(getUserById)
  .delete(validateJWT,restrictTo('ADMIN'), deleteUser)
  .put(check('id', 'No es un ID valido').isMongoId(), validarCampos ,editUser)



module.exports = router;

