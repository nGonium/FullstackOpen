import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
        searchName={searchName} 
        setSearchName={setSearchName} />
      <h3>Add a new</h3>
      <PersonForm 
        persons={persons} setPersons={setPersons} 
        newName={newName} setNewName={setNewName} 
        newNumber={newNumber} setNewNumber={setNewNumber} />
      <h3>Number</h3>
      <Persons 
        persons={persons} 
        searchName={searchName} />
    </div>
  )
}

export default App
