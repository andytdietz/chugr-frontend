/* eslint-disable react/prop-types */
export function FavoritesIndex(props) {
  if (!props.favorites || props.favorites.length === 0) {
    return <div>No favorites to display.</div>;
  }

  const handleClick = (favoriteId) => {
    props.onDestroyFavorite(favoriteId);
  };
  return (
    <div className="container">
      <h1 className="my-4">My Favorites</h1>
      <div className="row">
        {props.favorites.map((favorite) => (
          <div key={favorite.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{favorite.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {favorite.city}, {favorite.state}
                </h6>
                <p>
                  Type: <span style={{ textTransform: "capitalize" }}>{favorite.brewery_type}</span>
                </p>
                <a href={favorite.website_url} className="btn btn-primary me-2">
                  Brewery Website
                </a>
                <button onClick={() => handleClick(favorite.id)} className="btn btn-danger">
                  Remove Favorite
                </button>
              </div>
              <img
                src={
                  "https://res.cloudinary.com/teepublic/image/private/s--n_CzDog2--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_191919,e_outline:48/co_191919,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg"
                }
                className="card-img-bottom"
                alt={favorite.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
