const bcryptjs = require('bcryptjs');
const { generateJWT, generateCOOKIE } = require('../helpers/generate-jwt');
const User = require("../models/usuario");
const AppError = require("../utils/appError");



exports.login = async (req , res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email}).select('+password +active')
  if(!user) {
    return next(new AppError('There is not an account with the provided email', 400));
  }
  if(!user.active) {
    return next(new AppError('This account has been deactivated', 400));
  }
  if(!user || !bcryptjs.compare(password, user.password)) {
    return next(new AppError('There is not an user with the provided email or password', 400));
  }
  //GENERAR TOKEN
  const token = await generateJWT(user._id)
  //GENERAR COOKIE
  await generateCOOKIE(token, res)
  user.password = undefined;
  res.status(200).json({
    user,
    token
  })
}

exports.singIn = async (req, res, next) => {
  let { name, email, password } = req.body;
  const newUser = new User({name, email, password});

  const salt = bcryptjs.genSaltSync();
  newUser.password = bcryptjs.hashSync( password, salt);
  
  await newUser.save();
  //GENERATE TOKEN
  
  const token = await generateJWT(newUser._id)

  // //GENERAR COOKIE
  await generateCOOKIE(token, res)

  res.status(200).json({
    status: 'success',
    message: 'user succesfully created',
    token
  })

}
