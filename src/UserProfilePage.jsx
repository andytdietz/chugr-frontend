import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfileForm = ({ id }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${id}.json`)
      .then((response) => {
        const { name, username, email, bio } = response.data;
        setFormData({
          name: name || "",
          username: username || "",
          email: email || "",
          bio: bio || "",
        });
        console.log("User data:", response.data);
      })
      .catch((error) => {
        setError("Failed to fetch user data");
      });
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Retrieve user ID from local storage
    const userId = localStorage.getItem("user_id");

    axios
      .patch(`http://localhost:3000/users/${userId}.json`, formData)
      .then((response) => {
        setSuccess(true);
        setError(null);
        console.log("User data:", response.data);
      })
      .catch((error) => {
        setError("Failed to update user data");
      });
  };

  return (
    <div className="container">
      <h2>Edit Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Profile updated successfully</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="form-text">Current: {formData.name}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
          />
          <div className="form-text">Current: {formData.username}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="form-text">Current: {formData.email}</div>
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio:
          </label>
          <textarea id="bio" name="bio" className="form-control" value={formData.bio} onChange={handleChange} />
          <div className="form-text">Current: {formData.bio}</div>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
