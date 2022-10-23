const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
})

blogSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)