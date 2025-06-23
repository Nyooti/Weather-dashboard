import React from 'react';

function HourlyForecast({ hourly, unit }) {
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  if (!hourly || hourly.length === 0) return null;
  return (
    <div style={{ maxWidth: 700, margin: '2rem auto 0', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Next 24 Hours</h2>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 12 }}>
        {hourly.map((h, idx) => (
          <div key={idx} style={{ minWidth: 80, textAlign: 'center', borderRight: idx !== hourly.length-1 ? '1px solid #eee' : 'none', padding: '0 8px' }}>
            <div>{h.time}</div>
            <img src={`https://openweathermap.org/img/wn/${h.icon}.png`} alt={h.description} />
            <div style={{ fontWeight: 600 }}>{h.temp}{unitSymbol}</div>
            <div style={{ fontSize: 12, textTransform: 'capitalize' }}>{h.description}</div>
            <div style={{ fontSize: 11 }}>💧{h.humidity}%</div>
            <div style={{ fontSize: 11 }}>💨{h.wind} {unit === 'metric' ? 'm/s' : 'mph'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast; 