const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const { Error } = require('mongoose')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user')
  res.json(blogs)
})

blogsRouter.post('/', middleware.tokenValidator, middleware.userExtractor, async (req, res, next) => {
  const { url, title, author } = req.body
  const user = req.user
  console.log(user)
  const blog = new Blog({ url, title, author, user: user.id })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body)
  res.status(200).end()
})

blogsRouter.delete('/:id', 
  middleware.tokenValidator, 
  middleware.userExtractor, 
  async (req, res) => {
  const userid = req.decodedToken.id
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(200).send({ message: 'Blog already deleted' })
  if (userid.toString() !== blog.user.toString()) {
    res.status(401).send({ error: 'User not authorized for this action' })
  }
  user.blogs = user.blogs.filter(id => id.toString() !== req.params.id)
  await blog.delete()
  await user.save()
  res.status(204).end()
})

module.exports = blogsRouter