import personsService from "../services/personsService"

const Persons = ({persons, setPersons, searchName, setNotification}) => {
  const personsToDisplay = persons.filter(p => p.name.toUpperCase().indexOf(searchName.toUpperCase()) !== -1)
  const removePerson = (id, name) => {
    personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ text: `Removed ${name}`, type: 'success' })
        })
        .catch(res => setNotification({ text: `Information of ${name} has already been removed from server`, type: 'error' })) 
  }
  const handleClick = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
       removePerson(id, name)
    }
  }

  return personsToDisplay.map(({name, number, id}) => 
    <p key={id}>{name} {number} <button onClick={() => handleClick(id, name)}>delete</button></p>)
}

export default Persons