export default function WeatherCard({ city, temp, description, onAddFavorite }) {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">{city}</h2>
      <p className="text-lg">{description}</p>
      <p className="text-4xl font-semibold my-4">{temp}°C</p>
      <button
        onClick={onAddFavorite}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add to Favorites
      </button>
    </div>
  );
}