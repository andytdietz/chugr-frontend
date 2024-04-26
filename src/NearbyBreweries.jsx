import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NearbyBreweries = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBreweries, setNearbyBreweries] = useState([]);
  const [favoritedBreweries, setFavoritedBreweries] = useState([]);

  useEffect(() => {
    // Function to fetch user location from cache or geolocation API
    const fetchUserLocation = () => {
      const cachedLocation = localStorage.getItem("userLocation");
      if (cachedLocation) {
        setUserLocation(JSON.parse(cachedLocation));
      } else {
        getUserLocation();
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    // Retrieve favorited brewery IDs from localStorage on component mount
    const storedFavorites = JSON.parse(localStorage.getItem("favoritedBreweries"));
    if (storedFavorites) {
      setFavoritedBreweries(storedFavorites);
    }
  }, []);
  useEffect(() => {
    fetchFavoritedBreweries();
  }, []);

  const fetchFavoritedBreweries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/favorites.json");
      const favoritedIds = response.data.map((favorite) => favorite.brewery_id);
      setFavoritedBreweries(favoritedIds);
    } catch (error) {
      console.error("Error fetching favorited breweries:", error);
    }
  };

  useEffect(() => {
    // Function to fetch nearby breweries using user location
    const fetchNearbyBreweries = async () => {
      try {
        if (userLocation) {
          const response = await axios.get(
            `https://api.openbrewerydb.org/breweries?by_dist=${userLocation.latitude},${userLocation.longitude}&size=50`
          );
          setNearbyBreweries(response.data);
        }
      } catch (error) {
        console.error("Error fetching nearby breweries:", error);
      }
    };

    // Fetch nearby breweries when userLocation changes
    if (userLocation) {
      fetchNearbyBreweries();
    }
  }, [userLocation]);

  // Function to fetch user location
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(locationData);
        localStorage.setItem("userLocation", JSON.stringify(locationData));
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  };

  // Function to generate directions URL
  const getDirectionsURL = (brewery) => {
    const destination = encodeURIComponent(`${brewery.latitude},${brewery.longitude}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&key=``;
  };

  // Function to handle favorite click
  const handleFavoriteClick = (brewery) => {
    if (isBreweryFavorited(brewery.id)) {
      console.log("brewery already favorited");
      return;
    }
    const favoriteData = {
      brewery_id: brewery.id,
      name: brewery.name,
      city: brewery.city,
      state: brewery.state,
      brewery_type: brewery.brewery_type,
      website_url: brewery.website_url,
      longitude: brewery.longitude,
      latitude: brewery.latitude,
      address: `${brewery.address_1}, ${brewery.city}, ${brewery.state}`,
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
    <div className="container">
      <h2>Nearby Breweries</h2>
      {!userLocation ? (
        <button className="btn btn-primary" onClick={getUserLocation}>
          Get My Location
        </button>
      ) : (
        <div>
          <p>
            Your Location: {userLocation.latitude}, {userLocation.longitude}
          </p>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {nearbyBreweries.map((brewery) => (
              <div key={brewery.id} className="col">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/breweries/${brewery.id}`}>{brewery.name}</Link>
                    </h5>
                    <p className="card-text">
                      {brewery.city}, {brewery.state}
                    </p>
                    <a href={getDirectionsURL(brewery)} target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${brewery.latitude},${brewery.longitude}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${brewery.latitude},${brewery.longitude}&key=``}
                        alt={`Map of ${brewery.name}`}
                        className="img-fluid"
                      />
                    </a>
                    <a href={brewery.website_url} className="btn btn-primary me-2">
                      Brewery Website
                    </a>
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
      )}
    </div>
  );
};

export default NearbyBreweries;
