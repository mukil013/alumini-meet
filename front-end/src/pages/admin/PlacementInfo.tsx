import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style/PlacementInfo.css";

export default function PlacementInfo() {
  const [placements, setPlacements] = useState([]); // State for all placements
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [formData, setFormData] = useState({
    companyName: "",
    companyImageUrl: "",
    location: "",
    jobRole: "",
    jobType: "",
    jobDescription: "",
    applyLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null); // Ref for the dialog element

  // Fetch all placements on component mount
  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/placement/getAllPlacement"
        );
        setPlacements(response.data);
      } catch (error) {
        console.error("Error fetching placements:", error);
        setError("Failed to fetch placements. Please try again.");
      }
    };

    fetchPlacements();
  }, []);

  // Handle dialog open/close
  useEffect(() => {
    if (showPopup && dialogRef.current) {
      dialogRef.current.showModal(); // Open the dialog
    } else if (!showPopup && dialogRef.current) {
      dialogRef.current.close(); // Close the dialog
    }
  }, [showPopup]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send a POST request to add a new placement
      const response = await axios.post(
        "http://localhost:8000/placement/addPlacement",
        formData
      );

      console.log("Placement added successfully:", response.data);
      alert("Placement added successfully!");

      // Clear the form after successful submission
      setFormData({
        companyName: "",
        companyImageUrl: "",
        location: "",
        jobRole: "",
        jobType: "",
        jobDescription: "",
        applyLink: "",
      });

      // Close the popup
      setShowPopup(false);

      // Refresh the placements list
      const updatedResponse = await axios.get(
        "http://localhost:8000/placement/getAllPlacement"
      );
      setPlacements(updatedResponse.data);
    } catch (error) {
      console.error("Error adding placement:", error);
      setError("Failed to add placement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="placement-info-container">
      <h1>Placements</h1>

      {/* Add Placement Button */}
      <button className="add-placement-btn" onClick={() => setShowPopup(true)}>
        Add Placement
      </button>

      {/* Popup Modal for Adding Placement */}
      <dialog ref={dialogRef} className="popup-content">
        <h2>Add New Placement</h2>
        <button
          className="close-btn"
          onClick={() => setShowPopup(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Company Image URL</label>
            <input
              type="url"
              name="companyImageUrl"
              value={formData.companyImageUrl}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Role</label>
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Type</label>
            <input
              type="text"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Apply Link</label>
            <input
              type="url"
              name="applyLink"
              value={formData.applyLink}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Placement"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </dialog>

      {/* Display All Placements */}
      <div className="placements-list">
        {placements.length === 0 ? (
          <p>No placements found.</p>
        ) : (
          placements.map((placement) => (
            <div key={placement._id} className="placement-card">
              <h2>{placement.companyName}</h2>
              <img
                src={placement.companyImageUrl}
                alt={`${placement.companyName} logo`}
                className="company-logo"
              />
              <p>
                <strong>Location:</strong> {placement.location}
              </p>
              <p>
                <strong>Job Role:</strong> {placement.jobRole}
              </p>
              <p>
                <strong>Job Type:</strong> {placement.jobType}
              </p>
              <p>
                <strong>Job Description:</strong> {placement.jobDescription}
              </p>
              <a
                href={placement.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-link"
              >
                Apply Now
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}