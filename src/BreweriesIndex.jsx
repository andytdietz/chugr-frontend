/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function BreweriesIndex(props) {
  const [favoritedBreweries, setFavoritedBreweries] = useState([]);

  useEffect(() => {
    // Retrieve favorited brewery IDs from localStorage on component mount
    const storedFavorites = JSON.parse(localStorage.getItem("favoritedBreweries"));
    if (storedFavorites) {
      setFavoritedBreweries(storedFavorites);
    }
  }, []);

  const handleFavoriteClick = (breweryId) => {
    axios
      .post("http://localhost:3000/favorites.json", { brewery_id: breweryId })
      .then((response) => {
        console.log("Favorite Created:", response.data);
        // Add the favorited brewery ID to the list
        const updatedFavorites = [...favoritedBreweries, breweryId];
        setFavoritedBreweries(updatedFavorites);
        // Update localStorage with the updated list of favorited brewery IDs
        localStorage.setItem("favoritedBreweries", JSON.stringify(updatedFavorites));
      })
      .catch((error) => {
        console.error("Error creating favorite:", error);
      });
  };

  const isBreweryFavorited = (breweryId) => {
    return favoritedBreweries.includes(breweryId);
  };

  return (
    <div>
      <h1 className="col-12">All Breweries</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {props.breweries.map((brewery) => (
          <div key={brewery.id} className="col">
            <div className="card">
              <img
                src={
                  "https://res.cloudinary.com/teepublic/image/private/s--n_CzDog2--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_191919,e_outline:48/co_191919,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg"
                }
                className="card-img-top"
                alt={brewery.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{brewery.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{brewery.city}</h6>
                <Link
                  to={`/breweries/${brewery.id}`}
                  className="btn btn-primary me-2"
                  onClick={() => props.onShowBrewery(brewery)}
                >
                  More Info
                </Link>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleFavoriteClick(brewery.id)}
                  disabled={isBreweryFavorited(brewery.id)}
                >
                  Favorite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
