const ListCountries = ({ countries, setSearchCountry }) => {
  const handleClick = (name) => setSearchCountry(name)

  return countries.map(country => 
  <p key={country.name.common}>
    {`${country.name.common} `} 
    <button onClick={() => handleClick(country.name.common)}>show</button>
  </p>)
}

export default ListCountries