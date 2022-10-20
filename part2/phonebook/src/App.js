import { useState, useEffect } from 'react'
import personsService from './services/personsService'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  // States
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState({text: 'Testing error', type: 'error'})

  // Persons functions
  const updatePerson = (id, person) => {
    personsService.update(id, person)
    .then(newPerson => {
      setPersons(persons.map(p => p.id === id ? newPerson : p))
      setNotification({ text: `Updated number of ${newPerson.name}`, type: 'success' })
    })
    .catch(() => 
      setNotification({ text: `Failed to update number of person`, type: 'error' }))
  }

  const addPerson = () => {
    const existingPerson = persons.filter(p => p.name === newName)[0]
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`))
        updatePerson(existingPerson.id, { ...existingPerson, number: newNumber })
      return
    }

    personsService.create({ 
      name: newName, 
      number: newNumber, 
    }).then(newPerson => {
      setPersons(persons.concat(newPerson))
      setNotification({ text: `Added ${newPerson.name}`, type: 'success' })
    })
    .catch(() => 
      setNotification({ text: `Failed to add ${newName}`, type: 'error' }))
  }

  const removePerson = (id, name) => {
    personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ text: `Removed ${name}`, type: 'success' })
        })
        .catch(() => 
          setNotification({ text: `Information of ${name} has already been removed from server`, type: 'error' })) 
  }

  // UseEffects
  useEffect(() => {
    personsService
      .getAll()
      .then(data => setPersons(data))
      .catch(res => console.error(`Could not load data`, res))
  }, [])

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault()
    addPerson()
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} setNotification={setNotification} />
      <Filter 
        searchName={searchName} 
        setSearchName={setSearchName} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName} setNewName={setNewName} 
        newNumber={newNumber} setNewNumber={setNewNumber} 
        handleSubmit={handleSubmit} />
      <h3>Number</h3>
      <Persons 
        persons={persons} 
        searchName={searchName} 
        removePerson={removePerson} />
    </div>
  )
}

export default App
