const Persons = ({persons, searchName}) => 
  persons.filter(p => p.name.toUpperCase().indexOf(searchName.toUpperCase()) !== -1)
  .map(({name, number, id}) => <p key={id}>{name} {number}</p>)

export default Persons