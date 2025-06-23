import React from 'react';
import MapView from './MapView';

const AQI_LEVELS = [
  '',
  'Good',
  'Fair',
  'Moderate',
  'Poor',
  'Very Poor',
];

function CurrentWeather({ weather, unit, onFavorite, isFavorite, alerts, aqi }) {
  if (!weather) return <div><h2>Current Weather</h2><p>No data</p></div>;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  return (
    <div className="weather-card" style={{ marginBottom: '2rem', border: '1px solid #eee', borderRadius: 8, padding: 16, maxWidth: 400, margin: '0 auto', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Current Weather</h2>
        <button onClick={onFavorite} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <h3>{weather.city}, {weather.country}</h3>
      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} />
      <p style={{ fontSize: 24, margin: 0 }}>{weather.temp}{unitSymbol}</p>
      <p style={{ textTransform: 'capitalize' }}>{weather.description}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind: {weather.wind} {unit === 'metric' ? 'm/s' : 'mph'}</p>
      {aqi && (
        <div style={{ margin: '1rem 0', padding: '0.5rem 1rem', background: '#e3f2fd', borderRadius: 6, color: '#1565c0', fontWeight: 600 }}>
          Air Quality Index: {aqi} ({AQI_LEVELS[aqi]})
        </div>
      )}
      {alerts && alerts.length > 0 && (
        <div style={{ margin: '1rem 0', padding: '0.5rem 1rem', background: '#fff3cd', borderRadius: 6, color: '#856404', fontWeight: 600 }}>
          <div style={{ marginBottom: 4 }}>⚠️ Weather Alert:</div>
          {alerts.map((alert, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div><strong>{alert.event}</strong></div>
              <div style={{ fontSize: 13 }}>{alert.description}</div>
            </div>
          ))}
        </div>
      )}
      {weather.coord && <MapView lat={weather.coord.lat} lon={weather.coord.lon} city={weather.city} />}
    </div>
  );
}

export default CurrentWeather; 