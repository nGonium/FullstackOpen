if (process.env.NODE_ENV !== 'test') throw new Error('Tried to run test helper without setting NODE_ENV to test') 
const Blog = require("../models/Blog");
const User = require("../models/User");
const auth = require('../utils/auth')

const initialBlogs = [
  {
    title: 'Hello World',
    author: 'John Doe',
    url: 'http://www.test.com',
    likes: 0,
  },
  {
    title: 'Hello Joe',
    author: 'Anonymous',
    url: 'http://www.test.com',
    likes: 12,
  },
  {
    title: 'Bye World',
    author: 'Mery Doe',
    url: 'http://www.test.com',
    likes: 8,
  },
  {
    title: 'Afternoon Mars',
    author: 'John Cleese',
    url: 'http://www.test.com',
    likes: 60,
  }
]

const nonexistingUserId = async () => {
  const user = new User({
    username: "deleteduser",
    passwordHash: "deletedpassword",
    name: "Deleted User"
  })
  await user.save()
  await user.remove()
  return user._id.toString()
}

/**
 * Creates new user with te given password, then returns its id after saving
 * @param {string} password Plaintext password
 * @returns ID of new user 
 */
const existingUserId = async (password) => {
  const passwordHash = await auth.hashPassword(password)
  const user = new User({
    username: "existinguser",
    passwordHash,
    name: "Deleted User"
  })
  await user.save()
  return user._id.toString() 
}

const nonexistingBlogId = async () => {
  const blog = new Blog({
    title: 'New Post',
    author: 'Veritas',
    url: 'http://www.test.com',
    likes: 0,
  })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const existingBlogId = async () => {
  const blog = new Blog({
    title: 'New Post',
    author: 'Veritas',
    url: 'http://www.test.com',
    likes: 0,
    user: '6367e89f731611776fd12350',
  })
  const savedBlog = await blog.save()
  return savedBlog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const createBlog = async (user, blog) => {
  const newBlog = new Blog({ ...blog, user: user._id })
  user.blogs = user.blogs.concat(newBlog._id)
  const blogPromise = newBlog.save()
  await Promise.all[blogPromise, user.save()]
  return blogPromise
}

module.exports = {
  initialBlogs, 
  nonexistingBlogId, 
  existingBlogId, 
  blogsInDb,
  nonexistingUserId,
  existingUserId, 
  usersInDb,
  createBlog
}