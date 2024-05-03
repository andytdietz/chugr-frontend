import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfileForm = ({ id }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profile_picture: null, // New state for profile picture
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editField, setEditField] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    axios
      .get(`http://localhost:3000/users/${userId}.json`)
      .then((response) => {
        const { name, username, email, bio, profile_picture_url } = response.data;
        console.log("Profile Picture URL:", profile_picture_url); // Log the profile picture URL
        setFormData({
          name: name || "",
          username: username || "",
          email: email || "",
          bio: bio || "",
          profile_picture: profile_picture_url ? `${profile_picture_url}?t=${new Date().getTime()}` : "",
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
    const { name, value, files } = event.target;
    // If it's a file input, set the file in formData
    if (name === "profile_picture") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Assuming single file upload
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("user_id");
    const userData = new FormData();

    // Iterate over formData object and append each key-value pair to userData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profile_picture" && value !== null) {
        // Append file if it's a profile picture
        userData.append(key, value);
      } else {
        // Append other fields as strings
        userData.append(`user[${key}]`, value);
      }
    });
    console.log("Form Data:", formData);

    try {
      const response = await axios.patch(`http://localhost:3000/users/${userId}.json`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError("Failed to update user data");
    }
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
              {formData.profile_picture && (
                <img src={formData.profile_picture} alt="Profile" style={{ maxWidth: "200px" }} />
              )}
              {editField === "name" ? (
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
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
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
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
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
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
              {editField === "bio" ? (
                <input type="text" name="bio" value={formData.bio} onChange={handleChange} />
              ) : (
                formData.bio
              )}
            </p>
            <button type="button" className="btn btn-sm btn-primary" onClick={() => handleEdit("bio")}>
              Edit
            </button>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Profile Picture</h5>
            <p className="card-text">
              {formData.profile_picture && (
                <img
                  src={formData.profile_picture}
                  alt="Profile Picture"
                  className="rounded-circle"
                  style={{ maxWidth: "200px" }}
                />
              )}
              <input type="file" name="profile_picture" onChange={handleChange} />
            </p>
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
