import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import axios from "axios";

const BreweriesByCity = () => {
  const [breweriesByCity, setBreweriesByCity] = useState([]);

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        let allBreweries = [];
        let page = 1;
        let totalPages = 1; // Initialize totalPages to a non-zero value to enter the loop

        while (page <= totalPages) {
          const response = await axios.get(`https://api.openbrewerydb.org/breweries?page=${page}&per_page=50`);
          const breweries = response.data;
          allBreweries = [...allBreweries, ...breweries];
          totalPages = parseInt(response.headers["x-total-pages"]);
          page++;
        }

        // Process allBreweries as needed
        // For example, count breweries by city, etc.

        const cities = {};

        allBreweries.forEach((brewery) => {
          if (brewery.city in cities) {
            cities[brewery.city].push(brewery);
          } else {
            cities[brewery.city] = [brewery];
          }
        });

        // Convert cities object to array of objects
        const citiesArray = Object.keys(cities).map((city) => ({
          city: city,
          breweries: cities[city],
        }));

        // Sort cities by brewery count
        citiesArray.sort((a, b) => b.breweries.length - a.breweries.length);

        setBreweriesByCity(citiesArray);
      } catch (error) {
        console.error("Error fetching breweries:", error);
      }
    };

    fetchBreweries();
  }, []);

  return (
    <div className="container">
      <h2>Breweries By City</h2>
      <ul>
        {breweriesByCity.map((city) => (
          <li key={city.city}>
            <Link to={`/breweries/${encodeURIComponent(city.city)}`}>{city.city}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreweriesByCity;
