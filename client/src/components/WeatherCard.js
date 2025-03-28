import React from "react";

const WeatherCard = ({ weather, onAddFavorite, favorites = [] }) => {
  if (!weather) return null;

  const cityName = weather.name;
  const isFavorite = favorites.includes(cityName);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">
        {weather.name}, {weather.sys.country}
      </h2>
      <p>🌡️ Temp: {weather.main.temp}°C</p>
      <p>🌥️ Condition: {weather.weather[0].description}</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>💨 Wind: {weather.wind.speed} m/s</p>

      {!isFavorite && (
        <button
          onClick={onAddFavorite}
          className="mt-2 px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
        >
          ⭐ Add to Favorites
        </button>
      )}
      {isFavorite && (
        <p className="mt-2 text-sm text-green-600">✅ In favorites</p>
      )}
    </div>
  );
};

export default WeatherCard;
