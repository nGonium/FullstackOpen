const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const isValidCredentials = user === null 
    ? false 
    : await bcrypt.compare(password, user.password)
  if (!isValidCredentials) {
    return res.status(401).json({ error: "username/password invalid" })
  }
  const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter