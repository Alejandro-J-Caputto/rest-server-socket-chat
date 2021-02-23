
const Category = require("../models/category")
const AppError = require("../utils/appError")



exports.getCategories = async (req, res, next) => {

  const {limit = 10, from = 0 } = req.query;

  const allCategories = Category
    .find({active: {$ne: false}})
    .limit(+limit)
    .skip(+from)
    .populate('user', 'name uid role');

  const totalDocs = Category.countDocuments();  

  const [consumeCategories, consumeTotalDocs] = await Promise.all([
    allCategories,
    totalDocs
  ])

  res.status(200).json({
    status: 'success',
    message: 'hello from all categories',
    data: consumeCategories,
    consumeTotalDocs
  })
}

exports.getCategory = async ( req, res , next) => {

  const { id } = req.params;
  const getOneCategory = await Category.findById(id).populate('user', 'name uid role');
  if(!getOneCategory) return next(new AppError('Category doenst exist on DB', 400));
  console.log(getOneCategory)
  res.status(200).json({
    status: 'success',
    data: getOneCategory
  })
}
exports.createCategory = async ( req, res , next) => {
  
  const { name, active } = req.body;
  
  const checkCategoryBeforeCreation = await Category.findOne({name: name.toUpperCase()});

  if(checkCategoryBeforeCreation) return next(new AppError('The category already exists', 400));

  const newCategory = new Category({name: name.toUpperCase(), active, user: req.uid});

  await newCategory.save();


  res.status(201).json({
    status: 'success',
    message: 'New categorie ' + newCategory.name + ' has been created',
    creator: newCategory.user
  })
}
exports.editCategory = async ( req, res , next) => {
  const {id} = req.params
  const {name,...body} = req.body;

  const editCategory = await Category.findByIdAndUpdate(id, {name: name.toUpperCase()}, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    message: 'Category updated sucesfully',
    editCategory
  })
}
exports.deleteCategory = async ( req, res , next) => {

  const {id} = req.params;

  const deleteCategory = await Category.findByIdAndUpdate(id, {active: false}, {
    new: true,
    runValidators: true
  }) 

  if(!deleteCategory || deleteCategory === null) return next( new AppError('This category doesnt exist on DB'))

  res.status(200).json({
    status: 'success',
    message: 'hello succesfully deleted',
    deleteCategory
  })
}