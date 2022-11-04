const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const api = request(app)
const User = require('../models/User')

const initialUsers = [
  {
    username: "User 1",
    password: "foofoo",
    name: "Person A"
  },
  {
    username: "User 2",
    password: "foobuzz",
    name: "Person B"
  },
  {
    username: "User 3",
    password: "foobar",
    name: "Person C"
  },
]

const getNewUser = () => {
  return {
    username: "SuccessfulUser",
    password: "ValidPassword",
    name: "Successful User"
  }
}

beforeEach(async () => {
  await User.collection.drop()
  await User.insertMany(initialUsers)
})

afterAll(() => {
  mongoose.connection.close()
})

describe('create user', () => {
  describe('success', () => {
    it('succeeds with 201 Created and JSON', () => {
      api.post('/api/users').send(getNewUser())
        .expect(201).expect('Content-Type', /json/)
    })

    it('found in db', async () => {
      const newUser = getNewUser()
      await api.post('/api/users').send(newUser)
      const foundUser = await User.findOne({ username: newUser.username})
      expect(Boolean(foundUser)).toBe(true)
    })
  })

  describe('invalid', () => {
    it('short password results in 400 with appropriate message', () => {
      const newUser = getNewUser()
      newUser.password = '123'
      api.post('/api/users').send(newUser)
        .expect(400, { error: /password too short/i })
    })

    it('not found in db', async () => {
      const newUser = getNewUser()
      newUser.password = '123'
      api.post('/api/users').send(newUser)
      const foundUser = await User.findOne({ username: newUser.username})
      expect(foundUser).toBe(null)
    })
  })
})


