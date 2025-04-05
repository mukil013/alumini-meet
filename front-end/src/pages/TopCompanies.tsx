import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/TopCompanies.css";
import { mainUrlPrefix } from "../main";

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  workers: string[];
  alumni: Array<{
    _id: string;
    name: string;
    profilePic: string;
    remarks: string;
  }>;
}

interface User {
  _id: string;
  name: string;
  role: string;
}

export default function TopCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          // Set a default user or leave as null
        }
      }
    } catch (err) {
      console.error("Error accessing sessionStorage:", err);
    }
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${mainUrlPrefix}/top-companies/companies`);
      setCompanies(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load companies. Please try again later.");
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setComment("");
  };

  const handleReadMore = (description: string) => {
    setSelectedDescription(description);
    setShowDescriptionDialog(true);
  };

  const handleCloseDescriptionDialog = () => {
    setShowDescriptionDialog(false);
  };

  const truncateDescription = (description: string, maxLines: number = 4) => {
    const lines = description.split('\n');
    if (lines.length <= maxLines) return description;
    
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  const canComment = (company: Company) => {
    if (!user) return false;
    if (user.role !== "alumni") return false;
    return company.workers.includes(user._id);
  };

  const hasCommented = (company: Company) => {
    if (!user) return false;
    return company.alumni.some(alum => alum._id === user._id);
  };

  const canDeleteComment = (alumniId: string) => {
    if (!user) return false;
    return user._id === alumniId || user.role === "admin";
  };

  const handleAddComment = async () => {
    if (!selectedCompany || !comment.trim() || !user) return;

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${mainUrlPrefix}/top-companies/companies/${selectedCompany._id}/comments`,
        { remarks: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state
      const updatedCompany = {
        ...selectedCompany,
        alumni: [
          ...selectedCompany.alumni,
          {
            _id: user._id,
            name: user.name,
            profilePic: "", // You might want to add profile picture handling
            remarks: comment
          }
        ]
      };

      setCompanies(companies.map(company => 
        company._id === selectedCompany._id ? updatedCompany : company
      ));
      setSelectedCompany(updatedCompany);
      setComment("");
      setSuccessMessage("Comment added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (companyId: string, alumniId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `${mainUrlPrefix}/top-companies/companies/${companyId}/comments/${alumniId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state
      const updatedCompany = {
        ...selectedCompany!,
        alumni: selectedCompany!.alumni.filter(alum => alum._id !== alumniId)
      };

      setCompanies(companies.map(company => 
        company._id === companyId ? updatedCompany : company
      ));
      setSelectedCompany(updatedCompany);
      setSuccessMessage("Comment deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to delete comment. Please try again.");
      console.error("Error deleting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !companies.length) {
    return <div className="loading">Loading companies...</div>;
  }

  if (error && !companies.length) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="top-companies-container">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="companies-grid">
        {companies.map(company => (
          <div
            key={company._id}
            className="company-card"
            onClick={() => handleCompanyClick(company)}
          >
            <img src={company.logo} alt={company.name} className="company-logo" />
            <h3>{company.name}</h3>
            <div className="company-description-container">
              <p className="company-description">{truncateDescription(company.description)}</p>
              <button 
                className="read-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadMore(company.description);
                }}
              >
                Read more...
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="company-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <div className="modal-header">
              <img src={selectedCompany.logo} alt={selectedCompany.name} className="modal-logo" />
              <h2>{selectedCompany.name}</h2>
            </div>
            <div className="company-description-container">
              <p>{selectedCompany.description}</p>
            </div>
            <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>

            <div className="alumni-list">
              <h3>Alumni Comments</h3>
              {selectedCompany.alumni.map(alumni => (
                <div key={alumni._id} className="alumni-card">
                  <div className="alumni-header">
                    <img
                      src={alumni.profilePic || "/default-profile.png"}
                      alt={alumni.name}
                      className="profile-pic"
                    />
                    <h4>{alumni.name}</h4>
                  </div>
                  <p className="remarks">{alumni.remarks}</p>
                  {canDeleteComment(alumni._id) && (
                    <button
                      className="delete-comment-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(selectedCompany._id, alumni._id);
                      }}
                    >
                      Delete Comment
                    </button>
                  )}
                </div>
              ))}
            </div>

            {canComment(selectedCompany) && !hasCommented(selectedCompany) && (
              <div className="add-comment-section">
                <h4>Add Your Comment</h4>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience working at this company..."
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || loading}
                >
                  {loading ? "Adding..." : "Add Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showDescriptionDialog && (
        <div className="description-dialog">
          <div className="description-dialog-content">
            <span className="close" onClick={handleCloseDescriptionDialog}>&times;</span>
            <h3>Company Description</h3>
            <div className="description-content">
              {selectedDescription.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
