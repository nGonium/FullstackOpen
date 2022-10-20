import personsService from "../services/personsService"

const Persons = ({persons, setPersons, searchName}) => {
  const personsToDisplay = persons.filter(p => p.name.toUpperCase().indexOf(searchName.toUpperCase()) !== -1)
  const handleClick = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personsService
        .remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
        .catch(res => console.error(res))  
    }
  }
  return personsToDisplay.map(({name, number, id}) => 
    <p key={id}>{name} {number} <button onClick={() => handleClick(id, name)}>delete</button></p>)
}

export default Persons