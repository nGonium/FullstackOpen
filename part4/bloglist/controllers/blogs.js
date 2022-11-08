const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const middleware = require('../utils/middleware')
require('express-async-errors')

const isUserBlogCreator = (user, blog) => user._id.toString() === blog.user.toString()

/**
 * Create a blog, automatically updating its user field and blogs array in user
 * @param {doc} blog Doc for creating blog, not containing user field
 * @param {Document} user User document
 * @return Blog after saving
 */
const createBlog = async (blog, user) => {
  const userid = user._id
  const newBlog = new Blog({...blog, user: userid})
  const blogid = newBlog._id
  user.blogs = user.blogs.concat(blogid)
  await newBlog.save()
  await user.update({ blogs: user.blogs.concat(blogid) })
  return newBlog
}

/**
 * Delete a blog, automatically updating blogs array in user
 * @param {doc} blog Doc for creating blog, not containing user field
 * @param {Document} user User document
 * @return Array [blog, user] after saving
 */
const deleteBlog = async (blog, user) => {
  if (!blog || !user.blogs) throw new Error('Invalid blog or user')
  user.blogs = user.blogs.filter(b => b.toString() !== blog._id.toString())
  return Promise.all([blog.delete(), user.save()])
}

const updateBlog = (blogToUpdate, fieldsToUpdate) => {
  delete fieldsToUpdate.users 
  delete fieldsToUpdate._id
  delete fieldsToUpdate.__v
  return Object.assign(blogToUpdate, fieldsToUpdate)
}

// Show all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user')
  res.json(blogs)
})

// Create blog if bearing a valid token
blogsRouter.post('/', 
  middleware.tokenValidator, 
  middleware.userExtractor, 
  async (req, res, next) => {
    const user = req.user
    const blog = await createBlog(req.body, user)
    res.status(201).json(blog)
  }
)

// Update blog if authorized
blogsRouter.put('/:id', 
  middleware.tokenValidator,
  middleware.userExtractor, 
  async (req, res) => {
    const blogid = req.params.id
    const blog = await Blog.findById(blogid)
    const user = req.user
    if (!blog) res.status(404).send({ message: 'Blog not found' })
    if(!isUserBlogCreator(user, blog)) return res.status(403).send({ error: 'User not authorized for this action' })
    const updatedBlog = updateBlog(blog, req.body)
    const savedBlog = await updatedBlog.save()
    console.log(savedBlog)
    return res.status(200).json(savedBlog)
  }
)

// Delete blog if authorized (204). 403 if authorization fails, 200 if blog is not found
blogsRouter.delete('/:id', 
  middleware.tokenValidator, 
  middleware.userExtractor, 
  async (req, res) => {
    const blogid = req.params.id
    const blog = await Blog.findById(blogid)
    const user = req.user
    if (!blog) res.status(200).send({ message: 'Blog already deleted' })
    if (!isUserBlogCreator(user, blog)) return res.status(403).send({ error: 'User not authorized for this action' })
    await deleteBlog(blog, user)
    res.status(204).end()
  })

module.exports = blogsRouter