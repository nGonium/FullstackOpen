import { useState, useEffect } from 'react'
import personsService from './services/personsService'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    personsService.getAll()
    .then(data => setPersons(data))
    .catch(res => console.error(`Could not load data`, res))
  }, [])

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
        setPersons={setPersons}
        searchName={searchName} />
    </div>
  )
}

export default App
