import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/PlacementInfo.css";

// Define the type for a placement object
interface Placement {
  _id: string;
  companyName: string;
  jobRole: string;
  jobType: string;
  location: string;
  applyLink: string;
  companyImageUrl: string;
  jobDescription: string;
}

// Define the type for the ATS result
interface AtsResult {
  ats_score: number;
  missing_keywords: string[];
}

export default function PlacementInfo() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAtsDialogOpen, setIsAtsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false); // State for edit dialog
  const [isLoadingAts, setIsLoadingAts] = useState<boolean>(false);
  const [currentJd, setCurrentJd] = useState<string>("");
  const [currentPlacement, setCurrentPlacement] = useState<Placement | null>(
    null
  );

  useEffect(() => {
    const fetchAllPlacements = async () => {
      try {
        const response = await axios.get<Placement[]>(
          "http://localhost:8000/placement/getAllPlacement"
        );
        setPlacements(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching placements:", error);
        setError("Failed to load placements. Please try again later.");
        setLoading(false);
      }
    };

    fetchAllPlacements();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAtsCheck = async () => {
    if (!selectedFile) {
      return alert("Please select a resume file first");
    }

    setIsLoadingAts(true);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("job_description", currentJd);

      const response = await axios.post<AtsResult>(
        "http://127.0.0.1:5000/ats-score",
        formData
      );
      setAtsResult(response.data);
    } catch (error) {
      console.error("ATS Check Error:", error);
      alert("Error checking resume. Please try again.");
    } finally {
      setIsLoadingAts(false);
    }
  };

  const openAtsDialog = (jd: string) => {
    setCurrentJd(jd);
    setIsAtsDialogOpen(true);
  };

  const closeAtsDialog = () => {
    setIsAtsDialogOpen(false);
    setAtsResult(null);
    setSelectedFile(null);
  };

  // Function to handle deletion of a placement
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:8000/placement/deletePlacement/${id}`
      );
      // Remove the deleted placement from the state
      setPlacements(placements.filter((placement) => placement._id !== id));
      alert("Placement deleted successfully!");
    } catch (error) {
      console.error("Error deleting placement:", error);
      alert("Failed to delete placement. Please try again.");
    }
  };

  // Function to open the edit dialog
  const openEditDialog = (placement: Placement) => {
    setCurrentPlacement(placement);
    setIsEditDialogOpen(true);
  };

  // Function to close the edit dialog
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentPlacement(null);
  };

  // Function to handle form submission for editing
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentPlacement) return;

    try {
      const response = await axios.put<Placement>(
        `http://localhost:8000/placement/editPlacement/${currentPlacement._id}`,
        currentPlacement
      );
      // Update the placement in the state
      setPlacements(
        placements.map((placement) =>
          placement._id === currentPlacement._id ? response.data : placement
        )
      );
      closeEditDialog();
      alert("Placement updated successfully!");
    } catch (error) {
      console.error("Error updating placement:", error);
      alert("Failed to update placement. Please try again.");
    }
  };

  // Function to handle input changes in the edit form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!currentPlacement) return;

    const { name, value } = e.target;
    setCurrentPlacement({
      ...currentPlacement,
      [name]: value,
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (placements.length === 0)
    return <div className="no-data">No placements found.</div>;

  return (
    <div className="placement-container">
      <div className="placements-grid">
        {placements.map((placement) => (
          <div key={placement._id} className="placement-card">
            <img
              src={
                placement.companyImageUrl || "https://via.placeholder.com/150"
              }
              alt={`${placement.companyName} logo`}
              className="company-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
            <h2>{placement.companyName}</h2>
            <p>
              <strong>Role:</strong> {placement.jobRole}
            </p>
            <p>
              <strong>Type:</strong> {placement.jobType}
            </p>
            <p>
              <strong>Location:</strong> {placement.location}
            </p>
            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => openEditDialog(placement)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(placement._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && currentPlacement && (
        <div className="dialog-overlay">
          <div className="dialog-content" >
            <h2>Edit Placement</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                <p>Company Name:</p>
                <input
                  type="text"
                  name="companyName"
                  value={currentPlacement.companyName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <p>Job Role:</p>
                <input
                  type="text"
                  name="jobRole"
                  value={currentPlacement.jobRole}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <p>Job Type:</p>
                <input
                  type="text"
                  name="jobType"
                  value={currentPlacement.jobType}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <p>Location:</p>
                <input
                  type="text"
                  name="location"
                  value={currentPlacement.location}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <p>Apply Link:</p>
                <input
                  type="text"
                  name="applyLink"
                  value={currentPlacement.applyLink}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <p>Company Image URL:</p>
                <input
                  type="text"
                  name="companyImageUrl"
                  value={currentPlacement.companyImageUrl}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <p>Job Description:</p>
                <textarea
                  name="jobDescription"
                  value={currentPlacement.jobDescription}
                  onChange={handleInputChange}
                />
              </label>
              <div className="dialog-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={closeEditDialog}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
