const {Schema, model} = require('mongoose');

const ProductSchema = Schema({

  name: {
    type: String,
    required: [true, 'the name is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  description: {type: String},
  avalilable: {type: Boolean, default: true},
  img: {type: String}

})


ProductSchema.methods.toJSON = function () {
  const {__v, active, ...data} = this.toObject();
  return data;
}




const Product = model('Product', ProductSchema);

module.exports = Product;