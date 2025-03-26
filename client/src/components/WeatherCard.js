import React from "react";
import { FaHeart } from "react-icons/fa";

const WeatherCard = ({ weather, onAddFavorite }) => {
  if (!weather) return null;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-2">
        {weather.name}, {weather.sys.country}
      </h2>
      <p>🌡️ Temp: {weather.main.temp}°C</p>
      <p>🌥️ Condition: {weather.weather[0].description}</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>💨 Wind: {weather.wind.speed} m/s</p>
      <button
        onClick={onAddFavorite}
        className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center gap-2 transition"
      >
        <FaHeart /> Add to Favorites
      </button>
    </div>
  );
};

export default WeatherCard;
