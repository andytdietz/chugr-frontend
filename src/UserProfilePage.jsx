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
  const [editField, setEditField] = useState(null);

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
      })
      .catch((error) => {
        setError("Failed to fetch user data");
      });
  }, [id]);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("user_id");

    axios
      .patch(`http://localhost:3000/users/${userId}.json`, formData)
      .then((response) => {
        setSuccess(true);
        setError(null);
      })
      .catch((error) => {
        setError("Failed to update user data");
      });
  };

  return (
    <div className="container">
      <h2>My Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Profile updated successfully</div>}
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Name</h5>
            <p className="card-text">
              {editField === "name" ? (
                <input type="text" value={formData.name} onChange={handleChange} />
              ) : (
                formData.name
              )}
            </p>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEdit("name")}>
              Edit
            </button>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Username</h5>
            <p className="card-text">
              {editField === "username" ? (
                <input type="text" value={formData.username} onChange={handleChange} />
              ) : (
                formData.username
              )}
            </p>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEdit("username")}>
              Edit
            </button>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Email</h5>
            <p className="card-text">
              {editField === "email" ? (
                <input type="email" value={formData.email} onChange={handleChange} />
              ) : (
                formData.email
              )}
            </p>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEdit("email")}>
              Edit
            </button>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Bio</h5>
            <p className="card-text">
              {editField === "bio" ? <textarea value={formData.bio} onChange={handleChange} /> : formData.bio}
            </p>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEdit("bio")}>
              Edit
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
