import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function BreweriesIndex(props) {
  const [favoritedBreweries, setFavoritedBreweries] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  // useEffect(() => {
  //   const storedFavorites = JSON.parse(localStorage.getItem("favoritedBreweries"));
  //   if (storedFavorites) {
  //     setFavoritedBreweries(storedFavorites);
  //   }
  // }, []);

  useEffect(() => {
    fetchFavoritedBreweries();
    fetchBreweries();
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

  const fetchBreweries = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 100) + 1; //

      const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/random?size=500page=${randomPage}`);

      props.setBreweries(response.data);
    } catch (error) {
      console.error("Error fetching breweries:", error);
    }
  };

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

        const updatedFavorites = [...favoritedBreweries, brewery.id];
        setFavoritedBreweries(updatedFavorites);

        localStorage.setItem("favoritedBreweries", JSON.stringify(updatedFavorites));
      })
      .catch((error) => {
        console.error("Error creating favorite:", error);
      });
  };

  const isBreweryFavorited = (breweryId) => {
    return favoritedBreweries.includes(breweryId);
  };

  const getStaticMapUrl = (brewery) => {
    const { latitude, longitude, address_1, city, state } = brewery;
    console.log("Google Maps API Key:", googleMapsApiKey);
    if (latitude && longitude) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${latitude},${longitude}&key=${googleMapsApiKey}`;
    } else if (address_1) {
      const encodedAddress = encodeURIComponent(`${address_1}, ${city}, ${state}`);
      return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${encodedAddress}&key=${googleMapsApiKey}`;
    } else {
      return "https://res.cloudinary.com/teepublic/image/private/s--cL7MR2EB--/c_fit,g_north_west,h_840,w_760/co_191919,e_outline:40/co_191919,e_outline:inner_fill:1/co_ffffff,e_outline:40/co_ffffff,e_outline:inner_fill:1/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg";
    }
  };

  const getDirectionsURL = (brewery) => {
    const destination = encodeURIComponent(`${brewery.latitude},${brewery.longitude}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  return (
    <div className="container">
      <h1>Random Breweries</h1>
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
                <h5 className="card-body">
                  <Link to={`/breweries/${brewery.id}`}>{brewery.name}</Link>
                </h5>
                <a href={getDirectionsURL(brewery)} target="_blank" rel="noopener noreferrer">
                  <img
                    src={getStaticMapUrl(brewery)}
                    className="card-img-top"
                    alt={`Map of ${brewery.name}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </a>
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {brewery.city}, {brewery.state}
                  </h6>
                  <a
                    href={brewery.website_url}
                    target="_blank"
                    rel="noopenernoreferrer"
                    className="btn btn-primary me-2"
                  >
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
  );
}
