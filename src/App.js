import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import HourlyForecast from './HourlyForecast';

const API_KEY = '3a30978a4a4572f0d925';

function getWeatherBg(weather) {
  if (!weather) return 'bg-default';
  const desc = weather.description.toLowerCase();
  if (desc.includes('rain')) return 'bg-rain';
  if (desc.includes('cloud')) return 'bg-cloud';
  if (desc.includes('clear')) return 'bg-clear';
  if (desc.includes('thunder')) return 'bg-thunder';
  if (desc.includes('snow')) return 'bg-snow';
  return 'bg-default';
}

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('metric'); // 'metric' for °C, 'imperial' for °F
  const [recent, setRecent] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    // On mount, check URL for city or lat/lon
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city');
    const lat = params.get('lat');
    const lon = params.get('lon');
    if (lat && lon) {
      handleSearch(null, { lat, lon });
    } else if (city) {
      handleSearch(city);
    }
    // eslint-disable-next-line
  }, [unit]);

  const updateUrl = (city, coords) => {
    let url = window.location.pathname + '?';
    if (coords && coords.lat && coords.lon) {
      url += `lat=${coords.lat}&lon=${coords.lon}`;
    } else if (city) {
      url += `city=${encodeURIComponent(city)}`;
    }
    window.history.replaceState({}, '', url);
  };

  const handleSearch = async (city, coords) => {
    updateUrl(city, coords);
    setError('');
    setWeather(null);
    setForecast([]);
    setHourly([]);
    setAlerts([]);
    setAqi(null);
    setLoading(true);
    try {
      let weatherUrl, forecastUrl, oneCallUrl, aqiUrl, lat, lon;
      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
      } else {
        const cityQuery = city.match(/,/) ? city : `${city},KE`;
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&appid=${API_KEY}&units=${unit}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityQuery)}&appid=${API_KEY}&units=${unit}`;
      }
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error('City not found');
      const weatherData = await weatherRes.json();
      lat = lat || weatherData.coord.lat;
      lon = lon || weatherData.coord.lon;
      setWeather({
        temp: weatherData.main.temp,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        city: weatherData.name,
        country: weatherData.sys.country,
        humidity: weatherData.main.humidity,
        wind: weatherData.wind.speed,
        coord: weatherData.coord,
        id: weatherData.id,
      });
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error('Forecast not found');
      const forecastData = await forecastRes.json();
      // 5-day forecast
      const daily = {};
      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!daily[date] && item.dt_txt.includes('12:00:00')) {
          daily[date] = {
            date,
            temp: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            wind: item.wind.speed,
          };
        }
      });
      setForecast(Object.values(daily).slice(0, 5));
      // Hourly forecast (next 24 hours)
      setHourly(forecastData.list.slice(0, 8).map(item => ({
        time: item.dt_txt.split(' ')[1].slice(0,5),
        temp: item.main.temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        wind: item.wind.speed,
      })));
      // Weather alerts (One Call API)
      oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
      const oneCallRes = await fetch(oneCallUrl);
      if (oneCallRes.ok) {
        const oneCallData = await oneCallRes.json();
        setAlerts(oneCallData.alerts || []);
      }
      // AQI
      aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const aqiRes = await fetch(aqiUrl);
      if (aqiRes.ok) {
        const aqiData = await aqiRes.json();
        if (aqiData.list && aqiData.list.length > 0) {
          setAqi(aqiData.list[0].main.aqi);
        }
      }
      if (!coords && city) {
        setRecent((prev) => {
          const updated = [city, ...prev.filter((c) => c !== city)];
          return updated.slice(0, 5);
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitToggle = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const handleRecentClick = (city) => {
    handleSearch(city);
  };

  const handleDarkMode = () => {
    setDarkMode((d) => !d);
  };

  const handleFavorite = () => {
    if (!weather) return;
    setFavorites((prev) => {
      if (prev.find((fav) => fav.id === weather.id)) {
        return prev.filter((fav) => fav.id !== weather.id);
      } else {
        return [{ id: weather.id, city: weather.city, country: weather.country }, ...prev].slice(0, 10);
      }
    });
  };

  const handleFavoriteClick = (fav) => {
    handleSearch(`${fav.city},${fav.country}`);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSearch(null, { lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setError('Unable to get location');
        setLoading(false);
      }
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const bgClass = `${darkMode ? 'dark' : ''} ${getWeatherBg(weather)}`;

  return (
    <div className={`App ${bgClass}`} style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Weather Dashboard</h1>
        <button onClick={handleDarkMode}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
      </div>
      <button onClick={handleUnitToggle} style={{ marginBottom: '1rem' }}>
        Switch to {unit === 'metric' ? '°F' : '°C'}
      </button>
      <button onClick={handleGeolocate} style={{ marginBottom: '1rem', marginLeft: 8 }}>
        📍 Use My Location
      </button>
      <button onClick={handleShare} style={{ marginBottom: '1rem', marginLeft: 8 }}>
        🔗 Share
      </button>
      <SearchBar onSearch={handleSearch} />
      {favorites.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Favorites:</strong>
          {favorites.map((fav) => (
            <button key={fav.id} onClick={() => handleFavoriteClick(fav)} style={{ marginLeft: 8 }}>
              {fav.city}
            </button>
          ))}
        </div>
      )}
      {recent.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Recent:</strong>
          {recent.map((city) => (
            <button key={city} onClick={() => handleRecentClick(city)} style={{ marginLeft: 8 }}>
              {city}
            </button>
          ))}
        </div>
      )}
      {loading && <div className="spinner">Loading...</div>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <CurrentWeather weather={weather} unit={unit} onFavorite={handleFavorite} isFavorite={!!weather && favorites.find((fav) => fav.id === weather.id)} alerts={alerts} aqi={aqi} />
      <Forecast forecast={forecast} unit={unit} />
      <HourlyForecast hourly={hourly} unit={unit} />
    </div>
  );
}

export default App;
