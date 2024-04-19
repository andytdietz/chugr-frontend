/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function BreweriesIndex(props) {
  const [favoritedBreweries, setFavoritedBreweries] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    // Retrieve favorited brewery IDs from localStorage on component mount
    const storedFavorites = JSON.parse(localStorage.getItem("favoritedBreweries"));
    if (storedFavorites) {
      setFavoritedBreweries(storedFavorites);
    }
  }, []);

  const handleFavoriteClick = (brewery) => {
    const favoriteData = {
      brewery_id: brewery.id,
      name: brewery.name,
      city: brewery.city,
      state: brewery.state,
      brewery_type: brewery.brewery_type,
      website_url: brewery.website_url,
    };

    axios
      .post("http://localhost:3000/favorites.json", favoriteData)
      .then((response) => {
        console.log("Favorite Created:", response.data);
        // Add the favorited brewery ID to the list
        const updatedFavorites = [...favoritedBreweries, brewery.id];
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
      <p>
        Search by Brewery, City, or Type:
        <input
          type="text"
          value={searchFilter}
          onChange={(event) => setSearchFilter(event.target.value)}
          list="brewery-suggestions"
        />
        <datalist id="brewery-suggestions">
          {props.breweries
            .reduce((uniqueTypes, brewery) => {
              if (!uniqueTypes.includes(brewery.brewery_type)) {
                uniqueTypes.push(brewery.brewery_type);
              }
              return uniqueTypes;
            }, [])
            .map((type) => (
              <option key={type} value={type} />
            ))}
        </datalist>
      </p>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {props.breweries
          .filter(
            (brewery) =>
              brewery.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
              brewery.brewery_type.toLowerCase().includes(searchFilter.toLowerCase()) ||
              brewery.city.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .map((brewery) => (
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
                  <h6 className="card-subtitle mb-2 text-muted">
                    {brewery.city}, {brewery.state}
                  </h6>
                  <Link
                    to={`/breweries/${brewery.id}`}
                    className="btn btn-primary me-2"
                    onClick={() => props.onShowBrewery(brewery)}
                  >
                    More Info
                  </Link>
                  <button
                    className={`btn btn-secondary bg-transparent border-0`}
                    onClick={() => handleFavoriteClick(brewery)}
                    disabled={isBreweryFavorited(brewery.id)}
                  >
                    <i
                      className={`bi ${
                        isBreweryFavorited(brewery.id) ? "bi-heart-fill text-danger fs-4" : "bi-heart text-black fs-4"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
