const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
  console.log(
    `Please provide the password as an argument: \n`,
    `node mongo.js <password> OR \n`, 
    `node mongo.js <password> <name> <number>`)
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster0.bwgo4qm.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then(() => {
    if (process.argv.length === 5) {
      return new Person({ 
        name: process.argv[3], 
        number: Number(process.argv[4]),
      }).save()
    } 

    if (process.argv.length === 3) {
      Person
        .find({})
        .then(res => 
          res.forEach(p => console.log(p)))
        .then(() => mongoose.connection.close())
    }
  })
  .then(() => mongoose.connection.close())
  .catch(err => console.log(err))