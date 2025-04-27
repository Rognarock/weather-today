function FavoriteButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Add to Favorites
      </button>
    );
  }
  
  export default FavoriteButton;
  