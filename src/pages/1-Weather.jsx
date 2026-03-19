import { useState, useEffect } from "react";

// API endpoint — Mississauga coordinates, returns current weather
// https://api.open-meteo.com/v1/forecast?latitude=43.5890&longitude=-79.6441&current_weather=true
//
// Useful fields in response.current_weather:
//   temperature    — current temp in °C
//   windspeed      — wind speed in km/h
//   weathercode    — WMO code (0 = clear sky, 61 = rain, etc.)

const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=43.5890&longitude=-79.6441&current_weather=true";

export default function WeatherOnMount() {
  // 1. Declare state variables for weather data, loading, and error
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Write a useEffect that runs once when the component mounts
  //    - Use an empty dependency array []
  //    - Define an async function inside the effect
  //    - Fetch from API_URL
  //    URL: https://api.open-meteo.com/v1/forecast?latitude=43.5890&longitude=-79.6441&current_weather=true
  //    - Use try / catch / finally
  //    - Check response.ok before parsing JSON
  //    - Set weather, error, and loading state accordingly


  // 3. Handle the loading state
  //    For now render a plain text message
  //    TODO later: replace with MUI CircularProgress
  if (loading) return <p>Loading weather...</p>;

  // 4. Handle the error state
  if (error) return <p>Error: {error}</p>;

  // 5. Render the weather data
  //    Display at minimum: temperature, windspeed, weathercode
  return (
    <div>
      <h2>Current Weather — Mississauga</h2>

      {/* TODO: display weather.temperature */}
      {/* TODO: display weather.windspeed */}
      {/* TODO: display weather.weathercode */}
    </div>
  );
}