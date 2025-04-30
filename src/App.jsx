/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  const [weatherData, setWeatherData] = useState(null)
  const [city, setCity] = useState("agartala");
  const [forecast, setForecast] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchWeatherData = async (cityName) => {
    setCity(cityName)
    //fetch weather
    try {
      setError(null)
      setLoading(true)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`

      const response = await fetch(url)
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError("Could not fetch data please try again");
    }
    finally {
      setLoading(false)
    }


    // fetch forecast
    try {
      setError(null)
      setLoading(true)
      const foreCastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`
      )
      const forecastdata = await foreCastResponse.json()
      const dailyForecast = forecastdata.list.filter((item, index) => index % 8 === 0)
      setForecast(dailyForecast)
      console.log(dailyForecast);
    } catch (err) {
      setError("Could not fetch data please try again");
    }
    finally {
      setLoading(false)
    }

  }

  function handleSearch(e) {
    e.preventDefault()
    fetchWeatherData(searchInput)
  }
  function fToC(f) {
    return Math.floor((f - 32) * 5 / 9)
  }

  useEffect(() => {
    fetchWeatherData(city)
  }, [city]);
  if (loading) return <div className='wrapper'>Loading...</div>
  return (
    <>

      <div onSubmit={handleSearch} className='wrapper'>
        <form className="search-form">
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Enter city name'
            className='search-input'
          />
          <button type="submit" className='search-button'>Search</button>
        </form>
        {error && (<p>{error}</p>)}
        {weatherData && weatherData.main && weatherData.weather && (
          <div className="header">
            <h1 className="city">{weatherData.name}</h1>
            <p className="temperature">{fToC(weatherData.main.temp)}°C</p>
            <p className="condition">{weatherData.weather[0].main}</p>

            <div className="weather-details">
              <div>
                <p>Humidity</p>
                <p>{weatherData.main.humidity}</p>
              </div>
              <div>
                <p>Wind Speed</p>
                <p>{weatherData.wind.speed} mph</p>
              </div>
            </div>
          </div>)}
        {!error && forecast.length > 0 && (
          <div className="forecast">
            <h2 className="forecast-header">5 day forecast</h2>
            <div className="forecast-days">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt * 1000).toLocaleDateString("en-IN", {
                    weekday: "short",
                  })}</p>
                  <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt={day.weather[0].
                    description} />
                  <p>{fToC(day.main.temp)}°C</p>
                </div>
              ))}

            </div>
          </div>
        )}
      </div>

    </>
  )
}

export default App
