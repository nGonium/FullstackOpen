const Blog = require('../models/blog')

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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, nonexistingBlogId, existingBlogId, blogsInDb
}