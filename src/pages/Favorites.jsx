import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { getFavoriteCities, removeFavoriteCity } from '../services/favoritesService';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const cities = await getFavoriteCities(user.uid);
          setFavorites(cities || []); 
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setFavorites([]); 
        }
      } else {
        navigate('/login');
      }
      setLoading(false); 
    };
  
    fetchFavorites();
  }, [navigate]);
  

  const handleRemove = async (city) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await removeFavoriteCity(user.uid, city);
        const updatedFavorites = favorites.filter(fav => fav !== city);
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-6">Favorite Cities</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600">No favorites yet.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((city) => (
            <li
              key={city}
              className="bg-white p-4 rounded shadow-md flex justify-between items-center max-w-md mx-auto"
            >
              <span className="text-xl">{city}</span>
              <button
                onClick={() => handleRemove(city)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
