import { useState, useEffect } from 'react'
import personsService from './services/personsService'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState({text: 'Testing error', type: 'error'})

  useEffect(() => {
    personsService
      .getAll()
      .then(data => setPersons(data))
      .catch(res => console.error(`Could not load data`, res))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} setNotification={setNotification} />
      <Filter 
        searchName={searchName} 
        setSearchName={setSearchName} />
      <h3>Add a new</h3>
      <PersonForm 
        persons={persons} setPersons={setPersons} 
        newName={newName} setNewName={setNewName} 
        newNumber={newNumber} setNewNumber={setNewNumber} 
        setNotification={setNotification} />
      <h3>Number</h3>
      <Persons 
        persons={persons} 
        setPersons={setPersons}
        searchName={searchName} 
        setNotification={setNotification} />
    </div>
  )
}

export default App
