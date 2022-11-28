const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Note = require('./models/note');
const mongoose = require('mongoose');
const app = express();

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-1-17T17:30:31.098Z',
    important: false,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2022-1-17T18:39:34.091Z',
    important: true,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-1-17T19:20:14.298Z',
    important: false,
  },
  {
    content: 'hello',
    date: '2022-11-25T19:21:01.487Z',
    important: false,
    id: 4,
  },
  {
    content: 'joey',
    date: '2022-11-26T09:49:44.395Z',
    important: true,
    id: 5,
  },
];

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

// cors() allows all requests, use below to enable only frontend CO requests
app.use(cors({ origin: 'http://localhost:5173' }));
// app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: 'malformatted id' });
    });
});

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
