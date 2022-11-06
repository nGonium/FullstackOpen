const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const middleware = require('../utils/middleware')
require('express-async-errors')

// Show all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user')
  res.json(blogs)
})

// Create blog if authorized, using token userid
blogsRouter.post('/', 
  middleware.tokenValidator, 
  middleware.userExtractor, 
  async (req, res, next) => {
    const { url, title, author } = req.body
    const user = req.user
    const blog = new Blog({ url, title, author, user: user.id })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  }
)

// Update blog if authorized
blogsRouter.put('/:id', async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body)
  res.status(200).end()
})

const isUserBlogCreator = (user, blog) => user._id.toString() === blog.user.toString()

// Delete blog if authorized (204). 403 if authorization fails, 200 if blog is not found
blogsRouter.delete('/:id', 
  middleware.tokenValidator, 
  middleware.userExtractor, 
  async (req, res) => {
    const blogid = req.params.id
    const user = req.user
    const blog = await Blog.findById(blogid)
    if (!blog) res.status(200).send({ message: 'Blog already deleted' })
    if (!isUserBlogCreator(user, blog)) return res.status(403).send({ error: 'User not authorized for this action' })
    user.blogs = user.blogs.filter(id => id.toString() !== blogid)
    await blog.delete()
    await user.save()
    res.status(204).end()
  })

module.exports = blogsRouter