import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfileForm = ({ id, authenticityToken }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profile_picture: "", // New state for profile picture URL
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editField, setEditField] = useState(null);
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    console.log("Fetching user data...");
    const userId = localStorage.getItem("user_id");
    axios
      .get(`http://localhost:3000/users/${userId}.json`)
      .then((response) => {
        console.log("User data received:", response.data);
        setUserData(response.data); // Store response data in state
        const { name, username, email, bio, profile_picture } = response.data;
        // Extract profile picture URL from the response
        const profilePictureUrl = profile_picture && profile_picture.url; // Check if profile_picture exists before accessing its URL
        setFormData({
          name: name || "",
          username: username || "",
          email: email || "",
          bio: bio || "",
          profile_picture: profilePictureUrl || "", // Set the profile picture URL here
        });
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data");
      });
  }, [id]);

  // Check if userData is null before accessing its properties
  if (!userData) {
    return null; // Render nothing until user data is fetched
  }

  const handleEdit = (field) => {
    console.log(`Editing ${field} field...`);
    setEditField(field);
  };

  const handleChange = (event) => {
    console.log("Handling change event...");
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
    console.log("Submitting form...");
    const userId = localStorage.getItem("user_id");
    const formDataWithProfilePicture = new FormData();

    // Iterate over formData object and append each key-value pair to formDataWithProfilePicture
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "profile_picture" && value instanceof File) {
        // Append file if it's a profile picture
        formDataWithProfilePicture.append(key, value);
      } else {
        // Append other fields as strings
        formDataWithProfilePicture.append(`user[${key}]`, value);
      }
    });

    // Append existing profile picture if it exists and is not being updated
    if (!formData.profile_picture && userData.profile_picture_url) {
      formDataWithProfilePicture.append("user[profile_picture]", userData.profile_picture_url);
    }

    try {
      console.log("Sending update request...");

      const response = await axios.patch(`http://localhost:3000/users/${userId}.json`, formDataWithProfilePicture, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Update response:", response.data); // Log the response data

      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Failed to update user data:", error);

      setError("Failed to update user data");
    }
  };
  return (
    <div className="container">
      <h2>My Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Profile updated successfully</div>}
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="authenticity_token" value={authenticityToken} />

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Name</h5>
            <p className="card-text">
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
            {userData.profile_picture_url && <img src={userData.profile_picture_url} alt="Profile" />}
            <p className="card-text">
              <input type="file" name="profile_picture" onChange={handleChange} />
            </p>
            {/* Display the profile picture if available */}
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
