/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function BreweriesShowPage() {
  const [brewery, setBrewery] = useState({});
  const params = useParams();

  const handleShowBrewery = () => {
    axios
      .get(`https://api.openbrewerydb.org/v1/breweries/${params.id}`)
      .then((response) => {
        setBrewery(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brewery data:", error);
      });
  };

  useEffect(handleShowBrewery, []);

  return (
    <div id="breweries-show" className="container mt-4">
      <div className="row">
        <div className="col">
          <h2>{brewery.name}</h2>
          <h3>
            {brewery.city}, {brewery.state}
          </h3>
          <p>
            Type: <span style={{ textTransform: "capitalize" }}>{brewery.brewery_type}</span>
          </p>
          <p>
            <a href={brewery.website_url} className="btn btn-primary me-2">
              Brewery Website
            </a>
            <Link to="/" className="btn btn-secondary">
              Back to All Breweries
            </Link>
          </p>
        </div>
        <div className="col">
          <img
            src={
              "https://res.cloudinary.com/teepublic/image/private/s--n_CzDog2--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_191919,e_outline:48/co_191919,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg"
            }
            alt=""
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
}
