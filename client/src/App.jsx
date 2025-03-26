import React, { useState, useEffect } from 'react';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import WeatherCard from './components/WeatherCard';
import ThemeToggle from './components/ThemeToggle';
import LoginForm from './components/LoginForm';
import { Toaster, toast } from 'react-hot-toast';

const groupForecastByDay = (data) => {
  const days = {};

  data.forEach((entry) => {
    const date = new Date(entry.dt_txt).toLocaleDateString();
    if (!days[date]) days[date] = [];
    days[date].push(entry);
  });

  return Object.entries(days).slice(0, 5).map(([date, entries]) => {
    const temps = entries.map(e => e.main.temp);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    const mainWeather = entries[0].weather[0];

    return {
      date,
      avgTemp,
      description: mainWeather.description,
      icon: mainWeather.icon
    };
  });
};

const App = () => {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user'));
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(`favorites-${localStorage.getItem('user')}`);
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const getWeather = async (cityName = city) => {
    if (!cityName) return;

    setLoading(true);

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      if (weatherRes.ok && forecastRes.ok) {
        setWeather(weatherData);
        setForecast(groupForecastByDay(forecastData.list));
      } else {
        setWeather(null);
        setForecast([]);
        toast.error(weatherData.message || forecastData.message || 'City not found', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '0.9rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
          },
          icon: '⚠️',
        });
      }

    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = () => {
    if (!weather) return;
    const cityName = weather.name;
    if (!favorites.includes(cityName)) {
      const updated = [...favorites, cityName];
      setFavorites(updated);
      localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(updated));
      toast.success(`${cityName} added to favorites ❤️`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '0.9rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
        },
        icon: '⭐',
      });
    } else {
      toast(`${cityName} is already in your favorites`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#facc15',
          color: '#1e293b',
          borderRadius: '8px',
          fontSize: '0.9rem',
        },
        icon: '📌',
      });
    }
  };

  const handleRemoveFavorite = (cityName) => {
    const updated = favorites.filter((c) => c !== cityName);
    setFavorites(updated);
    localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(updated));
  };

  const autoRefreshFavorites = () => {
    if (favorites.length > 0) {
      getWeather(favorites[0]);
    }
  };

  useEffect(() => {
    if (currentUser) autoRefreshFavorites();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <LoginForm onLogin={setCurrentUser} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-6 max-w-4xl mx-auto transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />
      <ThemeToggle />

      <button
        onClick={() => {
          localStorage.removeItem('user');
          setCurrentUser(null);
        }}
        className="absolute top-4 left-4 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
      >
        Log Out
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">🌤️ Weather Today</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={city}
          placeholder="Enter city"
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          onClick={() => getWeather()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-6">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent"></div>
        </div>
      )}

      <Favorites
        favorites={favorites}
        onSelect={getWeather}
        onRemove={handleRemoveFavorite}
        onRefresh={autoRefreshFavorites}
      />

      <WeatherCard
        weather={weather}
        onAddFavorite={handleAddFavorite}
      />

      <Forecast forecast={forecast} loading={loading} />
    </div>
  );
};

export default App;