import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/Placement.css";
import { mainPythonUrl, mainUrlPrefix } from "../main";

export default function Placement() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingAts, setIsLoadingAts] = useState(false);
  const [currentJd, setCurrentJd] = useState("");

  useEffect(() => {
    const fetchAllPlacements = async () => {
      try {
        const response = await axios.get(
          `${mainUrlPrefix}/placement/getAllPlacement`
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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

      const response = await axios.post(
        `${mainPythonUrl}/ats-score`,
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

  const openDialog = (jd:string) => {
    setCurrentJd(jd);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setAtsResult(null);
    setSelectedFile(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (placements.length === 0) return <div className="no-data">No placements found.</div>;

  return (
    <div className="placement-container">
      <div className="placements-grid">
        {placements.map((placement: any) => (
          <div key={placement._id} className="placement-card">
            <img
              src={placement.companyImageUrl || 'https://via.placeholder.com/150'}
              alt={`${placement.companyName} logo`}
              className="company-logo"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <h2>{placement.companyName}</h2>
            <p><strong>Role:</strong> {placement.jobRole}</p>
            <p><strong>Type:</strong> {placement.jobType}</p>
            <p><strong>Location:</strong> {placement.location}</p>
            <div className="actions">
              <button 
                className="ats-btn"
                onClick={() => openDialog(placement.jobDescription)}
              >
                ATS
              </button>
              <a
                href={placement.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
              >
                Know more
              </a>
            </div>
          </div>
        ))}
      </div>

      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>Check Resume Fit</h2>
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={handleFileChange} 
            />
            {isLoadingAts ? (
              <div className="loader">Loading...</div>
            ) : (
              atsResult && (
                <div className="ats-result">
                  <p className="atsScore"><b>Score:</b> <span className="atsScoreForResume">{atsResult.ats_score}</span></p>
                  <p className="missingWords"><b>Missing keywords:</b> <span>{atsResult.missing_keywords.join(", ")}</span></p>
                </div>
              )
            )}
            <div className="dialog-actions">
              <button onClick={handleAtsCheck} disabled={!selectedFile || isLoadingAts}>
                Check ATS Score
              </button>
              <button onClick={closeDialog}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}