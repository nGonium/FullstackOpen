const Persons = ({persons, searchName, removePerson}) => {
  const personsToDisplay = persons.filter(p => p.name.toUpperCase().indexOf(searchName.toUpperCase()) !== -1)
  
  const handleClick = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
       removePerson(id, name)
    }
  }

  return personsToDisplay.map(({name, number, id}) => 
    <p key={id}>{name} {number} <button onClick={() => handleClick(id, name)}>delete</button></p>)
}

export default Persons