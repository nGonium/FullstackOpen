const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('./auth')

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
    if (!req.token) throw new Error('Request missing token')
    req.decodedToken = auth.verifyToken(req.token)
  } catch (err) {
    res.status(401)
    return next(err)
  }
  next()
}

// Throws error if user not found
const userExtractor = async (req, res, next) => {
  if (req.decodedToken?.id === undefined) throw new Error('User extractor missing decoded token on request')
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

  return res.send({ error: err.message || 'An error occurred' })

  next(err)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  tokenValidator,
  userExtractor,
  unknownEndpoint,
  errorHandler
}