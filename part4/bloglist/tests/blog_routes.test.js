const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const hf = require('./blog_routes_helper')
const Blog = require('../models/blog')


const api = request(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(hf.initialBlogs)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('Valid token bearing user with blogposts', () => {
  
})

describe('get blogs', () => {
  it.only('succeeds with 200 and JSON content type', () => {
    api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  })

  it('returns correct amount of JSON objects', () => {
    api.get('/api/blogs')
      .expect(res => res.body.length === hf.initialBlogs.length)
  })

  it('all have a unique id', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(b => expect(b).toBeDefined())
  })  
})

describe('create blog', () => {
  let newBlog
  let method
  beforeEach(() => {
    newBlog = {
      title: 'New Post',
      author: 'Veritas',
      url: 'http://www.test.com',
      likes: 0,
    }
    method = api.post('/api/blogs')
  })

  describe('normally', () => {
    beforeEach(() => method = method.send(newBlog))

    it('succeeds with 201 Created', async () => {
      await method.expect(201)
      expect((await hf.blogsInDb()).length).toBe(hf.initialBlogs.length + 1)
    })
    
    it('returns the created object', async () => {
      const res = await method.expect('Content-Type', /json/)
      for (let key in newBlog) {
        expect(newBlog[key]).toEqual(res.body[key])
      }
    })
  })

  describe('with missing field', () => {
    it('likes defaults to 0', () => {
      delete newBlog.likes
      method.send(newBlog).expect(res => res.body.likes === 0)
    })
    
    it('title returns 400', () => {
      delete newBlog.title
      method.send(newBlog).expect(400)
    })
    
    it('url returns 400', () => {
      delete newBlog.url
      method.send(newBlog).expect(400)
    })
  })
})

describe('delete blog', () => {
  it('succeeds with 204 No Content', async () => {
    const blogId = await hf.existingBlogId()
    api.delete(`/api/blogs:${blogId}`)
      .expect(204)
  })
  
  it('DELETE successfully removes from db', async () => {
    const blogsAtStart = await hf.blogsInDb()
    const deletedBlog = blogsAtStart[0]
    await api.delete(`/api/blogs/${deletedBlog.id}`)
    const blogsAtEnd = await hf.blogsInDb()
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
    expect(blogsAtEnd.map(b => b.id)).not.toContain(deletedBlog.id)
  })
})

describe('update blog', () => {
  it('succeeds with 200', async () => {
    const blogsAtStart = await hf.blogsInDb()
    const updatedBlog = blogsAtStart[0]
    updatedBlog.title = 'Updated Title'
    api.put(`/api/blogs/${updatedBlog.id}`)
      .expect(200)
  })
  it('updated data shows up in db', async () => {
    const blogsAtStart = await hf.blogsInDb()
    const updatedBlogId = blogsAtStart[0].id
    const updatedProps = {
      likes: 20
    }
    await api.put(`/api/blogs/${updatedBlogId}`)
      .send(updatedProps)
    const blogsAtEnd = await hf.blogsInDb()
    expect(blogsAtEnd.map(b => b.likes)).toContain(updatedProps.likes)
  })
})