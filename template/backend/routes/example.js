const exampleRouter = require('express').Router()
const { getExample, postExample, updExample, delExample } = require('../controllers/example')

exampleRouter.get('/', getExample)
exampleRouter.post('/', postExample)
exampleRouter.update('/:id', updExample)
exampleRouter.delete('/:id', delExample)