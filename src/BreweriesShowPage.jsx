/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BreweriesShowPage() {
  const [brewery, setBrewery] = useState({});
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [favoritedBreweries, setFavoritedBreweries] = useState([]);
  const googleMapsApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const params = useParams();

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const breweryResponse = await axios.get(`https://api.openbrewerydb.org/v1/breweries/${params.id}`);
        setBrewery(breweryResponse.data);
      } catch (error) {
        console.error("Error fetching brewery data:", error);
      }
    };
    const fetchComments = async () => {
      try {
        const commentsResponse = await axios.get("http://localhost:3000/comments");
        console.log(commentsResponse.data);

        const filteredComments = commentsResponse.data.filter((comment) => {
          return comment.brewery_id === params.id;
        });

        setComments(filteredComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchBrewery();
    fetchComments();
  }, [params.id]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/comments", {
        content: newCommentContent,
        user_id: userId,
        brewery_id: params.id,
      });
      setComments([...comments, response.data]);
      setNewCommentContent("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

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
    if (latitude && longitude) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${latitude},${longitude}&key=${googleMapsApiKey}`;
    } else if (address_1) {
      const encodedAddress = encodeURIComponent(`${address_1}, ${city}, ${state}`);
      return `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=400x300&markers=color:red%7Clabel:B%7C${encodedAddress}&key=${googleMapsApiKey}`;
    } else {
      return "https://res.cloudinary.com/teepublic/image/private/s--cL7MR2EB--/c_fit,g_north_west,h_840,w_760/co_191919,e_outline:40/co_191919,e_outline:inner_fill:1/co_ffffff,e_outline:40/co_ffffff,e_outline:inner_fill:1/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/t_watermark_lock/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1497200957/production/designs/1660854_1.jpg";
    }
  };

  return (
    <div id="breweries-show" className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          {/* Breweries information */}
          <h2 style={{ fontSize: "3rem" }}>{brewery.name}</h2>
          <h3>
            {brewery.city}, {brewery.state}
          </h3>
          <p>
            Type: <span style={{ textTransform: "capitalize" }}>{brewery.brewery_type}</span>
          </p>
          <p>
            <a href={brewery.website_url} target="_blank" rel="noopenernoreferrer" className="btn btn-primary me-2">
              Brewery Website
            </a>
            <Link to="/" className="btn btn-secondary">
              Back to Nearby Breweries
            </Link>
          </p>
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
          <div className="mb-3">
            {/* Add a Comment form */}
            <label htmlFor="new-comment" className="form-label">
              Add a Comment
            </label>
            <textarea
              className="form-control"
              id="new-comment"
              rows="3"
              value={newCommentContent}
              onChange={(event) => setNewCommentContent(event.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary mt-2" onClick={handleSubmitComment}>
              Post Comment
            </button>
          </div>
        </div>
        <div className="col-md-6 brewery-map-container">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${brewery.latitude},${brewery.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={getStaticMapUrl(brewery)}
              alt="Brewery Map"
              className="img-fluid"
              style={{ width: "100%", height: "auto" }}
            />
          </a>
        </div>
      </div>
      <div className="mt-4">
        <h3>Comments</h3>
        <ul className="list-group">
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <strong>{comment.user && comment.user.username}</strong>
                <p>{comment.content}</p>
              </div>

              {comment.user && comment.user_id === parseInt(localStorage.getItem("user_id")) && (
                <button className="btn btn-danger" onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
