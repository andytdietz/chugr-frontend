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
      <h1>All Breweries</h1>
      {props.breweries.map((brewery) => (
        <div key={brewery.id}>
          <h2>{brewery.name}</h2>
          <h3>{brewery.city}</h3>
          <img src={brewery.image_url} alt={brewery.name} />
          <Link to={`/breweries/${brewery.id}`}>
            <button onClick={() => props.onShowBrewery(brewery)}>More Info</button>
          </Link>
          <button onClick={() => handleFavoriteClick(brewery.id)} disabled={isBreweryFavorited(brewery.id)}>
            ♥️
          </button>
        </div>
      ))}
    </div>
  );
}
