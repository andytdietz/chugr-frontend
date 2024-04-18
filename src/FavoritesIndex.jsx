/* eslint-disable react/prop-types */
export function FavoritesIndex(props) {
  if (!props.favorites || props.favorites.length === 0) {
    return <div>No favorites to display.</div>;
  }

  const handleClick = (favoriteId) => {
    props.onDestroyFavorite(favoriteId);
  };
  return (
    <div>
      <h1>My Favorites</h1>
      {props.favorites.map((favorite) => (
        <div key={favorite.id}>
          <h2>{favorite.brewery}</h2>
          <h3>{favorite.city}</h3>
          <p>Brewery Type: {favorite.type}</p>
          <p>Brewery Website: {favorite.website}</p>
          <img src={favorite.image} alt={favorite.name} />
          <button onClick={() => handleClick(favorite.id)}>Remove Favorite</button>
        </div>
      ))}
    </div>
  );
}
