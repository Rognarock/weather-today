import React from "react";
import { FaTrash, FaSyncAlt } from "react-icons/fa";

const Favorites = ({ favorites, onSelect, onRemove, onRefresh }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        ⭐ Favorite Cities
      </h3>

      {favorites.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No favorites yet</p>
      )}

      {favorites.map((city) => (
        <div
          key={city}
          className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 mb-2 shadow-sm"
        >
          <button
            onClick={() => onSelect(city)}
            className="text-left text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {city}
          </button>
          <FaTrash
            onClick={() => onRemove(city)}
            className="cursor-pointer text-red-500 hover:text-red-600 transition"
            title="Remove"
          />
        </div>
      ))}

      {favorites.length > 0 && (
        <button
          onClick={onRefresh}
          className="mt-4 flex items-center gap-2 text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <FaSyncAlt /> Refresh First Favorite
        </button>
      )}
    </div>
  );
};

export default Favorites;
