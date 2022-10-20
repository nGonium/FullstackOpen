const PersonForm = ({newName, setNewName, newNumber, setNewNumber, addPerson}) => {
  const handleNewName = (e) => setNewName(e.target.value)
  const handleNewNumber = (e) => setNewNumber(e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()
    addPerson()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>name: <input value={newName} onChange={handleNewName} required /></p>
      <div>number: <input value={newNumber} onChange={handleNewNumber} required /></div>
      <button type="submit">Add</button>
    </form>
  )
}

export default PersonForm