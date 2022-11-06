const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const hf = require('./db')
const Blog = require('../models/blog')
const User = require('../models/User')


const api = request(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(hf.initialBlogs)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('get blogs', () => {
  it('succeeds with 200 and JSON content type', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /json/)
  })

  it('returns correct amount of JSON objects', async () => {
    await api.get('/api/blogs')
      .expect(res => res.body.length === hf.initialBlogs.length)
  })

  it('all have a unique id', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(b => expect(b).toBeDefined())
  })  
})

describe.only('create blog', () => {
  describe('valid token bearing user with blogposts', () => {
    let authorization
    beforeEach(async () => {
      const id = await hf.existingUserId('password')
      const user = await User.findById(id)
      const token = hf.getToken(user)
      authorization = `bearer ${token}`
    })
    describe('with complete fields', () => {
      const newBlog = {
        title: 'New Post',
        author: 'Veritas',
        url: 'http://www.test.com',
        likes: 0,
      } 
      it('succeeds with 201 Created', async () => {
        await api.post('/api/blogs')
          .set('Authorization', authorization)
          .send(newBlog)
          .expect(201)
      })

      it('blog is added to db', async () => {
        await api.post('/api/blogs')
          .set('Authorization', authorization)
          .send(newBlog)
        expect((await hf.blogsInDb()).length).toBe(hf.initialBlogs.length + 1)
      })

      it("returned blog title matches", async () => {
        const res = await api.post('/api/blogs')
          .set('Authorization', authorization)
          .send(newBlog)
          .expect('Content-Type', /json/)
        expect(newBlog.title).toEqual(res.body.title)
      })
    })

    describe('with missing field', () => {
      it('likes defaults to 0', async () => {
        await api.post('/api/blogs')
        .set('Authorization', authorization)
        .send({
            title: 'New Post',
            author: 'Veritas',
            url: 'http://www.test.com',
          })
          .expect(res => res.body.likes === 0)
      })
      
      it('title returns 400', async () => {
        await api.post('/api/blogs')
          .set('Authorization', authorization)
          .send({
            author: 'Veritas',
            url: 'http://www.test.com',
            likes: 0,
          })
          .expect(400)
      })
      
      it('url returns 400', async () => {
        await api.post('/api/blogs')
          .set('Authorization', authorization)
          .send({
            title: 'New Post',
            author: 'Veritas',
            likes: 0,
          })
          .expect(400)
      })
    })
  })

  describe('unauthorized user', () => {
    it('when authorization fields is missing fails with 400', async () => {
      await api.post('/api/blogs')
        .send({
          title: 'New Post',
          author: 'Veritas',
          url: 'http://www.test.com',
          likes: 0,
        })
        .expect(401)
    })
  })
})


// -----------

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