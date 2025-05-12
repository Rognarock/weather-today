import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { getFavoriteCities, removeFavoriteCity } from '../services/favoritesService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const cities = await getFavoriteCities(user.uid);
        setFavorites(cities);
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
        toast.info(`${city} removed from favorites`); 
      } catch (error) {
        console.error('Error removing favorite:', error);
        toast.error("Failed to remove city."); 
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
          <div className="max-w-md mx-auto space-y-4">
              {favorites.length === 0 ? (
                <p className="text-center text-gray-300">No favorite cities yet.</p>
                    ) : (
                     favorites.map((city) => (
             <div
                 key={city}
                   className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center"
                   >
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                 {city}
               </h2>
        <button
          onClick={() => handleRemove(city)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </div>
    ))
  )}
</div>
  );
}

export default Favorites;
