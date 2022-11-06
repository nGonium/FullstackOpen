const User = require("../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const tokenSecret = process.env.SECRET || 'tokensecret'

const saltRounds = 10
const hashPassword = (password) => bcrypt.hash(password, saltRounds)
const validatePassword = (plain, hash) => bcrypt.compare(plain, hash)

/**
 * Asynchronously validates credentials and return a signed token. Returns null 
 * if validation fails.
 * @param {string} username Existing username
 * @param {string} password Matching plaintext password
 * @returns {string | null} Signed JSONWebToken or null
 */
const getToken = async (username, password) => {
  const user = await User.findOne({ username })
  const isValidCredentials = user === null 
    ? false 
    : await validatePassword(password, user.passwordHash)
  if (!isValidCredentials) {
    return null
  }
  return jwt.sign({ username: user.username, id: user._id }, tokenSecret)
}

/**
 * ONLY USE FOR TESTING, creates authorization token without validating password. 
 * Security risk if used outside of testing. 
 * @param {Document} user 
 * @returns {string} Signed JSONWebToken
 */
const getTokenNoValidation = (user) => {
  return jwt.sign({ username: user.username, id: user._id }, tokenSecret)
}

/**
 * Synchronously verify token using jwt, returning the decoded token. Throws 
 * JSONWebToken error if verification fails.
 * @param {string} token signed token
 * @returns {Object} decoded token
 */
const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, tokenSecret)
  if (!decodedToken.id) throw new jwt.JsonWebTokenError('invalid token')
  return decodedToken
}


module.exports = {
  getToken,
  verifyToken,
  hashPassword,
  getTokenNoValidation,
}