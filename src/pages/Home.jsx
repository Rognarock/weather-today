import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import { auth } from '../services/firebase';
import { addFavoriteCity } from '../services/favoritesService'; // new import

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather({
          city: data.name,
          temp: data.main.temp,
          description: data.weather[0].description,
        });
      } else {
        setWeather(null);
        setError('City not found.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddFavorite = async () => {
    if (weather) {
      const user = auth.currentUser;
      if (user) {
        try {
          await addFavoriteCity(user.uid, weather.city);
          alert(`${weather.city} added to favorites!`);
        } catch (error) {
          console.error('Error adding favorite:', error);
        }
      } else {
        alert('You must be logged in to add favorites.');
      }
    }
  };
  

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Check the Weather</h1>
      <SearchBar onSearch={fetchWeather} />

      {loading && (
        <div className="flex justify-center mt-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {error && <p className="mt-6 text-lg font-semibold text-red-500">{error}</p>}

      {!loading && !error && weather && (
        <WeatherCard
          city={weather.city}
          temp={weather.temp}
          description={weather.description}
          onAddFavorite={handleAddFavorite}
        />
      )}
    </div>
  );
}

export default Home;
