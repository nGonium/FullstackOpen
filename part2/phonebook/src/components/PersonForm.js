import personsService from "../services/personsService"

const PersonForm = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber}) => {
  const handleNewName = (e) => setNewName(e.target.value)
  const handleNewNumber = (e) => setNewNumber(e.target.value)

  const updatePerson = (id, person) => {
    personsService.update(id, person)
    .then(newPerson => setPersons(persons.map(p => p.id === id ? newPerson : p)))
    .catch(res => console.error(res))
  }

  const addPerson = (e) => {
    e.preventDefault()
    const existingPerson = persons.filter(p => p.name === newName)[0]
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson(existingPerson.id, { ...existingPerson, number: newNumber })
      }
      return
    }

    personsService.create({ 
      name: newName, 
      number: newNumber, 
    }).then(newPerson => setPersons(persons.concat(newPerson)))
    .catch(res => console.error(res))
  }

  return (
    <form onSubmit={addPerson}>
      <p>name: <input value={newName} onChange={handleNewName} /></p>
      <div>number: <input value={newNumber} onChange={handleNewNumber} /></div>
      <button type="submit">Add</button>
    </form>
  )
}

export default PersonForm