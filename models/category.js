


const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
  name: {
    type: String,
    required: [true, 'The name is required']
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const Category = model('Category', CategoriaSchema);

module.exports = Category;