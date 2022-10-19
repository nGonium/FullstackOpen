import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

const WeatherData = ({ weather }) => {
  return (
    <>
      <p>temperature {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`weathher for ${''}`} />
      <p>wind {weather.wind.speed} m/s</p>
    </>
  )
}

const DetailedCountry = ({ country }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {  
    console.warn('Called openweather API')
    const [lat, lon] = country.latlng
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
    .then(res => setWeather(res.data))
  }, [country])

  return (
    <>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>lanuages: </h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <h2>Weather in {country.capital}</h2>
      {Object.keys(weather).length === 0 
      ? <p>Loading weather data...</p>
      : <WeatherData weather={weather} />}
    </>
  )
}

export default DetailedCountry