const { model, Schema, Types } = require('mongoose')

const userSchema = new Schema({
  blogs: { 
    type: [Schema.Types.ObjectId], 
    ref: 'Blog', 
    default: [], 
  },
  username: { 
    type: String, 
    required: true,
    minLength: 3,
  },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id
    delete ret.password
    delete ret.__v
    delete ret._id
  }
})

const User = model('User', userSchema)

module.exports = User