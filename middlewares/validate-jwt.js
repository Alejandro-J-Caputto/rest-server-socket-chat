const {promisify} = require('util')
const { response, request } = require("express")
const jwt = require("jsonwebtoken")
const AppError = require("../utils/appError")


exports.validateJWT = async (req = request, res = response, next) => {
  let token;
  if(req.header('Authorization')) {
    token = req.header('Authorization').split(' ')[1];
  } else if (req.cookies['jwt-cookie-cafe']) {
    token = req.cookies['jwt-cookie-cafe']
  }
  if(!token) {
    return next(new AppError('Your are not logged in, please log in and try again', 401))
  }
  // const decodedUserID = await promisify(jwt.verify)(token, process.env.PRIVATEPOTATOE);
  const decodedUserID = jwt.verify(token, process.env.PRIVATEPOTATOE)
  const { uid } = decodedUserID;
  req.uid = uid;
  next();
} 