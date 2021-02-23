const User = require("../models/usuario");
const AppError = require("../utils/appError");


exports.restrictTo =  (...roles) => {
  return async (req, res ,next) => {
    
    const userRole = await User.findOne({_id: req.uid});
    if (!userRole) return next(new AppError('User doest not exists DB', 401));
    console.log({roles, userRole})
    if(!roles.includes(userRole.role) || !userRole.active) {
      return next( new AppError('Your dont have permission to perform this action', 403));
    }
    next();
  }
}