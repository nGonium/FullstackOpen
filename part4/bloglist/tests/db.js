if (process.env.NODE_ENV !== 'test') throw new Error('Tried to run test helper without setting NODE_ENV to test') 
const Blog = require("../models/blog");
const User = require("../models/User");

// User
// blog

// const clearDb = () => {
//   Promise.all([User.deleteMany({}), Blog.deleteMany({})])
// }

// const createBlog = async (user, concat = '') => {
//   const template = {
//     title: `Blog title${concat}`,
//     author: `Generated Author`,
//     url: 'www.example.com',
//     user: user.id,
//   }
//   const newBlog = new blog(template)
//   const savedBlog = await doc.save()
//   user.blogs = user.blogs.concat(savedBlog.id) 
//   const savedUser = await user.save()
//   return savedBlog
// }

// const createUser = async (concat = '') => {
//   const template = {
//     username: `generated-user${concat}`,
//     password: `password${concat}`,
//     name: `generated user${concat}`,
//   }
//   const newUser = new User(template)
//   return newUser.save()
// }

// const initDb = async () => {
//   const userWithBlogs = await createUser()
//   for (i = 0; i < 3; i++) {
//     await createBlog(userWithBlogs)
//   }
  
// }

// const Blog = require('../models/blog')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
    password: "deletedpassword",
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
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    username: "existinguser",
    passwordHash,
    name: "Deleted User"
  })
  await user.save()
  return user._id.toString() 
}

/**
 * Get a signed JSONWebToken encoding username and _id for the User
 * @param {Document} [user] Mongoose document, defaults to a newly created user 
 * @returns {string} Signed JSONWebToken string
 */
const getToken = (user) => {
  return jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
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
  })
  await blog.save()
  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, 
  nonexistingBlogId, 
  existingBlogId, 
  blogsInDb,
  nonexistingUserId,
  existingUserId, 
  usersInDb,
  getToken,
}