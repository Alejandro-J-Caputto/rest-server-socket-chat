const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/usuario');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

 exports.getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const users = User.find({active: {$ne : false}}).limit(+limit).skip(+from)
  const total = User.countDocuments();

  const [usersAll, totalCount] = await Promise.all([
    users,
    total

  ])
  res.status(200).json({
    status: 'success',
    usersAll,
    totalCount
  })

}


exports.createUser = catchAsync(async(req, res ,next) => {
  let { name, email, password } = req.body;
  const newUser = new User({name, email, password});
  
  //ENCRIPTA PASSWORD 
  const salt = bcrypt.genSaltSync();
  newUser.password = bcrypt.hashSync( password, salt);

  //CREATE DOCUMENT IN THE DB
  // await newUser.save();
  await newUser.save();

  res.status(200).json({
    status: 'success',
    message: 'user succesfully created'
  })
})
 exports.getUserById = (req, res) => {
  const userId = req.params.id;
  console.log(userId)
  res.status(200).json({
    status: 'success',
    message: 'Hello getUsers'
  })
}
 exports.deleteUser = async (req, res) => {

  const changeStatus = await User.findByIdAndUpdate(req.params.id, {active : false}, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    message: 'User have been deleted',
    changeStatus,
    uid : req.uid
  })
}
 exports.editUser = async (req, res) => {

  const {id} = req.params;
  const {password, google, email, ...rest} = req.body;
  const updateTour = await User.findByIdAndUpdate(id, rest, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    updateTour
  })
}

