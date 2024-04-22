import React, { useState, useEffect } from "react";
import axios from "axios";

const NearbyBreweries = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBreweries, setNearbyBreweries] = useState([]);

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
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
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
                    <h5 className="card-title">{brewery.name}</h5>
                    <p className="card-text">
                      {brewery.city}, {brewery.state}
                    </p>
                    <a href={getDirectionsURL(brewery)} target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${brewery.latitude},${brewery.longitude}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${brewery.latitude},${brewery.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                        alt={`Map of ${brewery.name}`}
                        className="img-fluid"
                      />
                    </a>
                    <a href={brewery.website_url} className="btn btn-primary me-2">
                      Brewery Website
                    </a>
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
