const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL)
const { response } = require("express");
const { uploadFileAPI } = require("../helpers/upload-file");
const { User, Product } = require("../models");
const AppError = require("../utils/appError");




exports.uploadFile = async (req, res = response, next) => {
  

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new AppError('No files were uploaded'));
  }
  // if (!req.files.file) {
  //   return next(new AppError('No files were uploaded'));
  // }
  const fileName = await uploadFileAPI(req.files, undefined, 'images')

  res.json({
    name: fileName
  })
}





exports.uploadProfileIMAGE = async (req, res = response, next ) => {

  const {id, colection} = req.params;
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new AppError('No files were uploaded'));
  }
  let model; 
  switch (colection) {
    case 'users':
      model = await User.findById(id);
      if(!model) {
        return next(new AppError('This user doenst exists on our DB', 400))
      }

      break;
    case 'products':
      model = await Product.findById(id).populate('user', 'name');
      if(!model) {
        return next(new AppError('This user doenst exists on our DB', 400))
      }
      break;
    default:
      return next(new AppError('Internal server error at uploading', 500))
  }

  //Clean older files

  if(model.img) {
    //Delete the image
    const pathFile = path.join(__dirname,'../uploads', colection, model.img)
    if(fs.existsSync(pathFile)) {
      fs.unlinkSync(pathFile)
    }
  }

  
  const fileName = await uploadFileAPI(req.files, undefined, colection)
  model.img = fileName
  await model.save()
  res.json({
    model
  })
}


exports.getImage = async (req, res, next) => {
  const {id, colection} = req.params;

  let model; 
  switch (colection) {
    case 'users':
      model = await User.findById(id);
      if(!model) {
        return next(new AppError('This user doenst exists on our DB', 400))
      }

      break;
    case 'products':
      model = await Product.findById(id).populate('user', 'name');
      if(!model) {
        return next(new AppError('This user doenst exists on our DB', 400))
      }
      break;
    default:
      return next(new AppError('Internal server error at uploading', 500))
  }

  //Clean older files

  if(model.img) {
    //Delete the image
    const pathFile = path.join(__dirname,'../uploads', colection, model.img)
    if(fs.existsSync(pathFile)) {
      return res.sendFile(pathFile)
    }
  }
  const pathFile = path.join(__dirname, '../assets/no-image.jpg');

  res.sendFile(pathFile);
}


exports.uploadImageCloudinary = async (req, res = response, next ) => {

  const {id, colection} = req.params;
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new AppError('No files were uploaded'));
  }
  let model; 
  switch (colection) {
    case 'users':
      model = await User.findById(id);
      if(!model) {
        return next(new AppError('This user doenst exists on our DB', 400))
      }

      break;
    case 'products':
      model = await Product.findById(id).populate('user', 'name');
      if(!model) {
        return next(new AppError('This user doenst exists on our DB', 400))
      }
      break;
    default:
      return next(new AppError('Internal server error at uploading', 500))
  }

  //Clean older files

  if(model.img) {
    //Delete the image
    const nameCloudinaryURL = model.img.split('/');
    const name = nameCloudinaryURL[nameCloudinaryURL.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id)
  }
  
  const {tempFilePath} = req.files.file;

  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  
  model.img = secure_url

  await model.save()
  res.json({
    model
  })
}
