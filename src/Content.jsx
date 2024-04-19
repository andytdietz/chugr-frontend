/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { BreweriesIndex } from "./BreweriesIndex";
import { BreweriesShow } from "./BreweriesShow";
import { FavoritesIndex } from "./FavoritesIndex";
import { BreweriesShowPage } from "./BreweriesShowPage";
import { Modal } from "./Modal";
import { Signup } from "./Signup";
import { Login } from "./Login";
import { LogoutLink } from "./LogoutLink";
import { Footer } from "./Footer";
import { Routes, Route } from "react-router-dom";

export function Content() {
  const [breweries, setBreweries] = useState([]);
  const [isBreweriesShowVisible, setIsBreweriesShowVisible] = useState(false);
  const [currentBrewery, setCurrentBrewery] = useState({});
  const [favorites, setFavorites] = useState([]);

  const handleIndexBreweries = () => {
    console.log("handleIndexBreweries");
    axios.get("https://api.openbrewerydb.org/v1/breweries/random?size=50").then((response) => {
      console.log(response.data);
      setBreweries(response.data);
    });
  };
  const handleIndexFavorites = () => {
    console.log("handleIndexFavorites");
    axios.get("http://localhost:3000/favorites.json").then((response) => {
      console.log(response.data);
      setFavorites(response.data);
    });
  };

  const handleShowBrewery = (brewery) => {
    console.log("handleShowBrewery", brewery);
    setIsBreweriesShowVisible(true);
    setCurrentBrewery(brewery);
  };

  const handleClose = () => {
    console.log("handleClose");
    setIsBreweriesShowVisible(false);
  };

  const handleDestroyFavorite = (id) => {
    console.log("handleDestroyFavorite", id);
    axios
      .delete(`http://localhost:3000/favorites/${id}.json`)
      .then((response) => {
        // Filter out the deleted favorite from the current state
        const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);
        // Update the state with the filtered favorites
        setFavorites(updatedFavorites);
        localStorage.removeItem("favoritedBreweries");
      })
      .catch((error) => {
        console.error("Error deleting favorite:", error);
      });
  };

  useEffect(handleIndexBreweries, []);
  useEffect(handleIndexFavorites, []);

  return (
    <main className="container">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={<BreweriesIndex breweries={breweries} favorites={favorites} onShowBrewery={handleShowBrewery} />}
        />
        <Route path="/breweries/:id" element={<BreweriesShowPage />} />
        <Route
          path="/favorites"
          element={<FavoritesIndex favorites={favorites} onDestroyFavorite={handleDestroyFavorite} />}
        />
      </Routes>
      {/* <Modal show={isBreweriesShowVisible} onClose={handleClose}>
          <BreweriesShow brewery={currentBrewery} />
        </Modal> */}
    </main>
  );
}
