/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function BreweriesShowPage() {
  const [brewery, setBrewery] = useState({});
  const params = useParams();

  const handleShowBrewery = () => {
    axios.get(`http://localhost:3000/breweries/${params.id}.json`).then((response) => {
      setBrewery(response.data);
    });
  };

  useEffect(handleShowBrewery, []);

  return (
    <div id="breweries-show">
      <h2>{brewery.name}</h2>
      <h3>{brewery.city}</h3>
      <p>Type: {brewery.brewery_type}</p>
      <p>
        <a href={brewery.website_url}>Brewery Website</a>
      </p>
      <img src={brewery.image_url} alt="" />
    </div>
  );
}
