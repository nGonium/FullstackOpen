const express = require('express')
const morgan = require('morgan')

const app = express()

// Set use
app.use(express.json())
// app.use(morgan('tiny'))
morgan.token('data', (req, res) => {
  return req.route.methods.post ? 
    JSON.stringify(req.body) : ' '
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// Data
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  },
  {
    "id": 5,
    "name": "test"
  }
]

// HTTP operations
const api = '/api/persons'
app.get(api, (req, res) => {
  res.json(persons)
})

app.get(`${api}/:id`, (req, res) => {
  const id = Number(req.params.id)
  const result = persons.find(p => p.id === id)
  if (result) {
    res.json(result)
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>\n`+
    `<p>${date.toDateString()} ${date.toTimeString()}</p>`
  )
})

app.delete(`${api}/:id`, (req, res) => {
  const id = Number(req.params.id)
  const prevLength = persons.length
  persons = persons.filter(p => p.id !== id)
  res.status(persons.length !== prevLength ? 204 : 404).end()
})

app.post(`${api}`, (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'missing content (name/number)'
    })
  }
  if (persons.find(p => p.name === req.body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  const newPerson = { ...req.body, id: id }
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

// Configure server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})