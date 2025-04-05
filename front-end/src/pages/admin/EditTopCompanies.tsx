import React, { useState, useEffect } from "react";
import axios from "axios";
import { mainUrlPrefix } from "../../main";
import "./style/EditTopCompanies.css";

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  alumni: Alumni[];
}

interface Alumni {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    batch: string;
    position: string;
    profilePicture: string;
  };
  remarks: string;
}

export default function EditTopCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get user data from sessionStorage
  const token = sessionStorage.getItem("token") || "";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const companiesRes = await axios.get(`${mainUrlPrefix}/top-companies/companies`);
      setCompanies(companiesRes.data);
    } catch (err) {
      setError("Failed to load data: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = formData._id
        ? `${mainUrlPrefix}/top-companies/companies/${formData._id}`
        : `${mainUrlPrefix}/top-companies/companies`;

      const method = formData._id ? "put" : "post";

      const { data } = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompanies((prev) =>
        formData._id
          ? prev.map((c) => (c._id === data._id ? data : c))
          : [...prev, data]
      );

      setFormData({});
      setSuccessMessage(`Company ${formData._id ? "updated" : "added"} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Operation failed: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setLoading(true);
      try {
        await axios.delete(`${mainUrlPrefix}/top-companies/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies((prev) => prev.filter((c) => c._id !== id));
        setSuccessMessage("Company deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Delete failed: " + err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteComment = async (companyId: string, alumniId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setLoading(true);
      try {
        // Use the new endpoint to delete the comment
        await axios.delete(
          `${mainUrlPrefix}/top-companies/companies/${companyId}/comments/${alumniId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update the local state by removing the deleted comment
        setCompanies(prev => 
          prev.map(c => 
            c._id === companyId 
              ? { ...c, alumni: c.alumni.filter(a => a._id !== alumniId) } 
              : c
          )
        );
        
        setSuccessMessage("Comment deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Failed to delete comment: " + err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-top-companies-container">
      <h1>Manage Top Companies</h1>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="add-company-section">
        <h2>{formData._id ? "Edit Company" : "Add New Company"}</h2>
        <form onSubmit={handleFormSubmit} className="company-form">
          <div className="form-group">
            <label htmlFor="name">Company Name:</label>
            <input
              id="name"
              required
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="logo">Logo URL:</label>
            <input
              id="logo"
              required
              value={formData.logo || ""}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              required
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website:</label>
            <input
              id="website"
              required
              type="url"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {formData._id ? "Update" : "Add"} Company
            </button>
            {formData._id && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setFormData({})}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="companies-list">
        <h2>Existing Companies</h2>
        {companies.length === 0 ? (
          <p>No companies found. Add your first company above.</p>
        ) : (
          <div className="companies-grid">
            {companies.map((company) => (
              <div key={company._id} className="company-card">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="company-logo"
                />
                <h3>{company.name}</h3>
                <p className="company-description">{company.description}</p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  Visit Website
                </a>
                
                <div className="admin-controls">
                  <button
                    className="edit-btn"
                    onClick={() => setFormData(company)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(company._id)}
                  >
                    Delete
                  </button>
                </div>
                
                <div className="alumni-comments">
                  <h4>Alumni Comments ({company.alumni.length})</h4>
                  {company.alumni.length === 0 ? (
                    <p>No comments yet.</p>
                  ) : (
                    <div className="comments-list">
                      {company.alumni.map((alumni) => (
                        <div key={alumni._id} className="comment-card">
                          <div className="comment-header">
                            <img
                              src={alumni.user.profilePicture || "/default-avatar.png"}
                              alt={`${alumni.user.firstName} ${alumni.user.lastName}`}
                              className="profile-pic"
                            />
                            <div>
                              <h5>
                                {alumni.user.firstName} {alumni.user.lastName}
                              </h5>
                              <p>
                                Batch of {alumni.user.batch} • {alumni.user.position}
                              </p>
                            </div>
                          </div>
                          <p className="comment-text">"{alumni.remarks}"</p>
                          <button
                            className="delete-comment-btn"
                            onClick={() => handleDeleteComment(company._id, alumni._id)}
                          >
                            Delete Comment
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
