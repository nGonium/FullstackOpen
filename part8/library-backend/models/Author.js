const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  books: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Book',
      default: [],
    },
  ],
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', schema);
