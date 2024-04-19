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
          <img
            src={
              "https://res.cloudinary.com/teepublic/image/private/s--n_CzDog2--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_191919,e_outline:48/co_191919,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg"
            }
            alt={favorite.name}
          />
          <button onClick={() => handleClick(favorite.id)}>Remove Favorite</button>
        </div>
      ))}
    </div>
  );
}
