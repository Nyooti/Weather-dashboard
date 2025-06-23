import React, { useState } from 'react';

const KENYAN_CITIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Malindi',
  'Kitale',
  'Garissa',
  'Kakamega',
];

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  const handleDropdownChange = (e) => {
    setCity(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        list="kenyan-cities"
      />
      <datalist id="kenyan-cities">
        {KENYAN_CITIES.map((cityName) => (
          <option value={cityName} key={cityName} />
        ))}
      </datalist>
      <button type="submit">Search</button>
      <select onChange={handleDropdownChange} defaultValue="">
        <option value="" disabled>
          Or select a Kenyan city
        </option>
        {KENYAN_CITIES.map((cityName) => (
          <option value={cityName} key={cityName}>
            {cityName}
          </option>
        ))}
      </select>
    </form>
  );
}

export default SearchBar; 