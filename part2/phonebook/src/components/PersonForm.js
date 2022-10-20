const PersonForm = ({newName, setNewName, newNumber, setNewNumber, handleSubmit}) => {
  const handleNewName = (e) => setNewName(e.target.value)
  const handleNewNumber = (e) => setNewNumber(e.target.value)

  return (
    <form onSubmit={handleSubmit}>
      <p>name: <input value={newName} onChange={handleNewName} /></p>
      <div>number: <input value={newNumber} onChange={handleNewNumber} /></div>
      <button type="submit">Add</button>
    </form>
  )
}

export default PersonForm