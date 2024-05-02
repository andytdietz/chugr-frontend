import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useParams } from "react-router-dom";
import { BreweriesIndex } from "./BreweriesIndex";
import { FavoritesIndex } from "./FavoritesIndex";
import { Signup } from "./Signup";
import { Login } from "./Login";
import UserProfilePage from "./UserProfilePage";
import NearbyBreweries from "./NearbyBreweries";
import BreweriesShowPage from "./BreweriesShowPage";

export function Content() {
  const [breweries, setBreweries] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    handleIndexBreweries();
    handleIndexFavorites();
  }, []);

  const { id } = useParams();

  const handleIndexBreweries = () => {
    axios
      .get("https://api.openbrewerydb.org/v1/breweries/random?size=50")
      .then((response) => setBreweries(response.data))
      .catch((error) => console.error("Error fetching breweries:", error));
  };

  const handleIndexFavorites = () => {
    axios
      .get("http://localhost:3000/favorites.json")
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error("Error fetching favorites:", error));
  };

  const handleDestroyFavorite = (favoriteId) => {
    axios
      .delete(`http://localhost:3000/favorites/${favoriteId}`)
      .then(() => {
        // Remove the deleted favorite from the favorites list
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
      })
      .catch((error) => console.error("Error deleting favorite:", error));
  };

  return (
    <main className="container">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/random"
          element={<BreweriesIndex breweries={breweries} favorites={favorites} setBreweries={setBreweries} />}
        />
        <Route
          path="/favorites"
          element={<FavoritesIndex favorites={favorites} onDestroyFavorite={handleDestroyFavorite} />}
        />

        <Route path="/" element={<NearbyBreweries />} />
        <Route path="/breweries/:id" element={<BreweriesShowPage />} />
        {/* Route for user profile with user ID */}
        <Route path="/users/:id" element={<UserProfilePage />} />
      </Routes>
    </main>
  );
}
