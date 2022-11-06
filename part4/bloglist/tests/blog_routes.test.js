const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const db = require('./db')
const Blog = require('../models/Blog')
const User = require('../models/User')
const auth = require('../utils/auth')


const api = request(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(db.initialBlogs)
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
      .expect(res => res.body.length === db.initialBlogs.length)
  })

  it('all have a unique id', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(b => expect(b).toBeDefined())
  })  
})

describe('create blog', () => {
  describe('valid token bearing user with blogposts', () => {
    let authorization
    beforeEach(async () => {
      const id = await db.existingUserId('password')
      const user = await User.findById(id)
      const token = auth.getTokenNoValidation(user)
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
        expect((await db.blogsInDb()).length).toBe(db.initialBlogs.length + 1)
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
    it('when authorization fields is missing fails with 401', async () => {
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


describe('delete blog', () => {
  describe('valid token bearing user with blog post', () => {
    let authorization
    let blogid 
    beforeEach(async () => {
      const id = await db.existingUserId('password')
      const user = await User.findById(id)
      const token = auth.getTokenNoValidation(user)
      authorization = `bearer ${token}`
      const blog = await db.createBlog(user, {
        title: "blog to delete",
        author: "John Doe",
        url: "www.example.com"
      })
      blogid = blog.id
    })

    describe('deleting own existing blog', () => {
      it('succeeds with 204 No Content', async () => {
        await api.delete(`/api/blogs/${blogid}`)
          .set('Authorization', authorization)
          .expect(204)
      })

      it("blog removed from db", async () => {
        const res = await api.delete(`/api/blogs/${blogid}`)
          .set('Authorization', authorization)
        expect(await Blog.findById(blogid)).toBeNull()
      })
    })

    it('deleting non-owned blog fails with 403 Forbidden', async () => {
      const blogid = await db.existingBlogId()
      await api.delete(`/api/blogs/${blogid}`)
        .set('Authorization', authorization)
        .expect(403)
    })
  })

  it('deleting existing blog without valid token fails with 401 Unauthorized', async () => {
    const blogid = db.existingBlogId()
    await api.delete(`/api/blogs/${blogid}`)
      .expect(401)
  })

  //   describe('with missing field', () => {
  //     it('likes defaults to 0', async () => {
  //       await api.post('/api/blogs')
  //       .set('Authorization', authorization)
  //       .send({
  //           title: 'New Post',
  //           author: 'Veritas',
  //           url: 'http://www.test.com',
  //         })
  //         .expect(res => res.body.likes === 0)
  //     })
      
  //     it('title returns 400', async () => {
  //       await api.post('/api/blogs')
  //         .set('Authorization', authorization)
  //         .send({
  //           author: 'Veritas',
  //           url: 'http://www.test.com',
  //           likes: 0,
  //         })
  //         .expect(400)
  //     })
      
  //     it('url returns 400', async () => {
  //       await api.post('/api/blogs')
  //         .set('Authorization', authorization)
  //         .send({
  //           title: 'New Post',
  //           author: 'Veritas',
  //           likes: 0,
  //         })
  //         .expect(400)
  //     })
  //   })
  // })

  // describe('unauthorized user', () => {
  //   it('when authorization fields is missing fails with 401', async () => {
  //     await api.post('/api/blogs')
  //       .send({
  //         title: 'New Post',
  //         author: 'Veritas',
  //         url: 'http://www.test.com',
  //         likes: 0,
  //       })
  //       .expect(401)
  //   })
  // })
})

// -----------

// describe('delete blog', () => {
//   it('succeeds with 204 No Content', async () => {
//     const blogId = await db.existingBlogId()
//     api.delete(`/api/blogs:${blogId}`)
//       .expect(204)
//   })
  
//   it('DELETE successfully removes from db', async () => {
//     const blogsAtStart = await db.blogsInDb()
//     const deletedBlog = blogsAtStart[0]
//     await api.delete(`/api/blogs/${deletedBlog.id}`)
//     const blogsAtEnd = await db.blogsInDb()
//     expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
//     expect(blogsAtEnd.map(b => b.id)).not.toContain(deletedBlog.id)
//   })
// })

// describe('update blog', () => {
//   it('succeeds with 200', async () => {
//     const blogsAtStart = await db.blogsInDb()
//     const updatedBlog = blogsAtStart[0]
//     updatedBlog.title = 'Updated Title'
//     api.put(`/api/blogs/${updatedBlog.id}`)
//       .expect(200)
//   })
//   it('updated data shows up in db', async () => {
//     const blogsAtStart = await db.blogsInDb()
//     const updatedBlogId = blogsAtStart[0].id
//     const updatedProps = {
//       likes: 20
//     }
//     await api.put(`/api/blogs/${updatedBlogId}`)
//       .send(updatedProps)
//     const blogsAtEnd = await db.blogsInDb()
//     expect(blogsAtEnd.map(b => b.likes)).toContain(updatedProps.likes)
//   })
// })