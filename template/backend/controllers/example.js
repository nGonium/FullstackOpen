const blogsRouter = require('express').Router()
const Example = require('../models/example')

const getExample = (req, res) => {
  Example
    .find({})
    .then(results => {
      res.status(200).json(results)
    })
    .catch(err => undefined)
}

const postExample = (req, res) => {
  Example
    .find({})
    .then(results => {
      res.status(201).json(results)
    })
    .catch(err => undefined)
}

const updExample = (req, res) => {
  Example
    .find({})
    .then(results => {
      res.status(200).json(results)
    })
    .catch(err => undefined)
}

const delExample = (req, res) => {
  Example
    .find({})
    .then(results => {
      res.status(200).json(results)
    })
    .catch(err => undefined)
}

module.exports = {
  getExample,
  postExample,
  updExample,
  delExample
}