const { response } = require("express");
const User = require("../models/usuario");
const AppError = require("../utils/appError");
const Category = require('../models/category');
const Product = require('../models/products');
const {ObjectId} = require('mongoose').Types;


const allowedColections = [
  'users',
  'categories',
  'products'
]

const searchUser = async (terminus, res = response) => {

  const keyWord = new RegExp(terminus, 'i');

  const isMongoID = ObjectId.isValid(terminus);

  if(isMongoID) {
    const user = await User.findById(terminus);
    return res.status(200).json({
      results: (user) ? [user] : []
    })
  }

  const users = await User.find({
    $or: [{name: keyWord}, {email: keyWord}],
    $and: [{active: {$ne: false}}]
  })
  return res.status(200).json({
    results: users
  })
}

const searchCategory = async( terminus = '', res = response ) => {

  const esMongoID = ObjectId.isValid( terminus ); // TRUE 

  if ( esMongoID ) {
      const category = await Category.findById(terminus);
      return res.json({
          results: ( category ) ? [ category ] : []
      });
  }

  const regex = new RegExp( terminus, 'i' );
  const categories = await Category.find({ name: regex, active: true });

  res.json({
      results: categories
  });

}

const searchProduct = async( terminus = '', res = response ) => {

  const esMongoID = ObjectId.isValid( terminus ); // TRUE 

  if ( esMongoID ) {
      const product = await Product.findById(terminus)
                          .populate('category','name');
      return res.json({
          results: ( product ) ? [ product ] : []
      });
  }

  const regex = new RegExp( terminus, 'i' );
  const products = await Product.find({ name: regex, active: true })
                          .populate('category','name')

  res.json({
      results: products
  });

}


exports.searchDoc = (req, res = response, next) => {


  const {colection, terminus} = req.params;

  if(!allowedColections.includes(colection)) {
    return next( new AppError(`The allowed collections are ${allowedColections}`))
  }

  switch (colection) {
    case 'users':

      searchUser(terminus, res)


      break;
    case 'categories':
      searchCategory(terminus, res)
      break;      
    case 'products':
      searchProduct(terminus, res)
      break;

    default:
     return next(new AppError('This action is not working', 500))
  }

  // res.json({
  //   colection, terminus
  // })
}