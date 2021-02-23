const { Category, Product } = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");



exports.getProducts = async (req, res, next) => {
  const {from = 0, limit = 10} = req.query;

  const getProductsAll = await Product
    .find({active: {$ne: false}})
    .skip(+from)
    .limit(+limit)
    .populate('user', 'name role')
    .populate('category', 'name')

  console.log('patata')
  res.status(200).json({
    status: 'success',
    message: 'Hello from products controller',
    getProductsAll
  })
}


exports.createProduct = catchAsync(async(req, res, next) => {
  const {name, description, category, price, active} = req.body;
  const productDB = await Product.findOne({name});
  const data = {
    name: name.toUpperCase(),
    user: req.uid,
    description,
    category,
    price
  }
  if(productDB) return next(new AppError('There is already a product with the same name', 400))

  const newProduct = (await Product.create(data)).populate('user', 'name role')

  res.status(201).json({
    status: 'success',
    message: 'Product succesfully created',
    newProduct
  })
}) 


exports.getProductsByID = catchAsync(async (req, res, next) => {

  const {id} = req.params;
  const product = await Product.findById(id).populate('user', 'name role').populate('category', 'name');

  console.log('hello')
  res.status(200).json({
    status: 'success',
    message: 'Hello from products by id',
    data: product
  })
})


exports.editProduct = catchAsync (async (req, res, next) => {

  const {id} = req.params
  const {active, ...body } = req.body
  body.user = req.uid;
  const editProduct = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true})

  res.status(200).json({
    status: 'success',
    message: `${editProduct.name} succesfully updated`,
    editProduct
  })
})


exports.deleteProduct = catchAsync (async (req, res, next) => {

  const {id} = req.params;

  const deletedProduct = await Product.findByIdAndUpdate(id, {active: false}, {new: true, runValidators: true})

res.status(200).json({
    status: 'success',
    message: 'Product sucesfully deleted',
    deletedProduct
  })
})