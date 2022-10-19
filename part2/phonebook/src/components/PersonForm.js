const PersonForm = ({persons, setPersons, newName, setNewName, newNumber, setNewNumber}) => {
  const handleNewName = (e) => setNewName(e.target.value)
  const handleNewNumber = (e) => setNewNumber(e.target.value)

  const addPerson = (e) => {
      console.log(e.target);
      e.preventDefault()
      if (persons.map(p => p.name).includes(newName)) {
        alert(`${newName} is already added to phonebook`)
        return
      }
      setPersons(persons.concat(
        {
          id: persons.length + 1, 
          name: newName, 
          number: newNumber,
        }))
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