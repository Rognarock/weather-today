import FavoriteButton from './FavoriteButton';

function WeatherCard({ city, temp, description, onAddFavorite }) {
  return (
    <div className="max-w-sm mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-2">{city}</h2>
      <p className="text-3xl mb-2">{temp}°C</p>
      <p className="text-gray-600 capitalize">{description}</p>
      
      {/* Favorite Button */}
      <FavoriteButton onClick={onAddFavorite} />
    </div>
  );
}

export default WeatherCard;
