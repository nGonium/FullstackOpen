const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, },
  author: String,
  url: { type: String, required: true, },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  likes: { type: Number, default: 0, },
})

blogSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)