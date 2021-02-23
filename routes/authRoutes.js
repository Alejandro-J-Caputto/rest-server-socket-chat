const express = require('express')
const {check} = require('express-validator');
const { login, singIn } = require('../controllers/authController');
const { validarCampos, checkPassword, emailExist } = require('../middlewares/customValidators');


const router = express.Router()


router.post('/login',
  check('email', 'The email is required').isEmail(),
  check('password', 'The password is required').not().isEmpty(),
  validarCampos,
  login)

  router.post('/register',
  check('name').trim().not().isEmpty(),
  check('email', 'The email is required').isEmail(),
  check('password', 'The password is required').not().isEmpty(),
  check('passwordConfirm', 'The password confirm field is required').not().isEmpty(),
  validarCampos, checkPassword, emailExist, singIn)


module.exports = router;
