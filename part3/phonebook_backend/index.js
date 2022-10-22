require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

// Set use
// Enable cors
const cors = require('cors')
app.use(cors())
// Serve frontend static content
app.use(express.static('build'))
// Set request.body using json
app.use(express.json())
// Log to console with morgan
morgan.token('data', (req, res) => {
  return req.route?.methods.post ? 
    JSON.stringify(req.body) : ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// HTTP operations
// GET
const api = '/api/persons'
app.get(api, (req, res) => {
  Person
    .find({})
    .then(persons => 
      res.json(persons).end())
    .catch(err => console.log(err))
})

app.get(`${api}/:id`, (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      person 
      ? res.json(person) 
      : next() /*res.status(404).send({ error: 'unknown endpoint' })*/
    })
    .catch(err => next(err))
})

app.get('/info', (req, res, err) => {
  Person
    .countDocuments({})
    .then(count => {
      const date = new Date()
      res.send(
        `<p>Phonebook has info for ${count} people</p>\n`+
        `<p>${date.toDateString()} ${date.toTimeString()}</p>`
        )
      }
    )
    .catch(err => next(err))
  }
)

// DELETE
app.delete(`${api}/:id`, (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

// POST
app.post(`${api}`, (req, res, next) => {
  const { name, number } = req.body
  Person
    .findOne({ name: name })
    .then(foundPerson => {
      if (foundPerson !== null) {
        return res.status(400).send({ error: 'Name is not unique. Attempted POST, use PUT instead if updating number.' })
      }
      const person = new Person({
        name,
        number,
      })
      person
        .save()
        .then(savedPerson => res.json(savedPerson))
        .catch(err => next(err))  
    })
    .catch(err => next(err)) 
})

// PUT
app.put(`${api}/:id`, (req, res, next) => {
  const { name, number } = req.body
  Person
    .findByIdAndUpdate(
      req.params.id, 
      { name: name, number: number }, 
      { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

// Error handling middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

// Configure server
const PORT = process.env.PORT
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`))