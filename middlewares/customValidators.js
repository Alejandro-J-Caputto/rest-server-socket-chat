const User = require("../models/usuario");
const AppError = require("../utils/appError");
const { validationResult } = require('express-validator');
const { Category } = require("../models");




exports.emailExist = async( req, res , next) => {

  const {email} = req.body;
  const emailExist = await User.findOne({email});
  if(emailExist) {
    return next(new AppError('There is already an account with the provided email', 400));
  }
  next();
  
}

exports.checkPassword = (req, res ,next) => {

  let {password, passwordConfirm} = req.body;

  if(password === passwordConfirm) {
    passwordConfirm = undefined
    return next();
  }
  if(password !== passwordConfirm) next(new AppError('The password should be equal', 400))
}


exports.checkIdExists = (model) => {
 return async (req, res, next) => {
  console.log(model)
    const {id} = req.params;
    console.log(id)

    const documentID = await model.findById({_id: id});
    if(!documentID) return next(new AppError('This ID doent exist on the DB', 400));
  
    next();
  }
 }


exports.validarCampos = ( req, res, next ) => {

  const errors = validationResult(req);
  if( !errors.isEmpty() ){
      return res.status(400).json(errors);

  }

  next();
}

exports.checkParamCategory = async (req, res , next) => {

  const {categorie} = req.params;
  if(categorie) {

    const checkCategorieParam = await Category.findOne({name: categorie.toUpperCase()});
    if(!checkCategorieParam || checkCategorieParam === null) {
      return next (new AppError('This category doesn\'t exist'))
    }
  }
  next();

}
//Validate allowed colections
exports.allowedColections = ( colection = '', colections = []) => {
  const isIncluded = colections.includes(colection);
  if(!isIncluded) {
    throw new AppError(`The colection ${colection} is not allowed`)
  }
  return true;
}