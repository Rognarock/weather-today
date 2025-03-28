// Importing required libraries and components
import React, { useState, useEffect } from 'react';
import Forecast from './components/Forecast';
import WeatherCard from './components/WeatherCard';
import ThemeToggle from './components/ThemeToggle';
import { Toaster, toast } from 'react-hot-toast';
import { Link, Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';

// Helper: Group forecast data by day
const groupForecastByDay = (data) => {
  const days = {};
  data.forEach((entry) => {
    const date = new Date(entry.dt_txt).toLocaleDateString();
    if (!days[date]) days[date] = [];
    days[date].push(entry);
  });
  return Object.entries(days).map(([date, entries]) => {
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
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cityForecasts, setCityForecasts] = useState(() => {
    const saved = localStorage.getItem('cityForecasts');
    return saved ? JSON.parse(saved) : {};
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user'));
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(`favorites-${localStorage.getItem('user')}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [recentCities, setRecentCities] = useState(() => {
    const saved = localStorage.getItem('recentCities');
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const getWeather = async (cityName = city) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
      const weatherData = await weatherRes.json();
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`);
      const forecastData = await forecastRes.json();

      if (weatherRes.ok && forecastRes.ok) {
        setWeather(weatherData);
        setForecast(groupForecastByDay(forecastData.list));

        setCityForecasts(prev => {
          const updated = { ...prev, [weatherData.name]: groupForecastByDay(forecastData.list) };
          localStorage.setItem('cityForecasts', JSON.stringify(updated));
          return updated;
        });

        setRecentCities(prev => {
          const updated = [weatherData.name, ...prev.filter(c => c !== weatherData.name)];
          localStorage.setItem('recentCities', JSON.stringify(updated));
          return updated;
        });
      } else {
        setWeather(null);
        setForecast([]);
        toast.error(weatherData.message || forecastData.message || 'City not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherImage = () => {
    if (!weather) return 'default.jpg';
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('cloud')) return 'cloudy.jpg';
    if (main.includes('rain') || main.includes('drizzle')) return 'rainy.jpg';
    if (main.includes('snow')) return 'snowy.jpg';
    if (main.includes('clear')) return 'sunny.jpg';
    if (main.includes('thunderstorm')) return 'stormy.jpg';
    return 'default.jpg';
  };

  const handleAddFavorite = (cityName) => {
    if (!cityName || !currentUser) return;
    if (favorites.includes(cityName)) {
      toast(`${cityName} is already in favorites`, { icon: '📌' });
      return;
    }
    const updated = [...favorites, cityName];
    setFavorites(updated);
    localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(updated));
    toast.success(`${cityName} added to favorites!`, { icon: '⭐' });
  };

  const handleRemoveFavorite = (cityName) => {
    const updated = favorites.filter(c => c !== cityName);
    setFavorites(updated);
    localStorage.setItem(`favorites-${currentUser}`, JSON.stringify(updated));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      getWeather();
    }
  };

  const handleUserLogin = (email) => {
    setCurrentUser(email);
    localStorage.setItem('user', email);
  };

  return (
    <Router>
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(/images/${getWeatherImage()})` }}
      >
        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md min-h-screen px-6 py-8 max-w-5xl mx-auto rounded-xl shadow-xl relative">
          <Toaster position="top-right" />

          <nav className="flex flex-wrap justify-between items-center mb-6 text-sm gap-2 sm:gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Link to={currentUser ? "/user" : "/"} className="text-blue-600 font-semibold">
                Weather Today
              </Link>
              {!currentUser && (
                <Link to="/auth" className="text-blue-600 hover:underline">
                  Register/Login
                </Link>
              )}
              {currentUser && (
                <span className="text-blue-600 truncate max-w-[180px]">
                  Welcome, {currentUser}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              {currentUser && (
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("cityForecasts");
                    setCurrentUser(null);
                    setCityForecasts({});
                    toast.success("Logged out");
                  }}
                  className="text-red-600 hover:underline"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>

          <Routes>
            <Route
              path="/"
              element={currentUser ? <Navigate to="/user" /> : (
                <>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={city}
                      placeholder="Enter city"
                      onChange={(e) => setCity(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                    />
                    <button
                      onClick={() => getWeather()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Search
                    </button>
                  </div>

                  {recentCities.length > 0 && (
                    <div className="mb-6 text-sm text-white">
                      <h4 className="font-semibold mb-2">Recently Searched Cities:</h4>
                      <ul className="list-disc list-inside">
                        {recentCities.map((c) => (
                          <li key={c} className="cursor-pointer hover:underline" onClick={() => getWeather(c)}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {loading && (
                    <div className="flex justify-center items-center my-6">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent"></div>
                    </div>
                  )}

                  <WeatherCard weather={weather} onAddFavorite={() => handleAddFavorite(weather?.name)} />
                  <Forecast forecast={forecast} loading={loading} />
                </>
              )}
            />

            <Route path="/auth" element={<AuthPage onAuthSuccess={handleUserLogin} />} />

            <Route
              path="/user"
              element={currentUser ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={city}
                      placeholder="Enter city"
                      onChange={(e) => setCity(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                    />
                    <button
                      onClick={() => getWeather()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Search
                    </button>
                  </div>

                  {recentCities.length > 0 && (
                    <div className="mb-6 text-sm text-white">
                      <h4 className="font-semibold mb-2">Recently Searched Cities:</h4>
                      <ul className="list-disc list-inside">
                        {recentCities.map((c) => (
                          <li key={c} className="cursor-pointer hover:underline" onClick={() => getWeather(c)}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {loading && (
                    <div className="flex justify-center items-center my-6">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent"></div>
                    </div>
                  )}

                  <WeatherCard weather={weather} onAddFavorite={() => handleAddFavorite(weather?.name)} />
                  <Forecast forecast={forecast} loading={loading} />
                </>
              ) : <Navigate to="/auth" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
