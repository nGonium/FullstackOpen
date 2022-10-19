import { useState, useEffect } from 'react'
import axios from 'axios'

import SearchCountry from './components/SearchCountry'
import ListCountries from './components/ListCountries'
import DetailedCountry from './components/DetailedCountry'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')

  const shownCountries = countries.filter(country => 
      country.name.common.toUpperCase().includes(searchCountry.toUpperCase()))

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(res => setCountries(res.data))
  }, [])

  return (
    <div>
      <SearchCountry searchCountry={searchCountry} setSearchCountry={setSearchCountry} />
      {shownCountries.length === 1 
      ? <DetailedCountry country={shownCountries[0]} /> 
      : shownCountries.length < 1 
      ? <p>No countries found</p>
      : shownCountries.length < 10 
      ? <ListCountries countries={shownCountries} setSearchCountry={setSearchCountry} />
      : <p>Too many matches, specify another filter</p>}
    </div>
  )
}

export default App;
