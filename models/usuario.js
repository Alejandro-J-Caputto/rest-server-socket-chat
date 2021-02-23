const validator = require('validator');
// const bcrypt = require('bcryptjs');

const {Schema, model, mongo} = require('mongoose');

const UserSchema = Schema({
  id: {
    type: mongo.ObjectID
  },
  name: {
    type: String,
    required: [true, 'The name is required'],
    trim: true
  },
  email: {
    type: String, 
    required: [true, 'Please provide a valid email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a valis password'],
    select: false
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'Plase write agagin your password to confirm'],
  //   validate: {
  //     validator: function(el) {
  //       return el === this.password;
  //     },
  //     message: 'Password doesnt match one with each other'
  //   }
  // },
  img: {
    type: String
  },
  role: {
    type: String,
    enum: ['USER_ROLE', 'ADMIN', 'EMPLOYEE'],
    default: 'USER_ROLE'
  },
  active: {
    type: Boolean,
    default: true,
    select: true
  },
  google: {
    type: Boolean,
    default: false
  }

});
UserSchema.methods.toJSON = function () {
  const {__v, password, _id, ...user} = this.toObject();
  user.uid = _id;
  return user;
}
const User = model('User', UserSchema);
// UserSchema.pre('save', async function(next) {

//   if(!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 12);

//   this.passwordConfirm = undefined;
//   next();
// })

module.exports = User;