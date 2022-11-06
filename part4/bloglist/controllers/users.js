const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Password too short' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const createdUser = new User({ username, passwordHash, name })
  const savedUser = await createdUser.save()
  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const listUsers = await User.find({}).populate('blogs') //await User.updateMany({ blogs: undefined }, {blogs: []})
  res.json(listUsers)
})

module.exports = usersRouter