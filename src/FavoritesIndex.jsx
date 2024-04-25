import React from "react";

export function FavoritesIndex(props) {
  if (!props.favorites || props.favorites.length === 0) {
    return <div>No favorites to display.</div>;
  }

  const handleClick = (favoriteId) => {
    props.onDestroyFavorite(favoriteId);
  };

  const getDirectionsURL = (latitude, longitude) => {
    const destination = encodeURIComponent(`${latitude},${longitude}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  const getStaticMapUrl = (favorite) => {
    const { latitude, longitude } = favorite;
    if (!latitude || !longitude) {
      // Use a default image if latitude or longitude is null
      return "https://via.placeholder.com/400x300?text=Location+Not+Available";
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${latitude},${longitude}&key=`;
  };

  return (
    <div className="container">
      <h1 className="row row-cols-1 row-cols-md-3 g-4">My Favorites</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {props.favorites.map((favorite) => (
          <div key={favorite.id} className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{favorite.name}</h5>
                <h6 className="card-text">
                  {favorite.city}, {favorite.state}
                </h6>
                <p>
                  Type: <span style={{ textTransform: "capitalize" }}>{favorite.brewery_type}</span>
                </p>
              </div>
              <a
                href={getDirectionsURL(favorite.latitude, favorite.longitude)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={getStaticMapUrl(favorite)} className="img-fluid" alt={`Map of ${favorite.name}`} />
              </a>
              <a href={favorite.website_url} className="btn btn-primary me-2">
                Brewery Website
              </a>
              <button onClick={() => handleClick(favorite.id)} className="btn btn-danger me-2">
                Remove Favorite
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
