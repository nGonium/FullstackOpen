const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
    .catch(err => undefined)
})

blogsRouter.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => undefined)
})

blogsRouter.put('/:id', (req, res) => {
  return
})

blogsRouter.delete('/:id', (req, res) => {
  return
})

module.exports = blogsRouter