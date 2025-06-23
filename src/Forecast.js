import React from 'react';

function Forecast({ forecast, unit }) {
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>5-Day Forecast</h2>
      {forecast && forecast.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {forecast.map((day, idx) => (
            <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, minWidth: 120, textAlign: 'center' }}>
              <div>{day.date}</div>
              <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} />
              <div style={{ fontSize: 18 }}>{day.temp}{unitSymbol}</div>
              <div style={{ textTransform: 'capitalize' }}>{day.description}</div>
              <div>Humidity: {day.humidity}%</div>
              <div>Wind: {day.wind} {unit === 'metric' ? 'm/s' : 'mph'}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No forecast data</p>
      )}
    </div>
  );
}

export default Forecast; 