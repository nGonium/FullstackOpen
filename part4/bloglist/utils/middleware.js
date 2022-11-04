const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  req.token = undefined
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } 
  next()
}

// Throws error if token is invalid, creates req.decodedToken otherwise
const tokenValidator = (req, res, next) => {
  try {
    req.decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.decodedToken.id) {
      throw new jwt.JsonWebTokenError('invalid token')
    }
  } catch (err) {
    return next(err)
  }
  next()
}

// Throws error if user not found
const userExtractor = async (req, res, next) => {
  if (!req.decodedToken === undefined) tokenValidator(req, res, next)
  req.user = await User.findById(req.decodedToken.id)
  if (!req.user) {
    res.status(401)
    next(new Error('Authentication failed, user not found'))
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: err.message })
  }
  
  if (!res.status) res.status(500)

  res.send({ error: error.message || 'An error occurred' })

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  tokenValidator,
  userExtractor,
  unknownEndpoint,
  errorHandler
}