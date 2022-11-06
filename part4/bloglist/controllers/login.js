const auth = require('../utils/auth')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  const token = await auth.getToken(username, password)
  if (token === null) return res.status(401).json({ error: "username/password invalid" })
  res
    .status(200)
    .send({ token })
})

module.exports = loginRouter