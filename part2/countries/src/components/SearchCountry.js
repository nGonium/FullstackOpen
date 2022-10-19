const SearchCountry = ({ searchCountry, setSearchCountry }) => {
  const handleSearch = (e) => setSearchCountry(e.target.value)

  return <p>find countries <input value={searchCountry} onChange={handleSearch} /></p>
}

export default SearchCountry