require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

// Set use
// Enable cors
app.use(cors());
// Serve frontend static content
app.use(express.static('build'));
// Set request.body using json
app.use(express.json());
// Log to console with morgan
morgan.token('data', (req) => (req.route?.methods.post
  ? JSON.stringify(req.body) : ' '));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

// HTTP operations
// Get all
const api = '/api/persons';
app.get(api, (req, res) => {
  Person
    .find({})
    .then((persons) => res.json(persons).end())
    .catch((err) => console.log(err));
});
// Get unique
app.get(`${api}/:id`, (req, res, next) => {
  Person
    .findById(req.params.id)
    .then((person) => {
      if (person !== null) res.json(person);
    })
    .catch((err) => next(err));
});
// List info
app.get('/info', (req, res, next) => {
  Person
    .countDocuments({})
    .then((count) => {
      const date = new Date();
      res.send(
        `<p>Phonebook has info for ${count} people</p>\n`
        + `<p>${date.toDateString()} ${date.toTimeString()}</p>`,
      );
    })
    .catch((err) => next(err));
});

// DELETE
app.delete(`${api}/:id`, (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

// POST
app.post(`${api}`, (req, res, next) => {
  const { name, number } = req.body;
  Person
    .findOne({ name })
    .then((foundPerson) => {
      // Check duplicate
      if (foundPerson !== null) {
        const err = new Error('Name is not unique. Attempted POST, use PUT instead if updating number.');
        err.name = 'InvalidRequest';
        throw err;
      }

      const person = new Person({
        name,
        number,
      });
      person
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// PUT
app.put(`${api}/:id`, (req, res, next) => {
  const { name, number } = req.body;
  Person
    .findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' },
    )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

// Error handling middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name === 'InvalidRequest') {
    response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(unknownEndpoint);
app.use(errorHandler);

// Configure server
const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
