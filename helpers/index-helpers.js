const uploadFileHelper = require('./upload-file');
const generateJWT = require('./generate-jwt');


module.exports = {
  ...uploadFileHelper,
  ...generateJWT
}