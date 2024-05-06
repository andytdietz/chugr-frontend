import React from "react";
import { Link } from "react-router-dom";

export function FavoritesIndex(props) {
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

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
    const { latitude, longitude, address_1, city, state } = favorite;
    const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

    if (latitude && longitude) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${latitude},${longitude}&key=${googleMapsApiKey}`;
    } else if (address_1) {
      // Use the concatenated address for the static map image if latitude or longitude is null
      const encodedAddress = encodeURIComponent(`${address_1}, ${city}, ${state}`);
      return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${encodedAddress}&key=${googleMapsApiKey}`;
    } else {
      // Use a default image if latitude, longitude, and address are null
      return "https://res.cloudinary.com/teepublic/image/private/s--cL7MR2EB--/c_fit,g_north_west,h_840,w_760/co_191919,e_outline:40/co_191919,e_outline:inner_fill:1/co_ffffff,e_outline:40/co_ffffff,e_outline:inner_fill:1/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg";
    }
  };

  return (
    <div className="container">
      <h2>My Favorites</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {props.favorites.map((favorite) => (
          <div key={favorite.id} className="col">
            <div className="card">
              <div className="card-body">
                <h5>
                  <Link to={`/breweries/${favorite.brewery_id}`} className="text-decoration-none">
                    {favorite.name}
                  </Link>
                </h5>
                <a href={getDirectionsURL(favorite)} target="_blank" rel="noopener noreferrer">
                  <img
                    src={getStaticMapUrl(favorite)}
                    className="card-img-top"
                    alt={`Map of ${favorite.name}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </a>
                <div className="card-body">
                  <p className="card-text">
                    {favorite.city}, {favorite.state}
                  </p>
                  <p className="card-text">
                    Type: <span style={{ textTransform: "capitalize" }}>{favorite.brewery_type}</span>
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <div>
                    <a
                      href={favorite.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm me-2"
                    >
                      Brewery Website
                    </a>
                  </div>
                  <div>
                    <button onClick={() => handleClick(favorite.id)} className="btn btn-danger btn-sm">
                      Remove Favorite
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
