const path = require('path');
const {v4: uuidv4} = require('uuid');
const AppError = require("../utils/appError");


exports.uploadFileAPI = (files, allowExtensions = ['png', 'jpg','jpeg', 'gif'], folder ='') => {

return new Promise ((resolve, reject) => {
    const {file} = files
    const validateName = file.name.split('.');
    const extension = validateName[validateName.length - 1];
  
    if( !allowExtensions.includes(extension))
    return reject(new AppError('This extension/format is not allowed plese choose betweem these... ' + allowExtensions, 400));
  
    const temporalName = uuidv4() + '.' + extension;
  
    const uploadPath = path.join(__dirname,'../uploads/',folder, temporalName);
  
    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, (err) => {
      if (err)
        return reject(new AppError('Internal server error', 500))
  
      resolve(temporalName)
    });

  })
}